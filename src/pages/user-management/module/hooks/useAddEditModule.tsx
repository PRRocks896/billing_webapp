import { useNavigate, useParams } from "react-router-dom";

import useAuth from "hooks/useAuth";
import { useFieldArray, useForm } from "react-hook-form";
import { useEffect, useMemo, useRef, useState } from "react";
import { openSnackbar } from "api/snackbar";
import { createModule, getModuleById, updateModule } from "service/module";
import {
    createBulkModuleSection,
    deleteModuleSection,
    getModuleSection,
    updateModuleSection
} from "service/moduleSection";

export type ModuleSectionFormValue = {
    sectionId?: number; // DB id — DO NOT name this `id`; RHF's useFieldArray always
                        // injects its own `id` (UUID) overwriting any field named `id`.
    name: string;
    key: string;
}

export type ModuleFormValue = {
    name: string;
    path: string;
    icon: string;
    moduleSection: ModuleSectionFormValue[];
}

const defaultValues: ModuleFormValue = {
    name: "",
    path: "",
    icon: "",
    moduleSection: []
}

const showError = (message: string) => {
    openSnackbar({
        open: true,
        message,
        variant: 'alert',
        severity: 'error',
        alert: { color: 'error' }
    });
};

const showSuccess = (message: string) => {
    openSnackbar({
        open: true,
        message,
        variant: 'alert',
        alert: { color: 'success' }
    });
};

const useAddEditModule = () => {
    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { user, startLoading, stopLoading } = useAuth();

    const [showModuleSection, setShowModuleSection] = useState<boolean>(false);

    // Tracks the IDs of sections that were loaded from the server (for delete detection)
    const originalSectionIds = useRef<number[]>([]);

    const {
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting }
    } = useForm<ModuleFormValue>({
        defaultValues,
        mode: "onChange",
    });

    const moduleSectionArray = useFieldArray({
        name: "moduleSection",
        control
    });

    const handleAddModuleSection = () => {
        moduleSectionArray.append({ sectionId: undefined, name: "", key: "" });
    }

    const handleRemoveModuleSection = (index: number) => {
        moduleSectionArray.remove(index);
    }

    const toggleModuleSection = (checked: boolean) => {
        setShowModuleSection(checked);
        if (checked && moduleSectionArray.fields.length === 0) {
            handleAddModuleSection();
        }
    }

    const handleBack = () => {
        navigate("/module");
    }

    const fetch = async () => {
        try {
            startLoading();
            const { success, message, data }: any = await getModuleById(Number(id));
            if (!success) {
                showError(message);
                return;
            }

            setValue("name", data.name);
            setValue("path", data.path);
            setValue("icon", data.icon);

            // Load existing module sections
            const { success: sectionSuccess, data: sectionData }: any = await getModuleSection({
                moduleID: Number(id),
                isDeleted: false
            });

            if (sectionSuccess && Array.isArray(sectionData) && sectionData.length > 0) {
                // Store original IDs so we can detect deletions later
                originalSectionIds.current = sectionData.map((s: any) => s.id);

                // Pre-fill form with sectionId (NOT `id` — that's reserved by RHF)
                moduleSectionArray.replace(
                    sectionData.map((s: any) => ({ sectionId: s.id, name: s.name, key: s.key }))
                );
                setShowModuleSection(true);
            }
        } catch (error: any) {
            showError(error?.message || 'Something went wrong');
        } finally {
            stopLoading();
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // onSubmit
    // ─────────────────────────────────────────────────────────────────────────────
    const onSubmit = async (data: ModuleFormValue) => {
        try {
            startLoading();
            const { moduleSection, ...rest } = data;

            // ── ADD MODE ─────────────────────────────────────────────────────────
            if (mode === 'add') {
                const payload: any = { ...rest, createdBy: user?.id };

                // Backend POST /module already handles moduleSection[] and creates sectionRights
                if (moduleSection?.length > 0) {
                    payload.moduleSection = moduleSection.map(ms => ({ name: ms.name, key: ms.key }));
                }

                const { success, message }: any = await createModule(payload);
                if (success) {
                    showSuccess(message);
                    handleBack();
                } else {
                    showError(message);
                }
                return;
            }

            // ── EDIT MODE ────────────────────────────────────────────────────────
            if (mode === 'edit' && id) {
                // Split sections into: new (no sectionId) and existing (has sectionId)
                const newSections = moduleSection.filter(ms => !ms.sectionId);
                const existingSections = moduleSection.filter(ms => !!ms.sectionId);

                // Find deleted sections: were in originalSectionIds but no longer in the form
                const currentIds = new Set(existingSections.map(ms => ms.sectionId));
                const deletedIds = originalSectionIds.current.filter(origId => !currentIds.has(origId));

                // 1. Create new sections + their sectionRights (handled by backend)
                if (newSections.length > 0) {
                    const { success: createSuccess, message: createMsg }: any = await createBulkModuleSection(
                        newSections.map(ms => ({
                            name: ms.name,
                            key: ms.key,
                            moduleID: Number(id),
                            createdBy: user?.id
                        }))
                    );
                    if (!createSuccess) {
                        showError(createMsg);
                        return;
                    }
                }

                // 2. Update existing sections (name or key may have changed)
                if (existingSections.length > 0) {
                    const updateResults = await Promise.all(
                        existingSections.map(ms =>
                            updateModuleSection(
                                { name: ms.name, key: ms.key, updatedBy: user?.id },
                                ms.sectionId!
                            )
                        )
                    );
                    const failedUpdate = updateResults.find((r: any) => !r?.success);
                    if (failedUpdate) {
                        showError((failedUpdate as any)?.message || 'Failed to update one or more sections');
                        return;
                    }
                }

                // 3. Soft-delete removed sections
                if (deletedIds.length > 0) {
                    const deleteResults = await Promise.all(
                        deletedIds.map(sectionId => deleteModuleSection(sectionId))
                    );
                    const failedDelete = deleteResults.find((r: any) => !r?.success);
                    if (failedDelete) {
                        showError((failedDelete as any)?.message || 'Failed to delete one or more sections');
                        return;
                    }
                }

                // 4. Update the module itself
                const { success, message }: any = await updateModule(
                    { ...rest, updatedBy: user?.id },
                    Number(id)
                );
                if (success) {
                    showSuccess(message);
                    handleBack();
                } else {
                    showError(message);
                }
            }
        } catch (error: any) {
            showError(error?.message || 'Something went wrong');
        } finally {
            stopLoading();
        }
    }

    const title: string = useMemo(() => {
        return mode === 'edit' && id ? 'Edit Module' : 'Add Module';
    }, [mode, id]);

    useEffect(() => {
        if (mode === 'edit' && id) {
            fetch();
        }
    }, [mode, id]);

    return {
        mode,
        title,
        control,
        isSubmitting,
        showModuleSection,
        moduleSectionArray,
        setValue,
        onSubmit,
        handleBack,
        handleSubmit,
        toggleModuleSection,
        handleAddModuleSection,
        handleRemoveModuleSection
    }
}

export default useAddEditModule;
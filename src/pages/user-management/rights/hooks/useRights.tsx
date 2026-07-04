import { useEffect, useRef, useState } from "react";
import useAuth from "hooks/useAuth";
import { useFieldArray, useForm } from "react-hook-form";
import { openSnackbar } from "api/snackbar";
import { getRoleList } from "service/role";
import { getRightList, createBulkRight } from "service/rights";
import { getAllSectionRights, createBulkSectionRight } from "service/sectionRight";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SectionRightItem = {
    sectionRightID: number;
    moduleSectionID: number;
    sectionName: string;
    sectionKey: string;
    view: boolean;
    download: boolean;
    upload: boolean;
};

export type ModuleType = {
    rightID: number;
    moduleID: number;
    moduleName: string;
    all: boolean;
    view: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
    // Sections belonging to this module
    sections: SectionRightItem[];
    // UI state — which module rows are expanded
    expanded: boolean;
};

export type RightsFormValue = {
    roleID: number | null;
    modules: ModuleType[];
};

const defaultValues: RightsFormValue = {
    roleID: null,
    modules: [],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const showSnack = (message: string, color: 'success' | 'error' | 'info') => {
    openSnackbar({
        open: true,
        message: message || 'Something went wrong',
        variant: 'alert',
        severity: color,
        alert: { color },
    });
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

const UseRights = () => {
    const { user, startLoading, stopLoading } = useAuth();
    const [roles, setRoles] = useState<any[]>([]);

    // Snapshot of server-fetched values for dirty-checking on submit
    const originalModulesRef = useRef<ModuleType[]>([]);
    const originalSectionRightsRef = useRef<SectionRightItem[]>([]);

    const {
        control,
        reset,
        setValue,
        getValues,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<RightsFormValue>({
        mode: "onChange",
        defaultValues,
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "modules",
    });

    // ── Load roles on mount ───────────────────────────────────────────────────
    useEffect(() => {
        (async () => {
            try {
                startLoading();
                const { success, message, data }: any = await getRoleList({
                    where: { isDeleted: false },
                    pagination: { page: 1, rows: 1000, sortBy: "createdAt", descending: true },
                });
                if (success) {
                    setRoles(data.rows);
                } else {
                    showSnack(message, 'error');
                }
            } catch (error: any) {
                showSnack(error?.message || 'Something went wrong', 'error');
            } finally {
                stopLoading();
            }
        })();
    }, []);

    // ── Fetch rights + section rights for a role ──────────────────────────────
    const fetchRightsModuleData = async (roleID: number) => {
        try {
            startLoading();

            // Reset form keeping the selected roleID
            reset({ roleID: getValues("roleID"), modules: [] });

            // 1. Fetch module-level rights
            const { success: rSuccess, message: rMsg, data: rData }: any = await getRightList({
                where: { isDeleted: false, isActive: true, roleID },
                pagination: { page: 1, rows: 1000, sortBy: "createdAt", descending: true },
            });

            if (!rSuccess) {
                showSnack(rMsg, 'error');
                return;
            }

            // 2. Fetch all section-level rights for this role in one call
            const { success: sSuccess, data: sData }: any = await getAllSectionRights({
                roleID,
                isDeleted: false,
            });

            // Build a map: moduleID → SectionRightItem[]
            const sectionsByModule = new Map<number, SectionRightItem[]>();
            if (sSuccess && Array.isArray(sData)) {
                for (const sr of sData) {
                    const moduleID = sr.px_module_section?.moduleID;
                    if (!moduleID) continue;
                    if (!sectionsByModule.has(moduleID)) {
                        sectionsByModule.set(moduleID, []);
                    }
                    sectionsByModule.get(moduleID)!.push({
                        sectionRightID: sr.id,
                        moduleSectionID: sr.moduleSectionID,
                        sectionName: sr.px_module_section?.name ?? '',
                        sectionKey: sr.px_module_section?.key ?? '',
                        view: sr.view,
                        download: sr.download,
                        upload: sr.upload,
                    });
                }
            }

            // 3. Map module rights and attach sections
            const mapped: ModuleType[] = [];
            const rows = rData?.rows ?? [];

            for (const res of rows) {
                const moduleID: number = res.moduleID;
                const sections = sectionsByModule.get(moduleID) ?? [];

                const module: ModuleType = {
                    rightID: res.id,
                    moduleID,
                    moduleName: res?.px_module?.name ?? '',
                    all: res.view && res.add && res.edit && res.delete,
                    view: res.view,
                    add: res.add,
                    edit: res.edit,
                    delete: res.delete,
                    sections,
                    expanded: sections.length > 0, // auto-expand modules that have sections
                };
                mapped.push(module);
                append(module);
            }

            originalModulesRef.current = mapped;
            // Snapshot all section rights for dirty-check
            originalSectionRightsRef.current = mapped.flatMap((m) => m.sections);
        } catch (error: any) {
            showSnack(error?.message || 'Something went wrong', 'error');
        } finally {
            stopLoading();
        }
    };

    // ── Toggle expand/collapse for a module row ───────────────────────────────
    const toggleExpanded = (index: number) => {
        const current = getValues(`modules.${index}.expanded`);
        setValue(`modules.${index}.expanded`, !current);
    };

    // ── "All" checkbox handler for module-level permissions ───────────────────
    const onChangeAllHandler = (tag: string, index: number, newValue: boolean) => {
        if (tag === "all") {
            setValue(`modules.${index}.view`, newValue);
            setValue(`modules.${index}.add`, newValue);
            setValue(`modules.${index}.edit`, newValue);
            setValue(`modules.${index}.delete`, newValue);
        } else {
            const isChecked =
                getValues(`modules.${index}.view`) &&
                getValues(`modules.${index}.add`) &&
                getValues(`modules.${index}.edit`) &&
                getValues(`modules.${index}.delete`);
            setValue(`modules.${index}.all`, isChecked);
        }
    };

    // ── "All" for section row: view + download + upload ──────────────────────
    const onChangeSectionAllHandler = (moduleIndex: number, sectionIndex: number, newValue: boolean) => {
        setValue(`modules.${moduleIndex}.sections.${sectionIndex}.view`, newValue);
        setValue(`modules.${moduleIndex}.sections.${sectionIndex}.download`, newValue);
        setValue(`modules.${moduleIndex}.sections.${sectionIndex}.upload`, newValue);
    };

    // ── Submit ────────────────────────────────────────────────────────────────
    const onSubmit = async (info: RightsFormValue) => {
        try {
            startLoading();

            const origModules = originalModulesRef.current;
            const origSections = originalSectionRightsRef.current;

            // Build module-right upsert payload (only changed rows)
            const modifiedModules = info.modules.filter((res, idx) => {
                const orig = origModules[idx];
                if (!orig) return true;
                return (
                    res.view !== orig.view ||
                    res.add !== orig.add ||
                    res.edit !== orig.edit ||
                    res.delete !== orig.delete
                );
            });

            // Build section-right upsert payload (only changed rows)
            const allCurrentSections = info.modules.flatMap((m) => m.sections);
            const modifiedSections = allCurrentSections.filter((sec) => {
                const orig = origSections.find((o) => o.sectionRightID === sec.sectionRightID);
                if (!orig) return true;
                return (
                    sec.view !== orig.view ||
                    sec.download !== orig.download ||
                    sec.upload !== orig.upload
                );
            });

            if (modifiedModules.length === 0 && modifiedSections.length === 0) {
                showSnack('No changes detected.', 'info');
                return;
            }

            // 1. Save module rights
            if (modifiedModules.length > 0) {
                const modulePayload = modifiedModules.map((res) => ({
                    id: res.rightID,
                    roleID: info.roleID,
                    moduleID: res.moduleID,
                    add: res.add,
                    view: res.view,
                    edit: res.edit,
                    delete: res.delete,
                    ...(res.rightID ? { updatedBy: user?.id } : { createdBy: user?.id }),
                }));
                const { success: mSuccess, message: mMsg }: any = await createBulkRight(modulePayload);
                if (!mSuccess) {
                    showSnack(mMsg, 'error');
                    return;
                }
            }

            // 2. Save section rights
            if (modifiedSections.length > 0) {
                const sectionPayload = modifiedSections.map((sec) => ({
                    id: sec.sectionRightID,
                    roleID: info.roleID,
                    moduleSectionID: sec.moduleSectionID,
                    view: sec.view,
                    download: sec.download,
                    upload: sec.upload,
                    ...(sec.sectionRightID ? { updatedBy: user?.id } : { createdBy: user?.id }),
                }));
                const { success: sSuccess, message: sMsg }: any = await createBulkSectionRight(sectionPayload);
                if (!sSuccess) {
                    showSnack(sMsg, 'error');
                    return;
                }
            }

            showSnack('Rights assigned successfully.', 'success');
            reset({ roleID: null, modules: [] });
        } catch (error: any) {
            showSnack(error?.message || 'Something went wrong', 'error');
        } finally {
            stopLoading();
        }
    };

    const cancelHandler = () => {
        reset({ roleID: null, modules: [] });
    };

    return {
        roles,
        fields,
        control,
        isSubmitting,
        reset,
        onSubmit,
        setValue,
        getValues,
        handleSubmit,
        cancelHandler,
        toggleExpanded,
        onChangeAllHandler,
        onChangeSectionAllHandler,
        fetchRightsModuleData,
    };
};

export default UseRights;
import { useNavigate, useParams } from "react-router-dom";

import useAuth from "hooks/useAuth";
import { useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { openSnackbar } from "api/snackbar";
import { createModule, getModuleById, updateModule } from "service/module";

export type ModuleFormValue = {
    name: string;
    path: string;
    icon: string;
}
const defaultValues: ModuleFormValue = {
    name: "",
    path: "",
    icon: "",
}

const useAddEditModule = () => {
    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { user, startLoading, stopLoading } = useAuth();

    const {
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting }
    } = useForm<ModuleFormValue>({
        defaultValues,
        mode: "onChange",
    });

    const handleBack = () => {
        navigate("/module");
    }

    const fetch = async () => {
        try {
            startLoading();
            const { success, message, data }: any = await getModuleById(Number(id));
            if (success) {
                setValue("name", data.name);
                setValue("path", data.path);
                setValue("icon", data.icon);
            } else {
                openSnackbar({
                    open: true,
                    message: message,
                    variant: 'alert',
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                });
            }
        } catch (error: any) {
            openSnackbar({
                open: true,
                message: error?.message || error?.messageCode || (error as Error).message || 'Something went wrong',
                variant: 'alert',
                alert: {
                    color: 'error'
                }
            })
        } finally {
            stopLoading();
        }
    }

    const onSubmit = async (data: ModuleFormValue) => {
        try {
            startLoading();
            let payload: any = {
                ...data
            }
            if (mode && mode === 'edit' && id) {
                payload = {
                    ...payload,
                    updatedBy: user?.id
                }
            } else {
                payload = {
                    ...payload,
                    createdBy: user?.id
                }
            }
            const { success, message }: any = mode && mode === 'edit' && id ? await updateModule(payload, Number(id)) : await createModule(payload);
            if (success) {
                openSnackbar({
                    open: true,
                    message: message,
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    }
                });
                handleBack();
            } else {
                openSnackbar({
                    open: true,
                    message: message,
                    variant: 'alert',
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                });
            }
        } catch (error: any) {
            openSnackbar({
                open: true,
                message: error?.message || error?.messageCode || (error as Error).message || 'Something went wrong',
                variant: 'alert',
                alert: {
                    color: 'error'
                }
            })
        } finally {
            stopLoading();
        }
    }

    const title: string = useMemo(() => {
        if (mode && mode === 'edit' && id) {
            return 'Edit Module';
        }
        return 'Add Module';
    }, [mode, id]);

    useEffect(() => {
        if (mode && mode === 'edit' && id) {
            fetch();
        }
    }, [mode, id]);

    return {
        mode,
        title,
        control,
        isSubmitting,
        onSubmit,
        handleBack,
        handleSubmit,
    }
}

export default useAddEditModule;
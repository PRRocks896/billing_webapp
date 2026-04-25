import { useNavigate, useParams } from "react-router-dom";

import useAuth from "hooks/useAuth";
import { useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { openSnackbar } from "api/snackbar";
import { createRole, getRoleById, updateRole } from "service/role";

export type RoleFormValue = {
    name: string;
}
const defaultValues: RoleFormValue = {
    name: "",
}

const useAddEditRole = () => {
    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { user, startLoading, stopLoading } = useAuth();

    const {
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting }
    } = useForm<RoleFormValue>({
        defaultValues,
        mode: "onChange",
    });

    const handleBack = () => {
        navigate("/role");
    }

    const fetch = async () => {
        try {
            startLoading();
            const { success, message, data }: any = await getRoleById(Number(id));
            if (success) {
                setValue("name", data.name);
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

    const onSubmit = async (data: RoleFormValue) => {
        try {
            startLoading();
            let payload: any = {
                name: data.name
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
            const { success, message }: any = mode && mode === 'edit' && id ? await updateRole(payload, Number(id)) : await createRole(payload);
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
            return 'Edit Role';
        }
        return 'Add Role';
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

export default useAddEditRole
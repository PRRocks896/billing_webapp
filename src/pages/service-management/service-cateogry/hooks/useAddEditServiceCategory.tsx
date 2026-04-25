import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createServiceCategory, getServiceCategoryById, updateServiceCategory } from "service/service-category";

export type ServiceCategoryType = {
    name: string;
}

const defaultValues: ServiceCategoryType = {
    name: "",
}

const UseAddEditServiceCategory = () => {
    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { user } = useAuth();

    const {
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting }
    } = useForm<ServiceCategoryType>({
        defaultValues,
        mode: "onChange",
    });

    const handleBack = () => {
        navigate("/service-category");
    }

    const fetch = async () => {
        try {
            const { success, message, data }: any = await getServiceCategoryById(Number(id));
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
        }
    }

    const onSubmit = async (data: ServiceCategoryType) => {
        try {
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
            const { success, message }: any = mode && mode === 'edit' && id ? await updateServiceCategory(payload, Number(id)) : await createServiceCategory(payload);
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
        }
    }

    const title: string = useMemo(() => {
        if (mode && mode === 'edit' && id) {
            return 'Edit Service Category';
        }
        return 'Add Service Category';
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

export default UseAddEditServiceCategory;
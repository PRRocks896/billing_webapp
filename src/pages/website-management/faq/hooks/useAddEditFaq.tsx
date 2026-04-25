import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createFaq, updateFaq, getFaqById } from "service/faq";

export type FaqForm = {
    title: string;
    description: string;
}

const defaultValues: FaqForm = {
    title: "",
    description: ""
}

const UseAddEditFaq = () => {
    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { user, startLoading, stopLoading } = useAuth();

    const {
        control,
        formState: { isSubmitting },
        watch,
        setValue,
        getValues,
        handleSubmit
    } = useForm<FaqForm>({
        defaultValues,
        mode: 'onBlur'
    });

    const handleBack = () => {
        navigate("/website-management/faq");
    }

    const fetch = async () => {
        try {
            startLoading();
            const { success, message, data }: any = await getFaqById(Number(id));
            if (success) {
                setValue("title", data.title);
                setValue("description", data.description);
            } else {
                openSnackbar({
                    open: true,
                    message: message || 'Something went wrong',
                    variant: 'alert',
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                })
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

    const onSubmit = async (data: FaqForm) => {
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

            const { success, message }: any = mode && mode === 'edit' && id ? await updateFaq(payload, Number(id)) : await createFaq(payload);
            openSnackbar({
                open: true,
                message: message,
                variant: 'alert',
                severity: success ? 'success' : 'error',
                alert: {
                    color: success ? 'success' : 'error'
                }
            });
            if (success) {
                handleBack();
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
            return 'Edit FAQ';
        }
        return 'Add FAQ';
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
        watch,
        setValue,
        getValues,
        handleBack,
        handleSubmit,
    }
}

export default UseAddEditFaq;

import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createPaymentType, getPaymentTypeById, updatePaymentType } from "service/payment-type";

export type PaymentType = {
    name: string;
}

const defaultValues: PaymentType = {
    name: "",
}


const UseAddEditPaymentType = () => {

    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { user, startLoading, stopLoading } = useAuth();

    const {
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting }
    } = useForm<PaymentType>({
        defaultValues,
        mode: "onChange",
    });

    const handleBack = () => {
        navigate("/payment-type");
    }

    const fetch = async () => {
        try {
            startLoading();
            const { success, message, data }: any = await getPaymentTypeById(Number(id));
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

    const onSubmit = async (data: PaymentType) => {
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
            const { success, message }: any = mode && mode === 'edit' && id ? await updatePaymentType(payload, Number(id)) : await createPaymentType(payload);
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
            return 'Edit Payment Type';
        }
        return 'Add Payment Type';
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

export default UseAddEditPaymentType
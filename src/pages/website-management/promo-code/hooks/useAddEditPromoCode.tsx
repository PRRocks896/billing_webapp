import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createPromoCode, updatePromoCode, getPromoCodeById } from "service/promoCode";
import { convertToFormData } from "utils/helper";

export type PromoCodeType = {
    name: string;
    code: string;
    description: string;
    image: any;
    type: string;
    value: string;
}

const defaultValues: PromoCodeType = {
    name: "",
    code: "",
    description: "",
    image: null,
    type: "",
    value: ""
}

const UseAddEditPromoCode = () => {
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
    } = useForm<PromoCodeType>({
        defaultValues,
        mode: 'onBlur'
    });

    const handleBack = () => {
        navigate('/website-management/promo-code')
    }

    const fetch = async () => {
        try {
            startLoading();
            const { success, message, data }: any = await getPromoCodeById(Number(id));
            if (success) {
                setValue("name", data.name);
                setValue("code", data.code);
                setValue("description", data.description);
                setValue("image", data.image && Array.isArray(data.image) ? data.image : data.image ? data.image : null);
                setValue("type", data.type);
                setValue("value", data.value);
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

    const onSubmit = async (data: PromoCodeType) => {
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

            if (data && data.image) {
                if (typeof data.image === 'object') {
                    payload = convertToFormData(payload);
                    payload.append('image', data.image);
                } else {
                    delete payload['image']
                }
            }

            const { success, message }: any = mode && mode === 'edit' && id ? await updatePromoCode(payload, Number(id)) : await createPromoCode(payload);
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
            return 'Edit Promo Code';
        }
        return 'Add Promo Code';
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

export default UseAddEditPromoCode;
import { openSnackbar } from "api/snackbar";
import countries, { CountryType } from "data/countries";
import useAuth from "hooks/useAuth";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createWebSetting, updateWebSetting, getWebSettingById } from "service/web-setting";
import { convertToFormData } from "utils/helper";

export type WebSettingType = {
    identifier: string;
    slug: string;
    value: string;
    image: string;
}

const defaultValues: WebSettingType = {
    identifier: "",
    slug: "",
    value: "",
    image: "",
}

const UseAddEditWebSetting = () => {
    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { isAdmin, user, startLoading, stopLoading } = useAuth();

    const {
        control,
        formState: { isSubmitting },
        watch,
        setValue,
        getValues,
        handleSubmit
    } = useForm<WebSettingType>({
        defaultValues,
        mode: 'onBlur'
    });

    const fetch = async () => {
        try {
            startLoading();
            const { success, message, data }: any = await getWebSettingById(Number(id));
            if (success) {
                setValue("identifier", data.identifier);
                setValue("slug", data.slug);
                setValue("value", data.value);
                setValue("image", data.image);
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

    const onSubmit = async (data: WebSettingType) => {
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
            if (data.image && typeof data.image === 'object') {
                payload = convertToFormData(payload);
                payload.append('image', data.image);
            }

            const { success, message }: any = mode && mode === 'edit' && id ? await updateWebSetting(payload, Number(id)) : await createWebSetting(payload);
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

    const handleBack = () => {
        navigate("/website-management/web-setting");
    }

    const title: string = useMemo(() => {
        if (mode && mode === 'edit' && id) {
            return 'Edit Web Setting';
        }
        return 'Add Web Setting';
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

export default UseAddEditWebSetting;
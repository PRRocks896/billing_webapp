import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createSeo, updateSeo, getSeoById } from "service/seo";
import { convertToFormData } from "utils/helper";

export type SeoType = {
    title: string;
    description: string;
    slug: string;
    structuredData: any;
    image: any[];
    keywords: string[];
    tags: string[];
    pagePath: string;
}

const defaultValues: SeoType = {
    title: "",
    description: "",
    slug: "",
    image: [],
    keywords: [],
    tags: [],
    pagePath: "",
    structuredData: null
};

const UseAddEditSeo = () => {
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
    } = useForm<SeoType>({
        defaultValues,
        mode: 'onBlur'
    });

    const handleBack = () => {
        navigate("/website-management/seo");
    }

    const fetch = async () => {
        try {
            startLoading();
            const { success, message, data }: any = await getSeoById(Number(id));
            if (success) {
                setValue("title", data.title);
                setValue("description", data.description);
                setValue("slug", data.slug);
                setValue("image", data.image && Array.isArray(data.image) ? data.image : data.image ? data.image : null);
                setValue("keywords", data.keywords && data.keywords.split(','));
                setValue("tags", data.tags && data.tags.split(','));
                setValue("pagePath", data.pagePath);
                setValue("structuredData", data.structuredData ? JSON.stringify(data.structuredData, null, 2) : "{}");
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

    const onSubmit = async (data: SeoType) => {
        try {
            startLoading();
            console.log("Data: ", data);
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

            if (data && data.keywords && Array.isArray(data.keywords)) {
                payload.keywords = data.keywords.join(',');
            }

            if (data && data.tags && Array.isArray(data.tags)) {
                payload.tags = data.tags.join(',');
            }
            console.log("Payload: ", payload);
            if (data && data.image) {
                if (typeof data.image === 'object') {
                    payload = convertToFormData(payload);
                    payload.append('image', data.image);
                } else {
                    delete payload['image']
                }
            }

            console.log(payload);

            const { success, message }: any = mode && mode === 'edit' && id ? await updateSeo(payload, Number(id)) : await createSeo(payload);
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
            return 'Edit SEO';
        }
        return 'Add SEO';
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

export default UseAddEditSeo;

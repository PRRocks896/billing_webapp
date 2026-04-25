import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createBlog, updateBlog, getBlogById } from "service/blog";
import { convertToFormData } from "utils/helper";

export type BlogFormType = {
    title: string;
    description: string;
    slug: string;
    shortDescription: string;
    thumbnilImage: any;
    metaKeywords: string[];
    metaTags: string[];
    metaDescription: string;
}

const defaultValues: BlogFormType = {
    title: "",
    description: "",
    slug: "",
    shortDescription: "",
    thumbnilImage: null,
    metaKeywords: [],
    metaTags: [],
    metaDescription: ""
}

const UseAddEditBlog = () => {
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
    } = useForm<BlogFormType>({
        defaultValues,
        mode: 'onBlur'
    });

    const handleBack = () => {
        navigate("/website-management/blog");
    }

    const fetch = async () => {
        try {
            startLoading();
            const { success, message, data }: any = await getBlogById(Number(id));
            if (success) {
                setValue("title", data.title);
                setValue("description", data.description);
                setValue("slug", data.slug);
                setValue("shortDescription", data.shortDescription);
                setValue("thumbnilImage", [data.thumbnilImage]);
                setValue("metaKeywords", data.metaKeywords.split(','));
                setValue("metaTags", data.metaTags.split(','));
                setValue("metaDescription", data.metaDescription);
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

    const onSubmit = async (data: BlogFormType) => {
        try {
            startLoading();
            let payload: any = {
                ...data,
                metaKeywords: data.metaKeywords.join(','),
                metaTags: data.metaTags.join(','),
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

            if (data.thumbnilImage && typeof data.thumbnilImage === 'object') {
                payload = convertToFormData(payload);
            }

            if (data.thumbnilImage && typeof data.thumbnilImage === 'object') {
                payload.append('thumbnilImage', data.thumbnilImage);
            }

            const { success, message }: any = mode && mode === 'edit' && id ? await updateBlog(payload, Number(id)) : await createBlog(payload);
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
            return 'Edit Blog';
        }
        return 'Add Blog';
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

export default UseAddEditBlog;
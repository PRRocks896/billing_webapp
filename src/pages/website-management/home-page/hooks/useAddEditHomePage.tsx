import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createHomePage, updateHomePage, getHomePageById } from "service/home-page";
import { convertToFormData } from "utils/helper";

export type HomePageType = {
    title: string;
    description: string;
    image: any;
    video: any;
    detail: string;
    tag: string;
}

const defaultValues: HomePageType = {
    title: "",
    description: "",
    image: "",
    video: "",
    detail: "",
    tag: "",
}

const UseAddEditHomePage = () => {
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
    } = useForm<HomePageType>({
        defaultValues,
        mode: 'onBlur'
    });

    const handleBack = () => {
        navigate("/website-management/home-page");
    }

    const fetch = async () => {
        try {
            startLoading();
            const { success, message, data }: any = await getHomePageById(Number(id));
            if (success) {
                setValue("title", data.title);
                setValue("description", data.description);
                setValue("image", [data?.image]);
                setValue("video", data?.video && data?.video.length > 0 ? [data?.video] : "");
                setValue("detail", data?.detail);
                setValue("tag", data?.tag);
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

    const onSubmit = async (data: HomePageType) => {
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

            if (data && (data.image && typeof data.image === 'object') || (data.video && typeof data.video === 'object')) {
                payload = convertToFormData(payload);
            }

            if (data.image && typeof data.image === 'object') {
                payload.append('image', data.image);
            }
            if (data.video && typeof data.video === 'object') {
                payload.append('video', data.video);
            }

            const { success, message }: any = mode && mode === 'edit' && id ? await updateHomePage(payload, Number(id)) : await createHomePage(payload);
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
            return 'Edit Home Page';
        }
        return 'Add Home Page';
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

export default UseAddEditHomePage;
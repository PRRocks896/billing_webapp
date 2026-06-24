import { openSnackbar } from "api/snackbar";
import { FileUploadValue } from "components/FileUpload";
import useAuth from "hooks/useAuth";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createGiftCategory, getGiftCategoryById, updateGiftCategory } from "service/giftCategory";
import { convertToFormData } from "utils/helper";

export type GiftCategoryFormValue = {
    name: string;
    description: string;
    image: FileUploadValue | null;
}

const defaultValues: GiftCategoryFormValue = {
    name: '',
    description: '',
    image: null,
}

const UseAddEditGiftCategory = () => {
    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { user, startLoading, stopLoading } = useAuth();

    const {
        control,
        formState: { isSubmitting },
        setValue,
        handleSubmit,
    } = useForm<GiftCategoryFormValue>({
        mode: 'onChange',
        defaultValues,
    });

    const handleBack = () => {
        navigate('/gift-category');
    }

    const fetch = async () => {
        try {
            const { success, message, data }: any = await getGiftCategoryById(Number(id));
            if (success) {
                setValue('name', data.name);
                setValue('description', data.description);
                setValue('image', data.image);
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
        }
    }

    const onSubmit = async (data: GiftCategoryFormValue) => {
        try {
            let payload: any = {
                name: data.name,
                description: data.description,
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
            if (data && data.image && typeof data.image === 'object') {
                payload = convertToFormData(payload);
                payload.append(mode === 'edit' ? 'newImage' : 'image', data.image);
            }
            const { success, message }: any = mode && mode === 'edit' && id ? await updateGiftCategory(payload, Number(id)) : await createGiftCategory(payload);
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
                severity: 'error',
                alert: {
                    color: 'error'
                }
            })
        }
    }

    const title: string = useMemo(() => {
        if (mode && mode === 'edit' && id) {
            return 'Edit Gift Category';
        }
        return 'Add Gift Category';
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
        setValue,
        handleBack,
        handleSubmit,
    }
}

export default UseAddEditGiftCategory;
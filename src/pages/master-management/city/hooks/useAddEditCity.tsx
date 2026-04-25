import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getStatesList } from "service/state";
import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import { useForm } from "react-hook-form";
import { createCity, getCityById, updateCity } from "service/city";
import { convertToFormData, generateSlug } from 'utils/helper';

export type CityFormValue = {
    name: string,
    slug: string,
    stateID: number | null,
    description: string,
    image: string
    backgroundImage: string;
}

const defaultValues: CityFormValue = {
    name: '',
    slug: '',
    stateID: null,
    description: '',
    image: '',
    backgroundImage: ''
}

const UseAddEditCity = () => {

    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { user, startLoading, stopLoading } = useAuth();

    const [statesList, setStatesList] = useState<any[]>([]);

    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
        setValue,
        reset,
    } = useForm<CityFormValue>({
        mode: 'onChange',
        defaultValues,
    });

    const handleBack = () => {
        navigate('/city');
    }

    const fetch = async () => {
        try {
            startLoading();
            const { success, message, data }: any = await getCityById(Number(id));
            if (success) {
                setValue('name', data.name);
                setValue('slug', data.slug);
                setValue('stateID', data.stateID);
                setValue('description', data.description);
                setValue('image', data.image);
                setValue('backgroundImage', data.backgroundImage);
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
                severity: 'error',
                alert: {
                    color: 'error'
                }
            })
        } finally {
            stopLoading();
        }
    }

    const onSubmit = async (data: CityFormValue) => {
        try {
            startLoading();
            let payload: any = {
                name: data.name,
                slug: data.slug,
                stateID: data.stateID,
                description: data.description,
            };
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

            if (data && (data.image && typeof data.image === 'object') || (data.backgroundImage && typeof data.backgroundImage === 'object')) {
                payload = convertToFormData(payload);
            }

            if (data.image && typeof data.image === 'object') {
                payload.append('image', data.image);
            }

            if (data.backgroundImage && typeof data.backgroundImage === 'object') {
                payload.append('backgroundImage', data.backgroundImage);
            }

            const { success, message }: any = mode && mode === 'edit' && id ? await updateCity(payload, Number(id)) : await createCity(payload);
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
        } finally {
            stopLoading();
        }
    }

    useEffect(() => {
        (async () => {
            try {
                startLoading();
                const payload = {
                    where: {
                        isDeleted: false,
                    },
                    pagination: {
                        page: 1,
                        rows: 1000,
                        sortBy: "createdAt",
                        descending: true,
                    },
                };
                const { success, message, data }: any = await getStatesList(payload);
                if (success) {
                    const payload = data?.rows || [];
                    setStatesList(payload);
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
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                })
            } finally {
                stopLoading();
            }
        })();
    }, []);

    const title: string = useMemo(() => {
        if (mode && mode === 'edit' && id) {
            return 'Edit City';
        }
        return 'Add City';
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
        statesList,
        isSubmitting,
        setValue,
        onSubmit,
        handleBack,
        handleSubmit,
    }
}

export default UseAddEditCity;

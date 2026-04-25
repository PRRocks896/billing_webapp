import { openSnackbar } from "api/snackbar";
import countries from "data/countries";
import useAuth from "hooks/useAuth";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createWhatsapp, getWhatsappById, updateWhatsapp } from "service/whatsapp";
import { getBranch } from "service/user";

export type WhatsappFormValue = {
    userID: number | null;
    link: string;
    number: string;
}

const defaultValues: WhatsappFormValue = {
    userID: null,
    link: "",
    number: ""
}

const UseAddEditWhatsapp = () => {
    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { user, isAdmin, startLoading, stopLoading } = useAuth();

    const [branchList, setBranchList] = useState<any[]>([]);


    const {
        control,
        formState: { isSubmitting },
        setValue,
        getValues,
        handleSubmit,
    } = useForm<WhatsappFormValue>({
        defaultValues,
        mode: 'onBlur'
    });

    const handleBack = () => {
        navigate("/website-management/whatsapp");
    }

    const fetch = async () => {
        try {
            startLoading();
            const { success, message, data }: any = await getWhatsappById(Number(id));
            if (success) {
                setValue("userID", data.userID);
                setValue("number", data.number);
                setValue("link", data.link);
            } else {
                openSnackbar({
                    open: true,
                    message: message || 'Something went Wrong',
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

    const onSubmit = async (data: WhatsappFormValue) => {
        try {
            startLoading();
            let payload: any = {
                ...data
            };
            if (mode && mode === 'edit' && id) {
                payload = {
                    ...payload,
                    updatedBy: user?.id
                };
            } else {
                payload = {
                    ...payload,
                    createdBy: user?.id
                };
            }
            const { success, message }: any = mode && mode === 'edit' && id ? await updateWhatsapp(payload, Number(id)) : await createWhatsapp(payload);
            openSnackbar({
                open: true,
                message: message || 'Whatsapp saved successfully',
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
                const { success, message, data }: any = await getBranch({
                    isActive: true,
                    isDeleted: false,
                });
                if (success) {
                    setBranchList(data);
                } else {
                    openSnackbar({
                        open: true,
                        message: message || 'Something went Wrong',
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
        })();
    }, []);

    const title: string = useMemo(() => {
        if (mode && mode === 'edit' && id) {
            return 'Edit Whatsapp';
        }
        return 'Add Whatsapp';
    }, [mode, id]);

    useEffect(() => {
        if (mode && mode === 'edit' && id) {
            fetch();
        }
    }, [mode, id]);

    return {
        title,
        control,
        branchList,
        isSubmitting,
        setValue,
        onSubmit,
        handleBack,
        handleSubmit,
    }
}

export default UseAddEditWhatsapp;
import { useNavigate, useParams } from "react-router-dom";

import useAuth from "hooks/useAuth";
import { useForm } from "react-hook-form";
import { openSnackbar } from "api/snackbar";
import { createCompany, getCompanyById, updateCompany } from "service/company";
import { useEffect, useMemo } from "react";

export type CompanyFormValue = {
    companyName: string;
    displayName: string;
    billCode: string;
    cashBillCode: string;
}

const defaultValues: CompanyFormValue = {
    companyName: "",
    displayName: "",
    billCode: "",
    cashBillCode: "",
}

const UseAddEditCompany = () => {
    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { user, startLoading, stopLoading } = useAuth();

    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
        setValue,
        reset,
    } = useForm<CompanyFormValue>({
        mode: 'onChange',
        defaultValues,
    });

    const handleBack = () => {
        navigate('/company');
    }

    const fetch = async () => {
        try {
            startLoading();
            const { success, message, data }: any = await getCompanyById(Number(id));
            if (success) {
                setValue('companyName', data.companyName);
                setValue('displayName', data.displayName);
                setValue('billCode', data.billCode);
                setValue('cashBillCode', data.cashBillCode);
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

    const onSubmit = async (data: CompanyFormValue) => {
        try {
            startLoading();
            let payload: any = { ...data };

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
            const { success, message }: any = mode && mode === 'edit' && id ? await updateCompany(payload, Number(id)) : await createCompany(payload);
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

    const title: string = useMemo(() => {
        if (mode && mode === 'edit' && id) {
            return 'Edit Company';
        }
        return 'Add Company';
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
        setValue,
        onSubmit,
        handleBack,
        handleSubmit,
    }
}

export default UseAddEditCompany
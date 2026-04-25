import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";

import { createPaymentBank, getPaymentBank, updatePaymentBank } from "service/paymentBank";
import { getCompanyList } from "service/company";

import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import { listPayload } from "utils/helper";

export type PaymentBankType = {
    bankName: string;
    companyID: number | null;
    value: {
        key: string;
        value: string;
        index: number
    }[]
}

const defaultValues: PaymentBankType = {
    bankName: "",
    companyID: null,
    value: [{
        key: "",
        value: "",
        index: 0
    }]
}

const UseAddEditPaymentBank = () => {
    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { user, startLoading, stopLoading } = useAuth();

    const [companyList, setCompanyList] = useState<any[]>([]);

    const {
        control,
        setValue,
        getValues,
        handleSubmit,
        formState: { isSubmitting }
    } = useForm<PaymentBankType>({
        defaultValues,
        mode: "onChange",
    });

    const {
        fields,
        append,
        remove
    } = useFieldArray<PaymentBankType>({
        name: 'value',
        control
    })

    const handleBack = () => {
        navigate("/payment-bank");
    }

    const handleAdd = () => {
        const index = getValues('value').length;
        append({
            index: index,
            key: '',
            value: ''
        })
    }

    const handleRemove = (index: number) => {
        remove(index)
    }

    const fetch = async () => {
        try {
            startLoading();
            const { success, message, data }: any = await getPaymentBank(Number(id));
            if (success) {
                setValue("bankName", data.bankName);
                setValue("companyID", data.companyID);
                const formattedValue: any[] = data.value && data.value.length > 0
                    ? Object.entries(data.value[0]).map(([key, value], index) => ({
                        index: index,
                        key: key,
                        value: value
                    }))
                    : [];
                setValue("value", formattedValue);
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

    const onSubmit = async (data: PaymentBankType) => {
        try {
            startLoading();
            let payload: any = {
                ...data,
                value: [data.value.reduce((acc: any, curr: any) => {
                    acc[curr.key] = curr.value;
                    return acc;
                }, {})],
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
            const { success, message }: any = mode && mode === 'edit' && id ? await updatePaymentBank(payload, Number(id)) : await createPaymentBank(payload);
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

    useEffect(() => {
        const fetchCompanyList = async () => {
            try {
                startLoading();
                const body = listPayload(0, { isActive: true, isDeleted: false }, 1000);
                const { success, data }: any = await getCompanyList(body);
                if (success) {
                    setCompanyList(data.rows);
                } else {
                    setCompanyList([]);
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
        fetchCompanyList();
    }, []);

    useEffect(() => {
        if (mode && mode === 'edit' && id) {
            fetch();
        }
    }, [mode, id]);

    const title: string = useMemo(() => {
        if (mode && mode === 'edit' && id) {
            return 'Edit Payment Bank';
        }
        return 'Add Payment Bank';
    }, [mode, id]);

    return {
        mode,
        title,
        fields,
        control,
        companyList,
        isSubmitting,
        onSubmit,
        handleAdd,
        handleBack,
        handleRemove,
        handleSubmit,
    }
}

export default UseAddEditPaymentBank;
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import countries, { CountryType } from "data/countries";
import useAuth from "hooks/useAuth";
import { openSnackbar } from "api/snackbar";
import { createCustomer, getCustomerById, updateCustomer } from "service/customer";

export type CustomerFormValue = {
    name: string;
    countryCode: string;
    phoneNumber: string;
    dob: Date;
    gender: string;
}

const defaultValues: CustomerFormValue = {
    name: '',
    countryCode: '',
    phoneNumber: '',
    dob: new Date(),
    gender: '',
}

const UseAddEditCustomer = () => {
    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { user, startLoading, stopLoading } = useAuth();

    const {
        control,
        formState: { isSubmitting },
        setValue,
        handleSubmit,
    } = useForm<CustomerFormValue>({
        defaultValues,
        mode: 'onChange'
    });

    const countryCodeList = useMemo(() => {
        return countries?.map((country: CountryType) => {
            return {
                label: `${country.phone} (${country.label})`,
                value: country.phone.split('+')[1]
            }
        })
    }, [countries]);

    const handleBack = () => {
        navigate("/customer");
    }

    const fetch = async () => {
        try {
            startLoading();
            const { success, message, data }: any = await getCustomerById(Number(id));
            if (success) {
                setValue("name", data.name);
                setValue("countryCode", data.countryCode);
                setValue("phoneNumber", data.phoneNumber);
                setValue("dob", new Date(data.dob));
                setValue("gender", data.gender);
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

    const onSubmit = async (data: CustomerFormValue) => {
        try {
            startLoading();
            let payload: any = {
                ...data,
                userID: user?.id
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
            const { success, message }: any = mode && mode === 'edit' && id ? await updateCustomer(payload, Number(id)) : await createCustomer(payload);
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
            return 'Edit Customer';
        }
        return 'Add Customer';
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
        countryCodeList,
        setValue,
        onSubmit,
        handleBack,
        handleSubmit,
    }
}

export default UseAddEditCustomer;
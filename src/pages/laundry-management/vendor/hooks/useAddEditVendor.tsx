import { openSnackbar } from "api/snackbar";
import countries, { CountryType } from "data/countries";
import useAuth from "hooks/useAuth";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createLaundryVendor, getLaundryVendorById, updateLaundryVendor } from "service/laundry-vendor";

export type VendorType = {
    userID: number | null,
    name: string,
    countryCode: string,
    phoneNumber: string,
    address: string,
    laundryName: string,
    ifscCode: string,
    accountHolder: string,
    accountNumber: string,
    reEnterAccountNumber: string,
}

const defaultValues: VendorType = {
    userID: null,
    name: "",
    countryCode: "91", // Default India
    phoneNumber: "",
    address: "",
    laundryName: "",
    ifscCode: "",
    accountHolder: "",
    accountNumber: "",
    reEnterAccountNumber: "",
}

const UseAddEditVendor = () => {
    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { user, startLoading, stopLoading } = useAuth();

    const countryCodeList = useMemo(() => {
        return countries?.map((country: CountryType) => {
            return {
                label: `${country.phone} (${country.label})`,
                value: country.phone.split('+')[1]
            }
        })
    }, [countries]);

    const {
        control,
        formState: { isSubmitting },
        setValue,
        getValues,
        handleSubmit
    } = useForm<VendorType>({
        defaultValues,
        mode: 'onBlur'
    });

    const fetch = async () => {
        try {
            startLoading();
            const { success, message, data }: any = await getLaundryVendorById(Number(id));
            if (success) {
                setValue("userID", data.userID);
                setValue("name", data.name);
                setValue("countryCode", data.countryCode);
                setValue("phoneNumber", data.phoneNumber);
                setValue("address", data.address);
                setValue("laundryName", data.laundryName);
                setValue("ifscCode", data.ifscCode);
                setValue("accountHolder", data.accountHolder);
                setValue("accountNumber", data.accountNumber);
                setValue("reEnterAccountNumber", data.accountNumber);
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

    const handleBack = () => {
        navigate("/laundry-management/laundry-vendor");
    }

    const onSubmit = async (data: VendorType) => {
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
                    userID: user?.id, // Assuming vendor is tied to branch/user
                    createdBy: user?.id
                }
            }

            const { success, message }: any = mode && mode === 'edit' && id ? await updateLaundryVendor(payload, Number(id)) : await createLaundryVendor(payload);
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
            return 'Edit Laundry Vendor';
        }
        return 'Add Laundry Vendor';
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
        onSubmit,
        getValues,
        handleBack,
        handleSubmit,
    }
}

export default UseAddEditVendor;

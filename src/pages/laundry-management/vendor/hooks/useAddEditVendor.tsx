import { openSnackbar } from "api/snackbar";
import countries, { CountryType } from "data/countries";
import useAuth from "hooks/useAuth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createLaundryVendor, getLaundryVendorById, updateLaundryVendor } from "service/laundry-vendor";
import { verifyIfscCode } from "service/staff";

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
        clearErrors,
        setError,
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
                // setValue("reEnterAccountNumber", data.accountNumber);
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

    /**
         * Verifies an IFSC code against the backend API.
         * Called via react-hook-form's async `validate` rule on the ifscCode field.
         * Returns `true` on success, or an error message string on failure.
         */
    const handleIfscVerify = useCallback(async (ifsc: string, fieldName: any): Promise<true | string> => {
        const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        // Skip API call if the format is already invalid (the `pattern` rule handles that message)
        if (!ifsc || !IFSC_REGEX.test(ifsc)) {
            setError('ifscCode', { type: 'pattern', message: 'IFSC Code is not valid' })
            return true; // Let the `pattern` rule display the format error
        }
        try {
            const { success, message }: any = await verifyIfscCode({ ifscCode: ifsc });
            if (success) {
                // setIfscVerified(true);
                setError('ifscCode', { message: 'IFSC Code is verified successfully.' })
                clearErrors(fieldName);
                return true;
            } else {
                setError('ifscCode', { message: message || 'IFSC Code not found. Please check and try again.' })
                return message || 'IFSC Code not found. Please check and try again.';
            }
        } catch (error: any) {
            setError('ifscCode', { message: error?.message || error?.messageCode || (error as Error).message || 'Failed to verify IFSC Code. Please try again.' })
            return error?.message || 'Failed to verify IFSC Code. Please try again.';
        }
    }, [clearErrors, setError]);

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
            delete payload.reEnterAccountNumber;
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
        handleIfscVerify,
    }
}

export default UseAddEditVendor;

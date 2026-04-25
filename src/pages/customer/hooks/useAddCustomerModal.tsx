import { useMemo } from "react";
import { useForm } from "react-hook-form";

import countries, { CountryType } from "data/countries";
import useAuth from "hooks/useAuth";
import { openSnackbar } from "api/snackbar";
import { createCustomer } from "service/customer";

export type AddCustomerFormValues = {
    name: string;
    countryCode: string;
    phoneNumber: string;
    dob: Date | null;
    gender: string;
};

const defaultValues: AddCustomerFormValues = {
    name: '',
    countryCode: '',
    phoneNumber: '',
    dob: null,
    gender: '',
};

type UseAddCustomerModalProps = {
    onSuccess?: (customer?: any) => void;
    onClose: () => void;
};

const useAddCustomerModal = ({ onSuccess, onClose }: UseAddCustomerModalProps) => {
    const { user, startLoading, stopLoading } = useAuth();

    const {
        control,
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<AddCustomerFormValues>({
        defaultValues,
        mode: 'onChange',
    });

    const countryCodeList = useMemo(() =>
        countries?.map((country: CountryType) => ({
            label: `${country.phone} (${country.label})`,
            value: country.phone.split('+')[1],
        }))
        , []);

    const handleClose = () => {
        reset(defaultValues);
        onClose();
    };

    const onSubmit = async (data: AddCustomerFormValues) => {
        try {
            startLoading();
            const payload = {
                ...data,
                userID: user?.id,
                createdBy: user?.id,
            };
            const { success, message, data: customer }: any = await createCustomer(payload);
            if (success) {
                openSnackbar({
                    open: true,
                    message: message || 'Customer added successfully',
                    variant: 'alert',
                    alert: { color: 'success' },
                });
                reset(defaultValues);
                onSuccess?.(customer);
                onClose();
            } else {
                openSnackbar({
                    open: true,
                    message: message || 'Failed to add customer',
                    variant: 'alert',
                    alert: { color: 'error' },
                });
            }
        } catch (error: any) {
            openSnackbar({
                open: true,
                message: error?.message || 'Something went wrong',
                variant: 'alert',
                alert: { color: 'error' },
            });
        } finally {
            stopLoading();
        }
    };

    return {
        control,
        isSubmitting,
        countryCodeList,
        handleClose,
        handleSubmit,
        onSubmit,
    };
};

export default useAddCustomerModal;

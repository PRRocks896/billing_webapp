
import { openSnackbar } from "api/snackbar";
import { FileUploadValue } from "components/FileUpload";
import useAuth from "hooks/useAuth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createRent, getRentById, updateRent } from "service/rent";
import { verifyIfscCode } from "service/staff";
import { convertToFormData } from "utils/helper";

export type RentFormValue = {
    ownerName: string;
    userID: number | null;
    panCard: string;
    tds: string;
    gst: string;
    gstNo: string;
    agreementPdf: string;
    agreementDate: Date | null;
    agreementExpireDate: Date | null;
    rentAmount: number;
    incrementPercentage: number;
    maintenance: number;
    bankDetails: {
        accountNumber: string;
        holderName: string;
        ifscCode: string;
    };
    maintenanceAccount: {
        accountNumber: string;
        holderName: string;
        ifscCode: string;
    };
}

const defaultValues: RentFormValue = {
    ownerName: "",
    userID: null,
    panCard: "",
    tds: "",
    gst: "",
    gstNo: "",
    agreementPdf: "",
    agreementDate: null,
    agreementExpireDate: null,
    rentAmount: 0,
    incrementPercentage: 0,
    maintenance: 0,
    bankDetails: {
        accountNumber: "",
        holderName: "",
        ifscCode: "",
    },
    maintenanceAccount: {
        accountNumber: "",
        holderName: "",
        ifscCode: "",
    },
}

const UseAddEditRent = () => {
    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { user, isAdmin, startLoading, stopLoading } = useAuth();

    const [ifscVerified, setIfscVerified] = useState<boolean | null>(null);

    const {
        control,
        formState: { isSubmitting },
        setValue,
        clearErrors,
        handleSubmit,
    } = useForm<RentFormValue>({
        defaultValues,
    });

    useEffect(() => {
        if (user) {
            setValue("userID", user?.id);
        }
    }, [user]);

    const handleBack = () => navigate('/rent-management/rent');

    /**
     * Verifies an IFSC code against the backend API.
     * Called via react-hook-form's async `validate` rule on the ifscCode field.
     * Returns `true` on success, or an error message string on failure.
     */
    const handleIfscVerify = useCallback(async (ifsc: string, fieldName: any): Promise<true | string> => {
        const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        // Skip API call if the format is already invalid (the `pattern` rule handles that message)
        if (!ifsc || !IFSC_REGEX.test(ifsc)) {
            setIfscVerified(null);
            return true; // Let the `pattern` rule display the format error
        }
        try {
            const { success, message }: any = await verifyIfscCode({ ifscCode: ifsc });
            if (success) {
                setIfscVerified(true);
                clearErrors(fieldName);
                return true;
            } else {
                setIfscVerified(false);
                return message || 'IFSC Code not found. Please check and try again.';
            }
        } catch (error: any) {
            setIfscVerified(false);
            return error?.message || 'Failed to verify IFSC Code. Please try again.';
        }
    }, [clearErrors]);

    const fetch = async () => {
        try {
            startLoading();
            const { success, data, message }: any = await getRentById(Number(id));
            if (!success) {
                openSnackbar({
                    open: true,
                    message: message || 'Something went wrong',
                    variant: 'alert',
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                });
                return;
            }
            setValue("ownerName", data?.ownerName || "")
            setValue("userID", data?.userID || null)
            setValue("panCard", data?.panCard || "")
            setValue("tds", data?.tds || "")
            setValue("gst", data?.gst || "")
            setValue("gstNo", data?.gstNo || "")
            setValue("agreementPdf", data?.agreementPdf || "")
            setValue("agreementDate", data?.agreementDate || "")
            setValue("agreementExpireDate", data?.agreementExpireDate || "")
            setValue("rentAmount", data?.rentAmount || 0)
            setValue("incrementPercentage", data?.incrementPercentage || 0)
            setValue("maintenance", data?.maintenance || 0)
            setValue("bankDetails.accountNumber", data?.bankDetails?.accountNumber || "")
            setValue("bankDetails.holderName", data?.bankDetails?.holderName || "")
            setValue("bankDetails.ifscCode", data?.bankDetails?.ifscCode || "")
            setValue("maintenanceAccount.accountNumber", data?.maintenanceAccount?.accountNumber || "")
            setValue("maintenanceAccount.holderName", data?.maintenanceAccount?.holderName || "")
            setValue("maintenanceAccount.ifscCode", data?.maintenanceAccount?.ifscCode || "")
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

    const onSubmit = async (data: RentFormValue) => {
        try {
            startLoading();
            let payload: any = {
                ...data,
                bankDetails: JSON.stringify(data?.bankDetails),
                maintenanceAccount: JSON.stringify(data?.maintenanceAccount),
            };

            if (mode === 'edit' && id) {
                payload = {
                    ...payload,
                    updatedBy: user?.id
                }
            } else {
                payload = {
                    ...payload,
                    createdBy: user?.id
                }
            };

            if (data && data.agreementPdf && typeof data.agreementPdf !== 'string') {
                payload = convertToFormData(payload);
                payload.append('agreementPdf', data?.agreementPdf);
            } else {
                delete payload.agreementPdf;
            }

            const { success, message }: any = mode === 'edit' && id ? await updateRent(payload, Number(id)) : await createRent(payload);
            openSnackbar({
                open: true,
                message: success ? (mode === 'edit' ? 'Rent updated successfully' : 'Rent added successfully') : (message || 'Something went wrong'),
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

    const title: string = useMemo(() => {
        if (mode && mode === 'edit' && id) {
            return 'Edit Rent';
        }
        return 'Add Rent';
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
        ifscVerified,
        isSubmitting,
        onSubmit,
        setValue,
        handleBack,
        handleSubmit,
        handleIfscVerify
    }
}

export default UseAddEditRent;
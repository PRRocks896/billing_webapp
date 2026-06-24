import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { getStaffById, updateStaff } from "service/staff";
import { convertToFormData } from "utils/helper";

export type StaffFormValue = {
    uanNumber: string;
    uanDoc: any;
    aadhaarCard: string;
    aadhaarCardPdf: any;
    panNo: string;
    panPdf: any;
    voterIdNumber: string;
    voterIdPdf: any;
    otherDocument: any;
}

const defaultValues: StaffFormValue = {
    uanNumber: '',
    uanDoc: null,
    aadhaarCard: '',
    aadhaarCardPdf: null,
    panNo: '',
    panPdf: null,
    voterIdNumber: '',
    voterIdPdf: null,
    otherDocument: null,
}


const UseRekycStaff = () => {
    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { user, isAdmin, startLoading, stopLoading } = useAuth();

    const [staffData, setStaffData] = useState<any>(null);

    const {
        control,
        formState: { isSubmitting },
        setValue,
        getValues,
        setError,
        clearErrors,
        handleSubmit,
    } = useForm<StaffFormValue>({
        defaultValues,
        mode: 'onChange'
    });

    const handleBack = () => navigate("/staff");

    const fetch = async () => {
        try {
            startLoading();
            const { success, message, data }: any = await getStaffById(Number(id));
            if (!success) {
                openSnackbar({
                    open: true,
                    message: message || "Failed to fetch staff data",
                    variant: 'alert',
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                });
                return;
            }
            setValue("uanNumber", data.uanNumber);
            setValue("uanDoc", data.uanDoc);
            setValue("aadhaarCard", data.aadhaarCard);
            setValue("aadhaarCardPdf", data.aadhaarCardPdf);
            setValue("panNo", data.panNo);
            setValue("panPdf", data.panPdf);
            setValue("voterIdNumber", data.voterIdNumber);
            setValue("voterIdPdf", data.voterIdPdf);
            setValue("otherDocument", data.otherDocument);
            setStaffData(data);
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

    const onSubmit = async (data: StaffFormValue) => {
        try {
            startLoading();

            let payload: any = {
                id: Number(id),
                isKyc: true,
                uanNumber: data.uanNumber,
                aadhaarCard: data.aadhaarCard,
                panNo: data.panNo,
                voterIdNumber: data.voterIdNumber,
                updatedBy: user?.id
            }

            console.log(payload);

            payload = convertToFormData(payload);

            if (data.uanDoc) {
                payload.append('uanDoc', data.uanDoc);
            }

            if (data.aadhaarCardPdf && typeof data.aadhaarCardPdf !== 'string') {
                if (Array.isArray(data.aadhaarCardPdf) && data.aadhaarCardPdf.length > 0) {
                    data.aadhaarCardPdf.forEach((item: any) => {
                        payload.append('aadhaarCardPdf', item);
                    });
                }
            }

            if (data.panPdf) {
                payload.append('panPdf', data.panPdf);
            }

            if (data.voterIdPdf && typeof data.voterIdPdf !== 'string') {
                if (Array.isArray(data.voterIdPdf) && data.voterIdPdf.length > 0) {
                    data.voterIdPdf.forEach((item: any) => {
                        payload.append('voterIdPdf', item);
                    });
                }
            }

            if (data.otherDocument) {
                if (Array.isArray(data.otherDocument) && data.otherDocument.length > 0) {
                    data.otherDocument.forEach((item: any) => {
                        payload.append('otherDocument', item);
                    });
                } else {
                    payload.append('otherDocument', data.otherDocument);
                }
            }

            const { success, message }: any = await updateStaff(payload, Number(id));
            if (!success) {
                openSnackbar({
                    open: true,
                    message: message || "Failed to update staff",
                    variant: 'alert',
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                });
                return;
            }

            openSnackbar({
                open: true,
                message: message || "Staff updated successfully",
                variant: 'alert',
                alert: {
                    color: 'success'
                }
            });
            navigate('/staff');
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
        if (id) {
            fetch();
        }
    }, [id]);

    return {
        staffData,
        control,
        isSubmitting,
        onSubmit,
        handleBack,
        handleSubmit,
        getValues,
        setValue,
    };
}

export default UseRekycStaff;
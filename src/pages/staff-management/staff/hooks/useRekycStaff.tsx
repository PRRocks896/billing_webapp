import { openSnackbar } from "api/snackbar";
import countries from "data/countries";
import useAuth from "hooks/useAuth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { getEmployeeTypePayload } from "service/employee-type";
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
                ...data,
                otherDocumentName: data.otherDocument?.name,
                uanDoc: data.uanDoc,
                aadhaarCardPdf: data.aadhaarCardPdf,
                panPdf: data.panPdf,
                voterIdPdf: data.voterIdPdf,
            }

            payload = convertToFormData(payload);

            if (data.uanDoc) {
                payload.append('uanDoc', data.uanDoc);
            }

            if (data.aadhaarCardPdf) {
                payload.append('aadhaarCardPdf', data.aadhaarCardPdf);
            }

            if (data.panPdf) {
                payload.append('panPdf', data.panPdf);
            }

            if (data.voterIdPdf) {
                payload.append('voterIdPdf', data.voterIdPdf);
            }

            if (data.otherDocument) {
                payload.append('otherDocument', data.otherDocument);
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
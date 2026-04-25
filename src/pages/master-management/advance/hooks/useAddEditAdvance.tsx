import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import { createAdvance, getAdvanceById, updateAdvance } from "service/advance";
import { getPaymentTypeList } from "service/payment-type";
import { getStaffList } from "service/staff";
import { listPayload } from "utils/helper";

export type AdvanceFormType = {
    staffID: string;
    paymentID: string;
    managerID: number | null;
    date: string;
    amount: string;
    permissionName: string;
}

const defaultValues: AdvanceFormType = {
    staffID: "",
    paymentID: "",
    managerID: parseInt(localStorage.getItem("managerId") || "-1") || null,
    date: moment(new Date()).format('yyyy-MM-DD'),
    amount: "",
    permissionName: "",
};

const UseAddEditAdvance = () => {
    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { startLoading, stopLoading, user, isAdmin } = useAuth();

    const [staffOption, setStaffOption] = useState<any[]>([]);
    const [paymentOption, setPaymentOption] = useState<any[]>([]);
    const [managerOption, setManagerOption] = useState<any[]>([]);

    const {
        control,
        formState: { isSubmitting },
        setValue,
        getValues,
        handleSubmit
    } = useForm<AdvanceFormType>({
        defaultValues: {
            ...defaultValues,
            managerID: parseInt(localStorage.getItem("managerId") || "-1") || null,
        },
        mode: 'onBlur'
    });

    const handleBack = () => {
        navigate("/advance");
    }

    const fetch = async () => {
        try {
            startLoading();
            const { success, message, data }: any = await getAdvanceById(Number(id));
            if (!success) {
                openSnackbar({
                    open: true,
                    message: message,
                    variant: 'alert',
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                })
                return;
            }
            setValue("staffID", data?.px_staff?.id);
            setValue("paymentID", data?.px_payment_type?.id);
            setValue("date", moment(new Date(data.date)).format('yyyy-MM-DD'));
            setValue("permissionName", data.permissionName);
            setValue("managerID", data?.px_manager?.id);
            setValue("amount", data.amount);
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

    const onSubmit = async (data: AdvanceFormType) => {
        try {
            startLoading();
            let payload: any = {
                ...data,
                amount: data.amount,
                managerID: data.managerID || null,
            }
            if (mode === 'add') {
                payload = {
                    ...payload,
                    createdBy: user?.id,
                }
            } else {
                payload = {
                    ...payload,
                    updatedBy: user?.id,
                }
            }
            const { success, message }: any = mode === 'add' ? await createAdvance(payload) : await updateAdvance(payload, Number(id));
            if (!success) {
                openSnackbar({
                    open: true,
                    message: message,
                    variant: 'alert',
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                })
                return;
            }
            openSnackbar({
                open: true,
                message: message,
                variant: 'alert',
                severity: 'success',
                alert: {
                    color: 'success'
                }
            })
            handleBack();
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
        const fetchDropDownList = async () => {
            const whereCondition = {
                isActive: true,
                isDeleted: false
            };
            const [
                staffResponse,
                paymentResponse,
                managerResponse
            ]: any = await Promise.all([
                getStaffList(listPayload(0, isAdmin ? { ...whereCondition } : { ...whereCondition, createdBy: user?.id }, 100000)),
                getPaymentTypeList(listPayload(0, whereCondition, 100000)),
                getStaffList(listPayload(0, isAdmin ? { ...whereCondition, searchText: "MANAGER" } : { ...whereCondition, searchText: "MANAGER", createdBy: user?.id }, 100000))
            ]);
            if (staffResponse.success) {
                setStaffOption(staffResponse.data?.rows);
            } else {
                setStaffOption([]);
            }
            if (paymentResponse.success) {
                setPaymentOption(paymentResponse.data?.rows);
            } else {
                setPaymentOption([]);
            }
            if (managerResponse.success) {
                setManagerOption(managerResponse.data?.rows);
            } else {
                setManagerOption([]);
            }
        }
        fetchDropDownList();
        // eslint-disable-next-line
    }, [isAdmin]);

    const title: string = useMemo(() => {
        if (mode && mode === 'edit' && id) {
            return 'Edit Laundry Management';
        }
        return 'Add Laundry Management';
    }, [mode, id]);

    const isEdit = useMemo(() => {
        return mode === "edit";
    }, [mode]);

    useEffect(() => {
        if (mode && mode === 'edit' && id) {
            fetch();
        }
    }, [mode, id]);

    return {
        mode,
        title,
        isEdit,
        control,
        staffOption,
        isSubmitting,
        paymentOption,
        managerOption,
        onSubmit,
        getValues,
        handleBack,
        handleSubmit,
    }
}

export default UseAddEditAdvance;
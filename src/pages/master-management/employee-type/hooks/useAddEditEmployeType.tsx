import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import useAuth from "hooks/useAuth";
import { createEmployeeType, getEmployeeTypeById, updateEmployeeType } from "service/employee-type";
import { openSnackbar } from "api/snackbar";

export type EmployeeType = {
    name: string;
}

const defaultValues: EmployeeType = {
    name: "",
}

const UseAddEditEmployeType = () => {
    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { user } = useAuth();

    const {
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting }
    } = useForm<EmployeeType>({
        defaultValues,
        mode: "onChange",
    });

    const handleBack = () => {
        navigate("/employee-type");
    }

    const fetch = async () => {
        try {
            const { success, message, data }: any = await getEmployeeTypeById(Number(id));
            if (success) {
                setValue("name", data.name);
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
        }
    }

    const onSubmit = async (data: EmployeeType) => {
        try {
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
                    createdBy: user?.id
                }
            }
            const { success, message }: any = mode && mode === 'edit' && id ? await updateEmployeeType(payload, Number(id)) : await createEmployeeType(payload);
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
        }
    }

    const title: string = useMemo(() => {
        if (mode && mode === 'edit' && id) {
            return 'Edit Employee Type';
        }
        return 'Add Employee Type';
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
        onSubmit,
        handleBack,
        handleSubmit,
    }

}

export default UseAddEditEmployeType
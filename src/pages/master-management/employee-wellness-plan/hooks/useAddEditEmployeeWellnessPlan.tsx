
import { openSnackbar } from "api/snackbar";
import { FileUploadValue } from "components/FileUpload";
import useAuth from "hooks/useAuth";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createEmpWellnessPlan, getEmpWellnessPlanById, updateEmpWellnessPlan } from "service/empWellnessPlan";
import { convertToFormData } from "utils/helper";


export type EmployeeWellnessPlanFormValue = {
    title: String;
    description: String;
    minPrice: number | null;
    maxPrice: number | null;
    image: FileUploadValue | null;
    featureList: {
        index: number,
        value: string
    }[],
}

const defaultValues: EmployeeWellnessPlanFormValue = {
    title: '',
    description: '',
    minPrice: null,
    maxPrice: null,
    featureList: [],
    image: null,
}

const UseAddEditEmployeeWellnessPlan = () => {

    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { user } = useAuth();

    const {
        control,
        formState: { isSubmitting },
        setValue,
        handleSubmit,
    } = useForm<EmployeeWellnessPlanFormValue>({
        mode: 'onChange',
        defaultValues,
    });

    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control: control,
        name: 'featureList',
    });

    const handleAddFeature = () => {
        append({
            index: fields.length,
            value: '',
        });
    };

    const handleRemoveFeature = (index: number) => {
        remove(index);
    };

    const handleBack = () => {
        navigate('/employee-wellness-plan');
    }

    const fetch = async () => {
        try {
            const { success, message, data }: any = await getEmpWellnessPlanById(Number(id));
            if (success) {
                setValue('title', data.title);
                setValue('description', data.description);
                setValue('minPrice', data.minPrice);
                setValue('maxPrice', data.maxPrice);
                setValue('image', data.image);
                if (data.featureList && Array.isArray(data.featureList)) {
                    append(data.featureList.map((feature: string, index: number) => ({ index, value: feature })));
                }
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
        }
    }

    const onSubmit = async (data: EmployeeWellnessPlanFormValue) => {
        try {
            let payload: any = {
                title: data.title,
                description: data.description,
                minPrice: data.minPrice,
                maxPrice: data.maxPrice,
                featureList: data.featureList.length > 0 ? JSON.stringify(data.featureList.map((item: any) => item.value)) : null,
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
            if (data && data.image && typeof data.image === 'object') {
                payload = convertToFormData(payload);
                payload.append('image', data.image);
            }
            const { success, message }: any = mode && mode === 'edit' && id ? await updateEmpWellnessPlan(payload, Number(id)) : await createEmpWellnessPlan(payload);
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
            return 'Edit Employee Wellness Plan';
        }
        return 'Add Employee Wellness Plan';
    }, [mode, id]);

    useEffect(() => {
        if (mode === 'add') {
            setValue('featureList', [{
                index: 0,
                value: ""
            }]);
        }
    }, [mode]);

    useEffect(() => {
        if (mode && mode === 'edit' && id) {
            fetch();
        }
    }, [mode, id]);

    return {
        mode,
        title,
        fields,
        control,
        isSubmitting,
        onSubmit,
        handleBack,
        handleSubmit,
        handleAddFeature,
        handleRemoveFeature,
    }
}

export default UseAddEditEmployeeWellnessPlan
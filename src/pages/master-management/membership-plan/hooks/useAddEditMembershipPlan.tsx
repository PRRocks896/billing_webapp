
import { openSnackbar } from "api/snackbar";
import { FileUploadValue } from "components/FileUpload";
import useAuth from "hooks/useAuth";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createMembershipPlan, getMembershipPlanById, updateMembershipPlan } from "service/membershipPlan";
import { convertToFormData } from "utils/helper";

export type MembershipPlanFormValue = {
    planName: string;
    hours: string;
    price: string;
    hsnCode: string;
    validity: string;
    images: FileUploadValue[] | null;
    featureList: {
        index: number,
        value: string
    }[],
}

const defaultValues: MembershipPlanFormValue = {
    planName: '',
    hours: '',
    price: '',
    hsnCode: '',
    validity: '',
    images: null,
    featureList: [],
}

const UseAddEditUseMembershipPlan = () => {
    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { user } = useAuth();

    const {
        control,
        formState: { isSubmitting },
        setValue,
        handleSubmit,
    } = useForm<MembershipPlanFormValue>({
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
        navigate('/membership-plan');
    }

    const fetch = async () => {
        try {
            const { success, message, data }: any = await getMembershipPlanById(Number(id));
            if (success) {
                setValue('planName', data.planName);
                setValue('hours', data.hours);
                setValue('price', data.price);
                setValue('hsnCode', data.hsnCode);
                setValue('validity', data.validity);
                setValue('images', data.images);
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

    const onSubmit = async (data: MembershipPlanFormValue) => {
        try {
            let payload: any = {
                planName: data.planName,
                hours: data.hours,
                price: data.price,
                hsnCode: data.hsnCode,
                validity: data.validity,
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
            if (data && data.images && Array.isArray(data.images) && data.images.length > 0) {
                const objImgs = data.images.filter((image: any) => typeof image === 'object');
                if (objImgs.length > 0) {
                    payload = convertToFormData(payload);
                    objImgs.forEach((image: FileUploadValue) => {
                        payload.append(mode === 'edit' ? 'newImages' : 'images', image);
                    });
                }
            }
            const { success, message }: any = mode && mode === 'edit' && id ? await updateMembershipPlan(payload, Number(id)) : await createMembershipPlan(payload);
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
            return 'Edit Membership Plan';
        }
        return 'Add Membership Plan';
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
        setValue,
        handleBack,
        handleSubmit,
        handleAddFeature,
        handleRemoveFeature,
    }
}

export default UseAddEditUseMembershipPlan
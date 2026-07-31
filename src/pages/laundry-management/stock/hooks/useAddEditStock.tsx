import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import { bulkCreateLaundaryStock, getLaundaryStockById, updateLaundaryStock } from "service/laundry-stock";
import { getLaundryItemDropdownList } from "service/laundry-item";
import { getBranch } from "service/user";

export type LaundryStockType = {
    userID: number | null;
    detail: {
        index: number,
        laundryItemID: number | null;
        qty: string;
    }[]
}

const defaultValues: LaundryStockType = {
    userID: null,
    detail: [{
        index: 0,
        laundryItemID: null,
        qty: ''
    }]
};

const UseAddEditStock = () => {
    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { startLoading, stopLoading, user } = useAuth();

    const [laundryItemList, setLaundryItemList] = useState<any[]>([]);
    const [branchList, setBranchList] = useState<any[]>([]);

    const {
        control,
        formState: { isSubmitting },
        setValue,
        getValues,
        handleSubmit
    } = useForm<LaundryStockType>({
        defaultValues,
        mode: "onBlur"
    })

    const { fields, append, remove } = useFieldArray({
        name: "detail",
        control: control
    });

    const addLaundryItem = () => {
        const index = getValues("detail").length;
        append({
            index: index,
            laundryItemID: null,
            qty: ""
        })
    }

    const removeLaundryItem = (index: number) => {
        if (fields.length > 1) {
            remove(index)
        } else {
            openSnackbar({
                open: true,
                message: "At least one laundry item is required",
                variant: 'alert',
                alert: {
                    color: 'error'
                }
            })
        }
    };

    const handleBack = () => {
        navigate("/laundry-management/laundry-stock");
    };

    const fetch = async () => {
        try {
            startLoading();
            const res: any = await getLaundaryStockById(Number(id));
            if (!res.success) {
                openSnackbar({
                    open: true,
                    message: res.message,
                    variant: 'alert',
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                })
                return;
            }

            setValue("userID", res.data?.userID)

            if (res.data.detail && res.data.detail.length > 0) {
                const firstDetail = res.data.detail[0];
                setValue("detail", [{
                    index: 0,
                    laundryItemID: firstDetail.laundryItemID,
                    qty: firstDetail.qty.toString()
                }])

                for (let i = 1; i < res.data.detail.length; i++) {
                    append({
                        index: i,
                        laundryItemID: res.data.detail[i].laundryItemID,
                        qty: res.data.detail[i].qty.toString()
                    })
                }
            }

        } catch (error: any) {
            openSnackbar({
                open: true,
                message: error?.message || error?.messageCode || (error as Error).message || "Something went wrong",
                variant: "alert",
                alert: {
                    color: 'error'
                }
            })
        } finally {
            stopLoading();
        }
    }

    const onSubmit = async (data: LaundryStockType) => {
        try {
            let payload: any = { ...data }
            if (mode === "add") {
                payload = {
                    ...payload,
                    userID: data.userID,
                    createdBy: user?.id!,
                    items: payload.detail.map((item: any) => ({
                        laundryItemID: Number(item.laundryItemID),
                        qty: parseInt(item.qty)
                    }))
                }
            } else {
                payload = {
                    ...payload,
                    userID: data.userID,
                    updatedBy: user?.id,
                    laundryItemID: payload.detail[0].laundryItemID,
                    qty: parseInt(payload.detail[0].qty)
                }
            }

            delete payload.detail;

            startLoading();
            const res: any = mode === "add" ? await bulkCreateLaundaryStock(payload) : await updateLaundaryStock(Number(id), payload);
            stopLoading();

            if (!res.success) {
                openSnackbar({
                    open: true,
                    message: res.message,
                    variant: "alert",
                    alert: {
                        color: "error"
                    }
                })
                return;
            }

            openSnackbar({
                open: true,
                message: res.message,
                variant: "alert",
                alert: {
                    color: "success"
                }
            })
            handleBack();
        } catch (error: any) {
            stopLoading();
            openSnackbar({
                open: true,
                message: error?.message || error?.messageCode || (error as Error).message || "Something went wrong",
                variant: "alert",
                alert: {
                    color: "error"
                }
            })
        }
    };

    useEffect(() => {
        const fetchDropdownList = async () => {
            try {
                startLoading();
                const whereCondition = {
                    isActive: true,
                    isDeleted: false,
                };
                const [
                    laundryItemResponse,
                    branchResponse
                ]: any = await Promise.all([
                    getLaundryItemDropdownList(whereCondition),
                    getBranch(whereCondition)
                ]);
                if (laundryItemResponse.success) {
                    setLaundryItemList(laundryItemResponse.data);
                }
                if (branchResponse.success) {
                    setBranchList(branchResponse.data.filter((item: any) => {
                        if (item && item.px_role && item.px_role.name && !['admin', 'super admin'].includes(item.px_role.name.toLowerCase())) {
                            return item;
                        }
                    }))
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
        fetchDropdownList();
    }, []);

    const title: string = useMemo(() => {
        if (mode && mode === 'edit' && id) {
            return 'Edit Laundry Stock';
        }
        return 'Add Laundry Stock';
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
        fields,
        isEdit,
        control,
        branchList,
        isSubmitting,
        laundryItemList,
        onSubmit,
        getValues,
        handleBack,
        handleSubmit,
        addLaundryItem,
        removeLaundryItem
    };
};

export default UseAddEditStock
import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import { bulkCreateLaundaryManagement, getLaundaryManagementById, getLaundryManagementList, updateLaundaryManagement } from "service/laundry-management";
import { getLaundryItemDropdownList } from "service/laundry-item";
import { getLaundryWasherDropdownList } from "service/laundry-washer";

export type LaundryManagementType = {
    userID: number | null,
    laundryWasherID: string,
    givenDate: string,
    givenManagerID: string,
    detail: {
        index: number,
        laundryItemID: string,
        price: string,
        givenQty: string,
    }[],
    managerName: string,
}

const defaultValues: LaundryManagementType = {
    userID: null,
    laundryWasherID: "",
    givenDate: moment(new Date()).format('yyyy-MM-DD'),
    givenManagerID: localStorage.getItem("managerId") || "",
    detail: [{
        index: 0,
        laundryItemID: "",
        price: "",
        givenQty: "",
    }],
    managerName: localStorage.getItem("managerName") || "",
}

const UseAddEditManagement = () => {
    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { startLoading, stopLoading, user, isAdmin } = useAuth();

    const [laundryItemList, setLaundryItemList] = useState<any[]>([]);
    const [laundryWasherList, setLaundryWasherList] = useState<any[]>([]);

    const {
        control,
        formState: { isSubmitting },
        setValue,
        getValues,
        handleSubmit
    } = useForm<LaundryManagementType>({
        defaultValues: {
            ...defaultValues,
            givenManagerID: localStorage.getItem("managerId") || "",
            managerName: localStorage.getItem("managerName") || "",
        },
        mode: 'onBlur'
    });

    const { fields, append, remove } = useFieldArray({
        name: "detail",
        control: control,
    });

    const addLaundryItem = () => {
        const index = getValues("detail").length;
        append({
            index: index,
            laundryItemID: "",
            price: "",
            givenQty: "",
        });
    };

    const removeLaundryItem = (index: number) => {
        if (fields.length > 1) {
            remove(index);
        } else {
            openSnackbar({
                open: true,
                message: "At least one laundry item is required.",
                variant: 'alert',
                alert: {
                    color: 'error'
                }
            })
        }
    };

    const handleBack = () => {
        navigate("/laundry-management/laundry-management");
    }

    const fetch = async () => {
        try {
            startLoading();
            const { success, message, data }: any = await getLaundaryManagementById(Number(id));
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
            setValue("userID", data?.userID);
            setValue("laundryWasherID", data?.laundryWasherID);
            setValue("givenDate", moment(new Date(data.givenDate)).format("yyyy-MM-DD"));
            setValue("givenManagerID", data?.managerName?.[0]?.id || localStorage.getItem("managerId"));
            setValue("managerName", data?.managerName?.[0]?.nickName || localStorage.getItem("managerName"));
            setValue("detail", [{
                index: 0,
                laundryItemID: data?.laundryItemID,
                price: data?.price,
                givenQty: data?.givenQty,
            }]);
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

    const onSubmit = async (data: LaundryManagementType) => {
        try {
            if (data.givenManagerID.length === 0) {
                openSnackbar({
                    open: true,
                    message: "Please select a manager",
                    variant: 'alert',
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                })
                return;
            }
            let payload: any = { ...data };
            if (mode === 'add') {
                payload = {
                    ...payload,
                    userID: user?.id,
                    createdBy: user?.id,
                    items: payload.detail.map((item: any) => {
                        return {
                            laundryItemID: item.laundryItemID,
                            price: parseFloat(item.price),
                            givenQty: parseInt(item.givenQty),
                        }
                    })
                };
            } else {
                payload = {
                    ...payload,
                    userID: user?.id,
                    updatedBy: user?.id,
                    laundryItemID: payload.detail[0].laundryItemID,
                    price: parseFloat(payload.detail[0].price),
                    givenQty: parseInt(payload.detail[0].givenQty),
                }
            }
            delete payload.detail;
            startLoading();
            const { success, message }: any = mode && mode === 'edit' && id ? await updateLaundaryManagement(payload, Number(id)) : await bulkCreateLaundaryManagement(payload);
            openSnackbar({
                open: true,
                message: message,
                variant: 'alert',
                severity: success ? 'success' : 'error',
                alert: {
                    color: success ? 'success' : 'error'
                }
            });
            if (success) handleBack();
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
        const fetchDropdownList = async () => {
            try {
                startLoading();
                const whereCondition = {
                    isActive: true,
                    isDeleted: false,
                };
                const [
                    laundryWasherResponse,
                    laundryItemResponse
                ]: any = await Promise.all([
                    getLaundryWasherDropdownList(isAdmin ? whereCondition : {
                        ...whereCondition,
                        createdBy: user?.id
                    }),
                    getLaundryItemDropdownList(whereCondition)
                ]);
                if (laundryWasherResponse.success) {
                    setLaundryWasherList(laundryWasherResponse.data);
                }
                if (laundryItemResponse.success) {
                    setLaundryItemList(laundryItemResponse.data);
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
        fields,
        isEdit,
        control,
        isSubmitting,
        laundryItemList,
        laundryWasherList,
        onSubmit,
        getValues,
        handleBack,
        handleSubmit,
        addLaundryItem,
        removeLaundryItem
    }
}

export default UseAddEditManagement;
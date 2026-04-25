import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import { updateBulkReceiver, getLaundryReceiverById } from "service/laundry-receiver";
import { getLaundryItemDropdownList } from "service/laundry-item";
import { getLaundryWasherDropdownList } from "service/laundry-washer";
import { fetchLaundryManagementsViaPayload, fetchLaundryManagementViaPayload } from "service/laundry-management";

export type LaundryReceiverPayload = {
    userID: string;
    laundryWasherID: string;
    givenDate: string;
    receiveDate: string;
    receiverManagerID: string;
    detail: {
        index: number,
        receiverId: string,
        laundryManagementID: string,
        laundryItemID: string,
        price: string,
        givenQty: string,
        receiveQty: string,
        pendingQty: string
    }[],
    managerName: string;
}

const defaultValues: LaundryReceiverPayload = {
    userID: "",
    laundryWasherID: "",
    givenDate: moment(new Date()).format('yyyy-MM-DD'),
    receiveDate: moment(new Date()).format('yyyy-MM-DD'),
    receiverManagerID: localStorage.getItem("managerId") || "",
    detail: [{
        index: 0,
        receiverId: "",
        laundryManagementID: "",
        laundryItemID: "",
        price: "",
        givenQty: "",
        receiveQty: "",
        pendingQty: ""
    }],
    managerName: localStorage.getItem("managerName") || "",
}

const UseAddEditReceiver = () => {
    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { startLoading, stopLoading, user, isAdmin } = useAuth();

    const [laundryItemOption, setLaundryItemOption] = useState([]);
    const [laundryWasherOption, setLaundryWasherOption] = useState([]);
    const [laundryManagementOption, setLaundryManagementOption] = useState([]);

    const {
        control,
        formState: { isSubmitting },
        reset,
        watch,
        setValue,
        getValues,
        handleSubmit
    } = useForm<LaundryReceiverPayload>({
        defaultValues: {
            ...defaultValues,
            receiverManagerID: localStorage.getItem("managerId") || "",
            managerName: localStorage.getItem("managerName") || "",
        },
        mode: 'onBlur'
    })

    const { fields, append, remove } = useFieldArray({
        name: "detail",
        control: control,
    });

    const addLaundryItem = () => {
        const index = getValues("detail").length;
        append({
            index: index,
            receiverId: "",
            laundryManagementID: "",
            laundryItemID: "",
            price: "",
            givenQty: "",
            receiveQty: "",
            pendingQty: ""
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
        navigate("/laundry-management/laundry-receiver");
    };

    const onSubmit = async (data: LaundryReceiverPayload) => {
        try {
            startLoading();
            if (data.receiverManagerID && data.receiverManagerID.length === 0) {
                openSnackbar({
                    open: true,
                    message: "Manager is not selected",
                    variant: 'alert',
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                })
                return;
            }
            const payload = {
                userID: user?.id,
                updatedBy: user?.id,
                items: data.detail.map((item: any) => ({
                    receiverID: item.receiverId,
                    receiveQty: item.receiveQty === 0 ? item.givenQty : item.pendingQty ? ((item.givenQty - item.pendingQty) + parseFloat(item.receiveQty)) : item.receiveQty,
                    receiveDate: data.receiveDate,
                    receiverManagerID: data.receiverManagerID,
                    updatedBy: user?.id,
                }))
            };
            const { success, message }: any = await updateBulkReceiver(payload);
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
            reset();
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

    const fetchLaundryManagement = async () => {
        try {
            startLoading();
            const payload = {
                userID: user?.id,
                isActive: true,
                isDeleted: false,
                // searchText: "",
                laundryWasherID: getValues('laundryWasherID'),
                givenDate: getValues('givenDate'),
            };
            const { success, message, data }: any = await fetchLaundryManagementsViaPayload(payload);
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
            console.log(data);
            setLaundryManagementOption(data);
            setValue("detail", data.map((item: any, index: number) => ({
                index: index,
                receiverId: item.receiverId,
                laundryManagementID: item.id,
                laundryItemID: item.laundryItemID,
                price: item.price,
                givenQty: item.givenQty,
                receiveQty: item.pendingQty === 0 ? 0 : '',
                pendingQty: item.pendingQty
            })));
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
        if (getValues('givenDate') && getValues('laundryWasherID')) {
            fetchLaundryManagement();
        }
    }, [watch('givenDate'), watch('laundryWasherID')]);

    useEffect(() => {
        const fetchDropDownList = async () => {
            let whereCondition = {
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
            if (laundryWasherResponse?.success) {
                setLaundryWasherOption(laundryWasherResponse.data);
            } else {
                setLaundryWasherOption([]);
            }
            if (laundryItemResponse?.success) {
                setLaundryItemOption(laundryItemResponse.data);
            } else {
                setLaundryItemOption([]);
            }
        };
        fetchDropDownList();
    }, [isAdmin]);

    const title: string = useMemo(() => {
        if (mode && mode === 'edit' && id) {
            return 'Edit Laundry Receiver';
        }
        return 'Add Laundry Receiver';
    }, [mode, id]);

    const isEdit = useMemo(() => {
        return mode === "edit";
    }, [mode]);

    return {
        title,
        isEdit,
        control,
        fields,
        isSubmitting,
        laundryItemOption,
        laundryWasherOption,
        laundryManagementOption,
        onSubmit,
        getValues,
        handleBack,
        handleSubmit,
        addLaundryItem,
        removeLaundryItem,
    };
}

export default UseAddEditReceiver;
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import { lookupChallanCode } from "service/laundry-challan";
import { createLaundryReturn, getLaundryReturnById } from "service/laundry-return";
import moment from "moment";

export type ReturnFormType = {
    challanId: number | null,
    items: {
        challanItemId: number,
        laundryItemId: number,
        itemName: string,
        unitName: string,
        givenQty: number,
        pendingQty: number,
        receivedQty: string,
        damagedQty: string,
    }[]
}

const defaultValues: ReturnFormType = {
    challanId: null,
    items: [],
}

const UseAddEditReturn = () => {
    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { startLoading, stopLoading, user } = useAuth();
    const isView = useMemo(() => mode === 'view', [mode]);

    const [challanCode, setChallanCode] = useState<string>("");
    const [challanDetails, setChallanDetails] = useState<any>(null);

    const {
        control,
        formState: { isSubmitting },
        setValue,
        watch,
        handleSubmit
    } = useForm<ReturnFormType>({
        defaultValues,
        mode: 'onBlur'
    });

    const { fields } = useFieldArray({
        name: "items",
        control: control,
    });

    const handleBack = () => navigate("/laundry-management/laundry-return");

    const fetchReturnById = async (returnId: number) => {
        try {
            startLoading();
            const { success, message, data }: any = await getLaundryReturnById(returnId);
            if (!success || !data) {
                openSnackbar({ open: true, message: message || 'Record not found', variant: 'alert', severity: 'error', alert: { color: 'error' } });
                handleBack();
                return;
            }

            const mappedItems = (data.items || []).map((ri: any) => ({
                id: ri.id,
                givenQty: ri.px_challan_item?.givenQty || 0,
                receivedQty: ri.receivedQty || 0,
                damagedQty: ri.damagedQty || 0,
                price: ri.px_challan_item?.price || 0,
                px_laundry_item: ri.px_challan_item?.px_laundry_item,
            }));

            setChallanCode(data.px_challan?.challanCode || "");
            setChallanDetails({
                ...data.px_challan,
                returnDate: data.returnDate,
                note: data.note,
                managerData: data.managerData || [],
                items: mappedItems,
            });
            setValue("challanId", data.challanId || data.px_challan?.id || null);
        } catch (error: any) {
            openSnackbar({ open: true, message: error?.message || 'Something went wrong', variant: 'alert', severity: 'error', alert: { color: 'error' } });
            handleBack();
        } finally {
            stopLoading();
        }
    };

    useEffect(() => {
        if (isView && id) {
            fetchReturnById(Number(id));
        }
    }, [isView, id]);

    const searchChallan = async () => {
        if (isView) return;
        if (!challanCode) {
            openSnackbar({ open: true, message: "Please enter a Challan Code", variant: 'alert', severity: 'error', alert: { color: 'error' } });
            return;
        }

        try {
            startLoading();
            const { success, message, data }: any = await lookupChallanCode(challanCode);
            if (!success) {
                openSnackbar({ open: true, message: message, variant: 'alert', severity: 'error', alert: { color: 'error' } });
                setChallanDetails(null);
                setValue("challanId", null);
                setValue("items", []);
                return;
            }

            if (data.status === 'RECEIVED' || data.status === 'CANCELLED') {
                openSnackbar({ open: true, message: `Challan is already ${data.status.toLowerCase()}`, variant: 'alert', severity: 'warning', alert: { color: 'warning' } });
                setChallanDetails(null);
                setValue("challanId", null);
                setValue("items", []);
                return;
            }

            setChallanDetails(data);
            setValue("challanId", data.id);

            // Populate form array with pending items
            const formItems = data.items.map((i: any) => ({
                challanItemId: i.id,
                laundryItemId: i.laundryItemID,
                itemName: i.px_laundry_item?.itemName || '-',
                unitName: i.px_laundry_item?.unitName || '-',
                givenQty: i.givenQty,
                pendingQty: i.pendingQty,
                receivedQty: "",
                damagedQty: "",
            })).filter((i: any) => i.pendingQty > 0);

            setValue("items", formItems);

        } catch (error: any) {
            openSnackbar({ open: true, message: error?.message || 'Something went wrong', variant: 'alert', severity: 'error', alert: { color: 'error' } })
        } finally {
            stopLoading();
        }
    }

    const onSubmit = async (data: ReturnFormType) => {
        if (isView) return;
        if (!data.challanId || data.items.length === 0) {
            openSnackbar({ open: true, message: "No items to return", variant: 'alert', severity: 'error', alert: { color: 'error' } });
            return;
        }

        try {
            startLoading();

            const payload = {
                challanCode,
                challanId: data.challanId,
                returnDate: moment().format('YYYY-MM-DD'),
                receiverManagerID: localStorage.getItem('managerId'),
                note: "",
                createdBy: user?.id,
                items: data.items.map(i => {
                    const rec = parseInt(i.receivedQty || "0");
                    const dam = parseInt(i.damagedQty || "0");
                    return {
                        challanItemID: i.challanItemId,
                        receivedQty: rec,
                        damagedQty: dam
                    }
                }).filter(i => i.receivedQty > 0 || i.damagedQty > 0)
            };

            if (payload.items.length === 0) {
                openSnackbar({ open: true, message: "Please enter received or damaged quantities for at least one item", variant: 'alert', severity: 'error', alert: { color: 'error' } });
                return;
            }

            const { success, message }: any = await createLaundryReturn(payload);
            openSnackbar({
                open: true,
                message: message,
                variant: 'alert',
                alert: { color: success ? 'success' : 'error' }
            });
            if (success) handleBack();
        } catch (error: any) {
            openSnackbar({ open: true, message: error?.message || 'Something went wrong', variant: 'alert', severity: 'error', alert: { color: 'error' } })
        } finally {
            stopLoading();
        }
    }

    return {
        isView,
        challanCode,
        setChallanCode,
        searchChallan,
        challanDetails,
        fields,
        control,
        isSubmitting,
        watch,
        onSubmit,
        handleBack,
        handleSubmit,
    }
}

export default UseAddEditReturn;

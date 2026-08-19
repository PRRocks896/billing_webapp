import { useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import { lookupChallanCode } from "service/laundry-challan";
import { createLaundryReturn } from "service/laundry-return";

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
    const { startLoading, stopLoading, user } = useAuth();
    
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

    const searchChallan = async () => {
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
                laundryItemId: i.laundryItemId,
                itemName: i.laundryItem?.label || '-',
                unitName: i.laundryItem?.unitName || '-',
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
        if (!data.challanId || data.items.length === 0) {
            openSnackbar({ open: true, message: "No items to return", variant: 'alert', severity: 'error', alert: { color: 'error' } });
            return;
        }

        try {
            startLoading();
            
            const payload = {
                challanId: data.challanId,
                createdBy: user?.id,
                items: data.items.map(i => {
                    const rec = parseInt(i.receivedQty || "0");
                    const dam = parseInt(i.damagedQty || "0");
                    return {
                        challanItemId: i.challanItemId,
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

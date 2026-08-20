import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import { createLaundryChallan, getLaundryChallanById, updateLaundryChallan } from "service/laundry-challan";
import { getLaundryItemDropdownList } from "service/laundry-item";
import { getLaundryVendorDropdownList } from "service/laundry-vendor";
import PrintLaundryChallan from "components/printLaundryChallan";
import moment from "moment";

export type ChallanFormType = {
    vendorId: number | null,
    items: {
        laundryItemId: number | null,
        givenQty: string,
        price: string,
    }[]
}

const defaultValues: ChallanFormType = {
    vendorId: null,
    items: [{
        laundryItemId: null,
        givenQty: "",
        price: "",
    }],
}

const UseAddEditChallan = () => {
    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { startLoading, stopLoading, user, isAdmin } = useAuth();

    const [laundryItemList, setLaundryItemList] = useState<any[]>([]);
    const [laundryVendorList, setLaundryVendorList] = useState<any[]>([]);

    const {
        control,
        formState: { isSubmitting },
        setValue,
        getValues,
        watch,
        handleSubmit
    } = useForm<ChallanFormType>({
        defaultValues,
        mode: 'onBlur'
    });

    const { fields, append, remove } = useFieldArray({
        name: "items",
        control: control,
    });

    const addLaundryItem = () => {
        append({
            laundryItemId: null,
            givenQty: "",
            price: "",
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
                alert: { color: 'error' }
            })
        }
    };

    const handleBack = () => navigate("/laundry-management/laundry-challan");

    const fetch = async () => {
        try {
            startLoading();
            const { success, message, data }: any = await getLaundryChallanById(Number(id));
            if (!success) {
                openSnackbar({ open: true, message: message, variant: 'alert', severity: 'error', alert: { color: 'error' } })
                return;
            }
            setValue("vendorId", data?.vendorID);
            if (data?.items && data?.items?.length > 0) {
                const fetchedItems = data.items.map((i: any) => ({
                    laundryItemId: i.laundryItemID,
                    givenQty: i.givenQty.toString(),
                    price: i.price.toString(),
                }));
                setValue("items", fetchedItems);
            }
        } catch (error: any) {
            openSnackbar({ open: true, message: error?.message || 'Something went wrong', variant: 'alert', severity: 'error', alert: { color: 'error' } })
        } finally {
            stopLoading();
        }
    }

    const onSubmit = async (data: ChallanFormType) => {
        try {
            startLoading();
            let payload: any = {
                vendorID: data.vendorId,
                userID: user?.id,
                givenDate: moment().format('YYYY-MM-DD'),
                givenManagerID: localStorage.getItem('managerId') || '',
                note: "",
                items: data.items.map(i => ({
                    laundryItemID: i.laundryItemId,
                    givenQty: parseInt(i.givenQty),
                    price: parseFloat(i.price)
                }))
            };

            if (mode === 'add') {
                payload.createdBy = user?.id;
            } else {
                payload.updatedBy = user?.id;
            }

            const { success, message, data: responseData }: any = mode && mode === 'edit' && id ? await updateLaundryChallan(payload, Number(id)) : await createLaundryChallan(payload);
            openSnackbar({
                open: true,
                message: message,
                variant: 'alert',
                alert: { color: success ? 'success' : 'error' }
            });
            if (success) {
                // Determine print payload when a new challan is created
                if (mode === 'add' && responseData && responseData.challanCode) {
                    const vendor = laundryVendorList.find(v => v.id === payload.vendorID);

                    const printData = {
                        challanCode: responseData.challanCode,
                        date: new Date(),
                        vendorName: vendor ? vendor.name : 'Vendor',
                        shopName: vendor ? vendor.laundryName : '',
                        managerName: localStorage.getItem('managerName') || '',
                        totalItems: payload.items.length,
                        items: payload.items.map((i: any) => {
                            const itemDetail = laundryItemList.find(li => li.value === i.laundryItemID);
                            return {
                                itemName: itemDetail ? itemDetail.label : 'Item',
                                unitName: itemDetail ? itemDetail.unitName : '',
                                givenQty: i.givenQty,
                                price: i.price
                            };
                        })
                    };

                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                        printWindow.document.write(PrintLaundryChallan(printData));
                        printWindow.document.close();
                        // print() is called via script inside the HTML output
                    }
                }

                handleBack();
            }
        } catch (error: any) {
            openSnackbar({ open: true, message: error?.message || 'Something went wrong', variant: 'alert', severity: 'error', alert: { color: 'error' } })
        } finally {
            stopLoading();
        }
    }

    useEffect(() => {
        const fetchDropdownList = async () => {
            try {
                startLoading();
                let where: any = { isActive: true, isDeleted: false };
                let whereForVendor: any = { ...where };
                if (!isAdmin) {
                    whereForVendor = {
                        ...where,
                        userID: user?.id
                    }
                }
                const [vendorRes, itemRes]: any = await Promise.all([
                    getLaundryVendorDropdownList({ where: whereForVendor }),
                    getLaundryItemDropdownList(where)
                ]);
                if (vendorRes.success) setLaundryVendorList(vendorRes.data.rows || []);
                if (itemRes.success) setLaundryItemList(itemRes.data || []);
            } catch (error: any) {
                console.error(error);
            } finally {
                stopLoading();
            }
        }
        fetchDropdownList();
    }, [isAdmin, user]);

    const title: string = useMemo(() => mode === 'edit' && id ? 'Edit Challan' : 'Send Items (Create Challan)', [mode, id]);
    const isEdit = useMemo(() => mode === "edit", [mode]);

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
        laundryVendorList,
        watch,
        onSubmit,
        handleBack,
        handleSubmit,
        addLaundryItem,
        removeLaundryItem
    }
}

export default UseAddEditChallan;

import { openSnackbar } from "api/snackbar";
import { PrintBooking } from "components/printBill";
import useAuth from "hooks/useAuth";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createRedeemBooking, verifyBooking } from "service/redeemBooking";
import { getRoomList } from "service/room";
import { getTherapistDropdown } from "service/staff";
import { listPayload } from "utils/helper";

// ─── Snackbar helpers ─────────────────────────────────────────────────────────

const showError = (error: any) =>
    openSnackbar({
        open: true,
        message: error?.message || error?.messageCode || (error as Error).message || error || "Something went wrong",
        variant: "alert",
        alert: { color: "error" },
        severity: 'error'
    });

const showSuccess = (message: string) =>
    openSnackbar({ open: true, message, variant: "alert", alert: { color: "success" } });

export type redeemBookingFormValue = {
    bookingServiceID: number | null;
    userID: number | null;
    staffID: number | null;
    managerName: string;
    managerId: any;
    roomID: number | null;
    date: Date;
}

const defaultValues: redeemBookingFormValue = {
    bookingServiceID: null,
    userID: null,
    staffID: null,
    managerName: localStorage.getItem("managerName") ?? "",
    managerId: localStorage.getItem("managerId") ?? "",
    roomID: null,
    date: new Date(),
}

const UseRedeemBooking = () => {
    const { user, isAdmin, startLoading, stopLoading } = useAuth();

    const [voucherCode, setVoucherCode] = useState<any>('');
    const [voucherDetail, setVoucherDetail] = useState<any>(null);

    const [staffList, setStaffList] = useState<any[]>([]);
    const [roomList, setRoomList] = useState<any[]>([]);

    const {
        control,
        formState: { isSubmitting },
        reset,
        watch,
        setValue,
        getValues,
        handleSubmit
    } = useForm<redeemBookingFormValue>({
        defaultValues,
        mode: 'onBlur'
    })

    const searchVoucherDetail = async () => {
        try {
            startLoading();
            const { success, message, data }: any = await verifyBooking({
                voucherCode: voucherCode,
                status: 'Pending'
            });
            if (!success) {
                showError('Voucher already redeemed.');
                return;
            }
            setVoucherDetail(data);
        } catch (error: any) {
            showError(error);
        } finally {
            stopLoading();
        }
    }

    const onSubmit = async (data: redeemBookingFormValue) => {
        try {
            startLoading();
            const payload = {
                bookingServiceID: voucherDetail?.id,
                userID: user?.id,
                staffID: data.staffID,
                managerName: localStorage.getItem("managerId"),
                roomID: data.roomID,
                date: data.date,
                createdBy: user?.id
            }
            const { success, message }: any = await createRedeemBooking(payload);
            if (!success) {
                showError(message);
                return;
            }
            showSuccess(message);
            reset();
            setVoucherCode('');
            setVoucherDetail(null);
            const printWindow = window.open("", "_blank", "popup=yes,menubar=no,toolbap=no")
            if (printWindow && printWindow.document) {
                printWindow.document.write(PrintBooking({
                    date: new Date(),
                    customer: voucherDetail?.px_customer?.name,
                    roomNo: roomList.find((item: any) => item.id === data.roomID)?.roomName,
                    item: voucherDetail?.px_service?.name,
                    staff: staffList.find((item: any) => item.value === data.staffID)?.label,
                    reviewUrl: user?.reviewUrl || "",
                }));
                printWindow.document.close();
                printWindow.onload = () => {
                    printWindow.print();
                    printWindow.close();
                };
            }
        } catch (error: any) {
            showError(error);
        } finally {
            stopLoading();
        }
    }

    /**
     * Retrieves all essential reference data concurrently for optimally fast setup.
     */
    const fetchDropDown = useCallback(async () => {
        const whereCondition = { isActive: true, isDeleted: false };

        const isAdminRole = ['admin', 'super admin'].includes(user?.px_role?.name?.toLowerCase() ?? "");

        // Ensure accurate scoping context mapped dynamically for room viewing list
        const roomWhereCondition = isAdminRole
            ? whereCondition
            : { ...whereCondition, createdBy: user?.id };

        // Execute API promises concurrently significantly improving UI block time
        const [staffRes, roomRes]: any[] = await Promise.all([
            getTherapistDropdown({ ...whereCondition, searchText: "THERAPIST" }),
            getRoomList(listPayload(0, roomWhereCondition, 100000)),
        ]);

        // Securely handle rendering guarantees preventing invalid lists crash
        setStaffList(staffRes?.success && staffRes.data ? staffRes.data : []);
        setRoomList(roomRes?.success && roomRes.data ? roomRes.data?.rows : []);
    }, [user]);

    useEffect(() => {
        if (voucherDetail) {
            fetchDropDown();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchDropDown, voucherDetail]);

    useEffect(() => {
        // Initialize Manager from localStorage when component mounts
        const storedManagerName = localStorage.getItem("managerName") ?? "";
        const storedManagerId = localStorage.getItem("managerId") ?? "";
        if (storedManagerName) {
            setValue("managerName", storedManagerName);
        }
        if (storedManagerId) {
            setValue("managerId", storedManagerId);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array ensures this runs only once on mount

    return {
        voucherCode,
        voucherDetail,
        setVoucherDetail,

        // List Collections
        staffList,
        roomList,

        // Form 
        control,
        isSubmitting,
        reset,
        handleSubmit,

        onSubmit,
        setVoucherCode,
        searchVoucherDetail,
    }
}

export default UseRedeemBooking;
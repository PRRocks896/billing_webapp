import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import { PaymentDetailItem } from "pages/bill/hooks/usePaymentModal";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { verifyOTP } from "service/auth";
import { getCustomerDropdown, sendMembershipOtp, sendMembershipRedeemOtp, verifyMembershipOtp, verifyMembershipRedeemOtp } from "service/customer";
import { addExtraHours, updateMembership, createMembership, getMembershipById, getMembershipViaPayload } from "service/membership";
import { getMembershipPlanViaPayload } from "service/membershipPlan";
import { calculateGSTDetails, listPayload } from "utils/helper";
import { getRoomList } from "service/room";
import { getServiceList } from "service/service";
import { getTherapistDropdown } from "service/staff";
import { createMembershipRedeem, getMembershipRedeemById, getMembershipRedeemViaPayload } from "service/membershipRedeem";
import { createRenewPlan, getRenewPlanById } from "service/renewPlan";
import { PrintBill } from "components/printBill";
import { Bill, TableData } from "types/common";

export type BasicFormValue = {
    date: Date | null;
    customerID: string | number;
}

export type MembershipRedeemFormValue = {
    userID: number;
    roomID: number | null;
    membershipID: number | null;
    staffID: number | null;
    serviceID: number | null;
    serviceName: string | null;
    billNo: string | null;
    minutes: number | null;
    managerName: string;
}

export type MembershipFormValue = {
    userID: number;
    membershipPlanID: number | null;
    managerName: string;
    extraHours: string;
    validity: string;
    cardNo: string;
    referenceBy: "google" | "instagram_or_facebook" | "direct_call" | "website" | "justdial" | "other" | null;
    paymentDetail: PaymentDetailItem[]
}

export type RenewMembershipFormValue = MembershipFormValue & {
    userID: number;
    membershipID: number | null;
    managerName: string;
    extraHours: string;
    validity: string;
    cardNo: string;
    referenceBy: "google" | "instagram_or_facebook" | "direct_call" | "website" | "justdial" | "other" | null;
    paymentDetail: PaymentDetailItem[]
}


// ─── Snackbar helpers ─────────────────────────────────────────────────────────

const showError = (error: any) =>
    openSnackbar({
        open: true,
        message: error?.message || error?.messageCode || (error as Error).message || "Something went wrong",
        variant: "alert",
        alert: { color: "error" },
    });

const showSuccess = (message: string) =>
    openSnackbar({ open: true, message, variant: "alert", alert: { color: "success" } });

const UseMembership = () => {
    const { user, isAdmin, startLoading, stopLoading } = useAuth();

    const [isAddCustomerOpen, setIsAddCustomerOpen] = useState<boolean>(false);

    const [membershipPlanList, setMembershipPlanList] = useState<any[]>([]);
    const [customerList, setCustomerList] = useState<any[]>([]);
    const [isCustomerSearching, setIsCustomerSearching] = useState<boolean>(false);
    const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Guard to prevent concurrent/duplicate membership save calls (Bug #1)
    const isSavingMembershipRef = useRef<boolean>(false);
    const [isOtpSend, setIsOtpSend] = useState<boolean>(false);
    const [isAddMembershipShow, setIsAddMembershipShow] = useState<boolean>(false);
    const [isPayment, setIsPayment] = useState<boolean>(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
    const [openVerifyMembershipModal, setOpenVerifyMembershipModal] = useState<boolean>(false);
    const [openVerifyMembershipByMerchantModal, setOpenVerifyMembershipByMerchantModal] = useState<boolean>(false);
    const [verifyCustomerMembership, setVerifyCustomerMembership] = useState<boolean>(false);

    const [isMembershipRedeemShow, setIsMembershipRedeemShow] = useState<boolean>(false);
    const [isMembershipRedeemOtpSend, setIsMembershipRedeemOtpSend] = useState<boolean>(false);
    const [membershipRedeemHistory, setMembershipRedeemHistory] = useState<any[]>([]);
    const [membershipList, setMembershipList] = useState<any[]>([]);
    const [selectedMembershipID, setSelectedMembershipID] = useState<number | null>(null);
    const [roomList, setRoomList] = useState<any[]>([]);
    const [serviceList, setServiceList] = useState<any[]>([]);
    const [therapistList, setTherapistList] = useState<any[]>([]);
    const [selectedMembershipIDForEdit, setSelectedMembershipIDForEdit] = useState<number | null>(null);
    const [isMembershipEdit, setIsMembershipEdit] = useState<boolean>(false);

    const [isRenewMembershipShow, setIsRenewMembershipShow] = useState<boolean>(false);

    const BasicForm = useForm<BasicFormValue>({
        defaultValues: {
            date: new Date(),
            customerID: "",
        }
    });

    const MembershipForm = useForm<MembershipFormValue>({
        defaultValues: {
            userID: user?.id,
            membershipPlanID: null,
            managerName: localStorage.getItem("managerName") || '',
            extraHours: "0",
            validity: "6",
            cardNo: "",
            paymentDetail: [],
        }
    });

    const MembershipRedeemForm = useForm<MembershipRedeemFormValue>({
        defaultValues: {
            userID: user?.id,
            roomID: null,
            membershipID: null,
            staffID: null,
            serviceID: null,
            serviceName: null,
            billNo: null,
            minutes: null,
            managerName: localStorage.getItem("managerName") || '',
        }
    });

    const RenewMembershipForm = useForm<RenewMembershipFormValue>({
        defaultValues: {
            userID: user?.id,
            membershipPlanID: null,
            managerName: localStorage.getItem("managerName") || '',
            extraHours: "0",
            validity: "6",
            cardNo: "",
            paymentDetail: [],
            membershipID: null,
        }
    });

    // Runs once on mount — localStorage is not reactive
    useEffect(() => {
        const managerName = localStorage.getItem("managerName") || '';
        if (managerName) {
            MembershipForm.setValue("managerName", managerName);
            MembershipRedeemForm.setValue("managerName", managerName);
        }
        if (isRenewMembershipShow) {
            RenewMembershipForm.setValue("managerName", managerName);
        }
    }, [localStorage.getItem("managerName"), isRenewMembershipShow]);

    // ── Modal toggles ──────────────────────────────────────────────────────
    const toggleAddCustomerModal = useCallback(() => setIsAddCustomerOpen(prev => !prev), []);
    const togglePaymentModal = useCallback(() => setIsPaymentModalOpen(prev => !prev), []);
    const toggleAddMembershipShow = useCallback(() => setIsAddMembershipShow(prev => !prev), []);
    const toggleMembershipRedeemShow = useCallback(() => setIsMembershipRedeemShow(prev => !prev), []);
    const toggleMembershipRedeemOtpSend = useCallback(() => setIsMembershipRedeemOtpSend(prev => !prev), []);
    const toggleRenewMembershipShow = useCallback(() => setIsRenewMembershipShow(prev => !prev), []);
    const toggleMembershipEdit = useCallback(() => setIsMembershipEdit(prev => !prev), []);

    const gstValue = useMemo<{ csgst: number; sgst: number }>(() => {
        const company = user?.px_company;
        if (company?.CGST && company?.SGST) {
            return {
                csgst: parseFloat(company.CGST),
                sgst: parseFloat(company.SGST),
            };
        }
        return { csgst: 0, sgst: 0 };
    }, [user]);

    // ── Customer search (debounced) ────────────────────────────────────────

    const searchCustomerViaPhone = useCallback((searchText: string = "") => {
        setIsAddMembershipShow(false);
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

        const digitsOnly = searchText.replace(/\D/g, "");
        if (digitsOnly.length !== 10) {
            setCustomerList([]);
            return;
        }

        searchDebounceRef.current = setTimeout(async () => {
            try {
                setIsCustomerSearching(true);
                const whereCondition = { searchText: digitsOnly, isActive: true, isDeleted: false };
                const { success, data }: any = await getCustomerDropdown(whereCondition);
                setCustomerList(success && Array.isArray(data) && data.length > 0 ? data : []);
            } catch (error: any) {
                showError(error);
            } finally {
                setIsCustomerSearching(false);
                setSelectedMembershipID(null);
                setIsMembershipRedeemShow(false);
                setIsAddMembershipShow(false);
            }
        }, 300);
    }, []);

    // ── Private: fetch plans without managing global loading state ─────────
    // Used as a sub-step inside functions that already own the loading state.
    const loadMembershipPlans = async () => {
        const { success, message, data }: any = await getMembershipPlanViaPayload({
            isActive: true,
            isDeleted: false
        });
        if (!success) {
            showError({ message });
            setMembershipPlanList([]);
            return;
        }
        setMembershipPlanList(data);
    };

    // ── Public: standalone dropdown fetch (own loading state) ─────────────
    const fetchMembershipPlanDropDown = async () => {
        try {
            startLoading();
            await loadMembershipPlans();
        } catch (error: any) {
            showError(error);
        } finally {
            stopLoading();
        }
    };

    // ── Dropdown fetching ──────────────────────────────────────────────────

    const fetchMembershipDropDown = useCallback(async () => {
        const whereCondition = { isActive: true, isDeleted: false };

        const roomWhereCondition = isAdmin
            ? whereCondition
            : { ...whereCondition, createdBy: user?.id };

        const [staffRes, roomRes]: any[] = await Promise.all([
            getTherapistDropdown({ ...whereCondition, searchText: "THERAPIST" }),
            // getServiceList(payload),
            getRoomList(listPayload(0, roomWhereCondition, 100000)),
        ]);

        setTherapistList(staffRes?.success && staffRes.data ? staffRes.data : []);
        // setServiceList(serviceRes?.success && serviceRes.data ? serviceRes.data?.rows?.filter((service: any) => [60, 120].includes(service.minutes)) : []);
        setRoomList(roomRes?.success && roomRes.data ? roomRes.data?.rows : []);
    }, [user]);

    const fetchServiceDropDown = useCallback(async () => {
        try {
            if (!MembershipRedeemForm.getValues('minutes')) {
                setServiceList([]);
                return;
            }
            startLoading();
            const whereCondition = { isWebDisplay: false, isActive: true, isDeleted: false, minutes: MembershipRedeemForm.getValues('minutes') };
            const payload = listPayload(0, whereCondition, 1000);
            const { success, message, data }: any = await getServiceList(payload);
            if (!success) {
                showError({ message });
                setServiceList([]);
                return;
            }
            setServiceList(data?.rows || []);
        } catch (error) {
            showError(error);
        } finally {
            stopLoading();
        }
    }, [MembershipRedeemForm.watch('minutes')]);

    useEffect(() => {
        fetchServiceDropDown();
    }, [fetchServiceDropDown]);

    const handleFindMembership = async (body: BasicFormValue) => {
        try {
            startLoading();
            const { success, data }: any = await getMembershipViaPayload({
                customerID: body.customerID,
                isActive: true,
                isDeleted: false
            });
            if (!success) {
                showError({ message: "Membership not found" });
                setIsAddMembershipShow(true);
                // Awaited so both calls share the same loading window
                await loadMembershipPlans();
                return;
            } else {
                setIsMembershipRedeemShow(true);
                setMembershipList(data);
                fetchMembershipDropDown();
            }
            setIsAddMembershipShow(false);
        } catch (error: any) {
            showError(error);
        } finally {
            stopLoading();
        }
    };

    const handleDetchRedeemHistory = async (membership: any) => {
        try {
            startLoading();
            const { success, message, data }: any = await getMembershipRedeemViaPayload({
                isActive: true,
                isDeleted: false,
                customerID: membership?.customerID,
                membershipID: membership?.id
            });
            if (!success) {
                showError({ message });
                return;
            }
            if (data && Array.isArray(data) && data.length > 0) {
                setMembershipRedeemHistory(data);
            }
        } catch (error: any) {
            showError(error);
        } finally {
            stopLoading();
        }
    }

    // =========================================================================
    // REDEEM MEMBERSHIP FLOW
    // =========================================================================
    // The redemption process requires verifying the customer's intent via OTP before
    // deducting hours from their active membership plan.
    // 
    // Flow Sequence:
    // 1. handleSendOtpMembershipRedeem -> Validates entered duration against remaining balance and sends OTP.
    // 2. handleVerifyMembershipRedeemOtp -> Submits customer's OTP for validation.
    // 3. handleSaveMembershipRedeem -> Finalizes the transaction in the database.
    // =========================================================================

    const handleSendOtpMembershipRedeem = async (info: MembershipRedeemFormValue) => {
        try {
            const selectedMembership = membershipList.find((membership) => membership.id === selectedMembershipID);
            if (!selectedMembership) {
                showError({ message: "Membership not found" });
                return;
            }
            if (selectedMembership.minutes === 0) {
                showError({ message: "Minutes not Available" });
                return;
            }

            if (info.minutes && (info.minutes > selectedMembership.minutes)) {
                showError({ message: `Only ${selectedMembership.minutes} Minutes Available` });
                return;
            }
            startLoading();
            const { success, message }: any = await sendMembershipRedeemOtp({
                customerID: selectedMembership.customerID,
                membershipID: selectedMembershipID,
                serviceName: serviceList.find((item) => item.id === info.serviceID)?.name,
                minutes: info?.minutes
            });
            if (!success) {
                showError({ message });
                return;
            }
            showSuccess(message);
            // setIsMembershipRedeemOtpSend(true);
            setIsOtpSend(true);
        } catch (error: any) {
            showError(error);
        } finally {
            stopLoading();
        }
    }

    const handleVerifyMembershipRedeemOtp = async (otp: string) => {
        try {
            const selectedMembership = membershipList.find((membership) => membership.id === selectedMembershipID);
            if (!selectedMembership) {
                showError({ message: "Membership not found" });
                return;
            }
            startLoading();
            const { success, message }: any = await verifyMembershipRedeemOtp({
                otp,
                customerID: selectedMembership.customerID,

            });
            if (!success) {
                showError({ message });
                return;
            }
            showSuccess(message);
            setIsMembershipRedeemOtpSend(true);
            setIsOtpSend(false);
            handleSaveMembershipRedeem(MembershipRedeemForm.getValues())
        } catch (error: any) {
            showError(error);
        } finally {
            stopLoading();
        }
    }

    const handleSaveMembershipRedeem = async (info: MembershipRedeemFormValue) => {
        try {
            const selectedMembership = membershipList.find((membership) => membership.id === selectedMembershipID);
            if (!selectedMembership) {
                showError({ message: "Membership not found" });
                return;
            }
            startLoading();
            const payload = {
                userID: user?.id,
                customerID: selectedMembership.customerID,
                roomID: info.roomID,
                membershipID: selectedMembershipID,
                staffID: info.staffID,
                serviceID: info.serviceID,
                membershipPurchaseUserID: selectedMembership.userID,
                minutes: info.minutes,
                remainMinutes: parseInt(selectedMembership.minutes) > 0 ? (parseInt(selectedMembership.minutes) - (info.minutes ? info.minutes : 0)) : 0,
                managerName: localStorage.getItem('managerId'),
                createdBy: user?.id,
            }
            const { success, message, data }: any = await createMembershipRedeem(payload);
            if (!success) {
                showError({ message });
                return;
            }
            showSuccess(message);
            handleMembershipRedeemPrint(data.id);
            // setIsMembershipRedeemShow(false);
            setIsMembershipRedeemOtpSend(false);
            setIsOtpSend(false);
            setSelectedMembershipID(null);
            MembershipRedeemForm.reset();
            setMembershipList([]);
            handleFindMembership(BasicForm.getValues());
        } catch (error: any) {
            showError(error);
        } finally {
            stopLoading();
        }
    }

    const handleMembershipRedeemPrint = async (id: number) => {
        try {
            startLoading();
            const { success, message, data }: any = await getMembershipRedeemById(id);
            if (!success) {
                showError({ message });
                return;
            }
            const tableData: TableData[] = [{
                item: data?.px_service?.name,
                hsnCode: data?.px_service?.hsnCode || '',
                quantity: 1,
                total: 1,
                subTotal: 1,
                cgst: 0,
                sgst: 0,
                payment: 'CASH',
                paymentId: 1,
                cardNo: '',
                billNo: data?.billNo,
                grandTotal: 1
            }]
            const billData: Bill = {
                date: new Date(data?.createdAt),
                customer: data?.px_customer?.name,
                staff: data?.px_staff?.nickName,
                roomNo: data?.px_room?.roomName || '',
                gstNo: user?.gstNo || "",
                isShowGst: false,
                tableData,
                grandTotal: tableData.reduce((acc: number, curr: any) => acc + (curr.grandTotal || 0), 0),
                cgstPercentage: gstValue.csgst,
                sgstPercentage: gstValue.sgst,
            }
            const branchData = {
                title: user?.billTitle
                    ? user?.billTitle
                    : "green health spa and saloon",
                address: user?.address
                    ? user?.address
                    : "NO, 52 HUDA COLONY, MANIKONDA HYDERABAD, TELANGANA - 500089",
                phone1: user?.phoneNumber || "",
                phone2: user?.phoneNumber2 || "",
                reviewUrl: user?.reviewUrl && user?.reviewUrl.length ? user?.reviewUrl : ""
            };
            const printWindow = window.open("", "_blank", "popup=yes");
            if (printWindow && printWindow.document) {
                printWindow.document.write(PrintBill(billData, branchData));
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

    // =========================================================================
    // ADD & RENEW MEMBERSHIP FLOW
    // =========================================================================
    // Both Add and Renew paths utilize the exact same functional steps and refer to 
    // the global `MembershipForm` context for finalizing logic. 
    //
    // Flow Sequence inside form.handleSubmit:
    // 1. togglePaymentModal -> Opens the Payment Modal directly from the UI.
    // 2. handlePaymentDetail -> Receives validated payment objects, updates form state, and calls `getOtp()`.
    // 3. getOtp -> Pings the Merchant/Admin for OTP approval (especially when extra hours are granted). 
    //              (Opens `openVerifyMembershipByMerchantModal`)
    // 4. verifyOtp -> Verifies Merchant's OTP. If successful, automatically cascades to `handleSendOtpForMembership`.
    // 5. handleSendOtpForMembership -> Pings the Customer for OTP confirmation. (Opens `openVerifyMembershipModal`).
    // 6. handleVerifyMembership -> Verifies Customer's OTP. If successful, cascades to `handleSaveMembership`.
    // 7. handleSaveMembership -> Calculates total amounts/GST with final values, constructs final payload, and commits to DB.
    // =========================================================================

    const handleSaveMembership = async (body: MembershipFormValue) => {
        // Bug #1: Block duplicate/concurrent calls (e.g. double-click or form re-submit during OTP cascade)
        if (isSavingMembershipRef.current) return;
        isSavingMembershipRef.current = true;
        try {
            const selectedMemberShipPlan = membershipPlanList.find(item => item.id === body.membershipPlanID);
            if (!selectedMemberShipPlan) {
                showError({ message: "Selected membership plan not found" });
                return;
            }
            const totalMinutes = (selectedMemberShipPlan.hours + parseInt(body.extraHours)) * 60 || 0;
            const gstRate = gstValue.csgst + gstValue.sgst;
            const billPayload = body.paymentDetail.map((item: PaymentDetailItem) => {
                const { baseAmount, cgst, sgst, totalAmount } = calculateGSTDetails(item.amount, gstRate, true);
                return {
                    userID: user?.id,
                    staffID: 1,
                    customerID: BasicForm.getValues('customerID'),
                    roomID: 1,
                    paymentID: item.id,
                    cgst: cgst.toString(),
                    sgst: sgst.toString(),
                    cardNo: item.cardNo,
                    referenceBy: body.referenceBy || "other",
                    managerName: localStorage.getItem("managerId"),
                    createdBy: user?.id,
                    grandTotal: totalAmount.toString(),
                    detail: [{
                        discount: 0,
                        quantity: 1,
                        rate: baseAmount,
                        total: baseAmount,
                        hsnCode: selectedMemberShipPlan?.hsnCode || '',
                        membershipPlanID: selectedMemberShipPlan.id,
                    }],
                };
            });
            const payload: any = {
                ...body,
                customerID: BasicForm.getValues('customerID'),
                managerName: localStorage.getItem("managerId"),
                minutes: totalMinutes,
                billDetail: billPayload,
                createdBy: user?.id,
            };
            delete payload['referenceBy'];
            const { success, message, data }: any = await createMembership(payload);
            if (success) {
                handleMembershipPrint(data?.id);
                showSuccess(message);
                setCustomerList([]);
                setMembershipPlanList([]);
                setIsAddMembershipShow(false);
                setVerifyCustomerMembership(false);
                setOpenVerifyMembershipModal(false);
                setIsPayment(false);
                setIsOtpSend(false);
                BasicForm.reset();
                MembershipForm.reset();
            } else {
                showError({ message });
            }
        } catch (error: any) {
            showError(error);
        } finally {
            // Bug #7: Don't call stopLoading here — the parent (handleVerifyMembership) manages the loader.
            // Reset the guard so future saves are allowed after this one completes.
            isSavingMembershipRef.current = false;
        }
    };

    const handleMembershipPrint = async (id: number) => {
        try {
            startLoading();
            const { success, message, data }: any = await getMembershipById(id);
            if (!success) {
                showError(message);
                return;
            }
            const tableData = data.billDetail?.map((payment: any) => {
                let tempTotal = payment?.grandTotal;
                let cgst = 0;
                let sgst = 0;
                if (user && user.isShowGst) {
                    const calcGst = calculateGSTDetails(tempTotal, (gstValue.csgst + gstValue.sgst), true);
                    tempTotal = calcGst.baseAmount;
                    cgst = calcGst.cgst;
                    sgst = calcGst.sgst;
                }

                return {
                    item: data?.px_membership_plan?.planName,
                    hsnCode: data?.px_membership_plan?.hsnCode,
                    quantity: 1,
                    total: tempTotal,
                    subTotal: tempTotal,
                    cgst: cgst,
                    sgst: sgst,
                    payment: payment?.px_payment_type?.name,
                    paymentId: payment.id,
                    cardNo: payment.cardNo,
                    billNo: payment.billNo,
                    grandTotal: Math.round(parseFloat(tempTotal) + cgst + sgst)
                }
            });
            const billData: Bill = {
                date: new Date(data?.createdAt),
                customer: data?.px_customer?.name,
                tableData: tableData,
                grandTotal: tableData.reduce((acc: number, curr: any) => acc + (curr.grandTotal || 0), 0),
                gstNo: user?.gstNo || "",
                isShowGst: user?.isShowGst || false,
                cgstPercentage: gstValue.csgst,
                sgstPercentage: gstValue.sgst,
                roomNo: "",
                staff: "",
            }
            const branchData = {
                title: user?.billTitle
                    ? user?.billTitle
                    : "green health spa and saloon",
                address: user?.address
                    ? user?.address
                    : "NO, 52 HUDA COLONY, MANIKONDA HYDERABAD, TELANGANA - 500089",
                phone1: user?.phoneNumber || "",
                phone2: user?.phoneNumber2 || "",
                reviewUrl: user?.reviewUrl && user?.reviewUrl.length ? user?.reviewUrl : ""
            };
            const printWindow = window.open("", "_blank", "popup=yes");
            if (printWindow && printWindow.document) {
                printWindow.document.write(PrintBill(billData, branchData, false));
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

    const handleRenewMembership = async (body: RenewMembershipFormValue) => {
        try {
            startLoading();
            const selectedMemberShipPlan = membershipPlanList.find(item => item.id === body.membershipPlanID);
            if (!selectedMemberShipPlan) {
                showError({ message: "Selected membership plan not found" });
                return;
            }
            const totalMinutes = (selectedMemberShipPlan.hours + parseInt(body.extraHours)) * 60 || 0;
            const selectedMembership = membershipList.find((m: any) => m.id === selectedMembershipID);
            const updatedMembershipMinutes = totalMinutes + selectedMembership?.minutes;
            const gstRate = gstValue.csgst + gstValue.sgst;
            const billPayload = body.paymentDetail.map((item: PaymentDetailItem) => {
                const { baseAmount, cgst, sgst, totalAmount } = calculateGSTDetails(item.amount, gstRate, true);
                return {
                    userID: user?.id,
                    staffID: 1,
                    customerID: BasicForm.getValues('customerID'),
                    roomID: 1,
                    paymentID: item.id,
                    cgst: cgst.toString(),
                    sgst: sgst.toString(),
                    cardNo: item.cardNo,
                    referenceBy: body.referenceBy || "other",
                    managerName: localStorage.getItem("managerId"),
                    createdBy: user?.id,
                    grandTotal: totalAmount.toString(),
                    detail: [{
                        discount: 0,
                        quantity: 1,
                        rate: baseAmount,
                        total: baseAmount,
                        hsnCode: selectedMemberShipPlan?.hsnCode || '',
                        membershipPlanID: selectedMemberShipPlan.id,
                    }],
                };
            });
            let payload: any = {
                ...body,
                membershipID: selectedMembershipID,
                customerID: BasicForm.getValues('customerID'),
                managerName: localStorage.getItem("managerId"),
                minutes: totalMinutes,
                billDetail: billPayload,
                createdBy: user?.id,
                updatedMembershipMinutes
            };

            delete payload['referenceBy'];
            delete payload['paymentDetail']
            const { success, message, data }: any = await createRenewPlan(payload);
            if (success) {
                handleRenewMembershipPrint(data.id)
                showSuccess(message);
                setCustomerList([]);
                setMembershipPlanList([]);
                setIsAddMembershipShow(false);
                setIsMembershipRedeemShow(false);
                setVerifyCustomerMembership(false);
                setOpenVerifyMembershipModal(false);
                setIsRenewMembershipShow(false);
                setIsPayment(false);
                setIsOtpSend(false);
                BasicForm.reset();
                MembershipForm.reset();
                RenewMembershipForm.reset();
            } else {
                showError({ message });
            }
        } catch (error: any) {
            showError(error);
        } finally {
            stopLoading();
        }
    }

    const handleRenewMembershipPrint = async (id: number) => {
        try {
            startLoading();
            const { success, message, data }: any = await getRenewPlanById(id);
            if (!success) {
                showError({ message });
                return;
            }
            const tableData: TableData[] = data?.billDetail?.map((item: any) => {
                const gstRate = gstValue.csgst + gstValue.sgst;
                const { baseAmount, cgst, sgst, totalAmount } = calculateGSTDetails(item.grandTotal, gstRate, true);
                return {
                    billNo: item.billNo,
                    paymentId: item.paymentID,
                    item: data?.px_membership_plan?.planName,
                    hsnCode: data?.px_membership_plan?.hsnCode,
                    quantity: 1,
                    total: baseAmount,
                    grandTotal: item.grandTotal,
                    subTotal: baseAmount,
                    cgst: cgst,
                    sgst: sgst,
                    payment: item?.px_payment_type?.name,
                    cardNo: item.cardNo,
                }
            });
            const billData: Bill = {
                date: new Date(data?.createdAt),
                customer: data?.px_customer?.name,
                tableData: tableData,
                grandTotal: tableData.reduce((acc: number, curr: any) => acc + (curr.grandTotal || 0), 0),
                gstNo: user?.gstNo || "",
                isShowGst: user?.isShowGst || false,
                cgstPercentage: gstValue.csgst,
                sgstPercentage: gstValue.sgst,
                roomNo: "",
                staff: "",
            }
            const branchData = {
                title: user?.billTitle
                    ? user?.billTitle
                    : "green health spa and saloon",
                address: user?.address
                    ? user?.address
                    : "NO, 52 HUDA COLONY, MANIKONDA HYDERABAD, TELANGANA - 500089",
                phone1: user?.phoneNumber || "",
                phone2: user?.phoneNumber2 || "",
                reviewUrl: user?.reviewUrl && user?.reviewUrl.length ? user?.reviewUrl : ""
            };
            const printWindow = window.open("", "_blank", "popup=yes");
            if (printWindow && printWindow.document) {
                printWindow.document.write(PrintBill(billData, branchData, false));
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

    const handleSendOtpForMembership = async (info: any) => {
        try {
            startLoading();
            const { success, message }: any = await sendMembershipOtp({
                customerID: BasicForm.getValues('customerID'),
                membershipPlanID: info.membershipPlanID,
                validity: info.validity,
                extraHours: info.extraHours || 0
            });
            if (success) {
                setOpenVerifyMembershipModal(true);
            } else {
                showError({ message });
            }
        } catch (error: any) {
            showError(error);
        } finally {
            stopLoading();
        }
    };

    const handleVerifyMembership = async (otp: string) => {
        try {
            startLoading();
            const { success, message }: any = await verifyMembershipOtp({
                otp,
                customerID: BasicForm.getValues('customerID')
            });
            if (success) {
                setOpenVerifyMembershipModal(false);
                setVerifyCustomerMembership(true);
                // Awaited so loader stays active until membership is fully saved
                isRenewMembershipShow ? await handleRenewMembership(RenewMembershipForm.getValues()) : await handleSaveMembership(MembershipForm.getValues());
            } else {
                showError({ message });
            }
        } catch (error: any) {
            showError(error);
        } finally {
            stopLoading();
        }
    };

    const handleEditMembership = async (info: any) => {
        try {
            startLoading();
            const { success, message }: any = await updateMembership({
                minutes: info.minutes,
                customerID: BasicForm.getValues('customerID'),
            }, selectedMembershipIDForEdit!);
            if (success) {
                showSuccess(message);
                setIsMembershipEdit(false);
                handleFindMembership(BasicForm.getValues());
            } else {
                showError({ message });
            }
        } catch (error: any) {
            showError(error);
        } finally {
            stopLoading();
        }
    };

    const verifyOtp = async (otp: string) => {
        try {
            startLoading();
            const { success, message }: any = await verifyOTP({
                phoneNumber: user?.phoneNumber,
                otp
            });
            if (success) {
                setOpenVerifyMembershipByMerchantModal(false);
                // Awaited — handleSendOtpForMembership opens the customer modal internally
                await handleSendOtpForMembership({
                    customerID: BasicForm.getValues('customerID'),
                    membershipPlanID: isRenewMembershipShow ? RenewMembershipForm.getValues('membershipPlanID') : MembershipForm.getValues('membershipPlanID'),
                    validity: isRenewMembershipShow ? RenewMembershipForm.getValues('validity') : MembershipForm.getValues('validity'),
                    extraHours: isRenewMembershipShow ? RenewMembershipForm.getValues('extraHours') : MembershipForm.getValues('extraHours') || 0
                });
            } else {
                showError(message);
            }
        } catch (error: any) {
            showError(error);
        } finally {
            stopLoading();
        }
    };

    const getOtp = useCallback(async () => {
        try {
            startLoading();
            const { success, message }: any = await addExtraHours({
                customerID: BasicForm.getValues('customerID'),
                membershipPlanID: isRenewMembershipShow ? RenewMembershipForm.getValues('membershipPlanID') : MembershipForm.getValues('membershipPlanID'),
                validity: isRenewMembershipShow ? RenewMembershipForm.getValues('validity') : MembershipForm.getValues('validity'),
                extraHours: isRenewMembershipShow ? RenewMembershipForm.getValues('extraHours') : MembershipForm.getValues('extraHours') || 0
            });
            if (success) {
                setIsOtpSend(true);
                setOpenVerifyMembershipByMerchantModal(true);
            } else {
                showError(message);
            }
        } catch (error: any) {
            showError(error);
        } finally {
            stopLoading();
        }
    }, [startLoading, stopLoading, isRenewMembershipShow]);

    const handleCancelVerifyPermission = () => {
        setIsOtpSend(false);
        setOpenVerifyMembershipByMerchantModal(false);
        setOpenVerifyMembershipModal(false);
    };

    const handlePaymentDetail = useCallback((paymentDetail: PaymentDetailItem[]) => {
        isRenewMembershipShow ? RenewMembershipForm.setValue('paymentDetail', paymentDetail) : MembershipForm.setValue('paymentDetail', paymentDetail);
        setIsPaymentModalOpen(false);
        setIsPayment(true);
        getOtp();
    }, [getOtp]);

    const serviceDropDown = useMemo(() => {
        return serviceList.filter((service: any) => MembershipRedeemForm.getValues('minutes') ? service.minutes === MembershipRedeemForm.getValues('minutes') : true);
    }, [serviceList, MembershipRedeemForm.watch('minutes')]);

    return {
        user,
        isAdmin,
        isOtpSend,
        isPayment,
        BasicForm,
        roomList,
        isMembershipEdit,
        serviceList,
        therapistList,
        customerList,
        MembershipForm,
        serviceDropDown,
        membershipList,
        isAddCustomerOpen,
        isPaymentModalOpen,
        membershipPlanList,
        RenewMembershipForm,
        isAddMembershipShow,
        isCustomerSearching,
        selectedMembershipID,
        MembershipRedeemForm,
        isRenewMembershipShow,
        isMembershipRedeemShow,
        membershipRedeemHistory,
        verifyCustomerMembership,
        openVerifyMembershipModal,
        isMembershipRedeemOtpSend,
        selectedMembershipIDForEdit,
        openVerifyMembershipByMerchantModal,
        getOtp,
        verifyOtp,
        setIsOtpSend,
        handleEditMembership,
        setIsMembershipRedeemShow,
        setIsAddMembershipShow,
        toggleMembershipEdit,
        togglePaymentModal,
        handlePaymentDetail,
        handleFindMembership,
        handleSaveMembership,
        setIsPaymentModalOpen,
        handleRenewMembership,
        toggleAddCustomerModal,
        handleVerifyMembership,
        searchCustomerViaPhone,
        toggleAddMembershipShow,
        setSelectedMembershipID,
        handleDetchRedeemHistory,
        toggleRenewMembershipShow,
        toggleMembershipRedeemShow,
        handleSendOtpForMembership,
        handleSaveMembershipRedeem,
        fetchMembershipPlanDropDown,
        setIsMembershipRedeemOtpSend,
        setOpenVerifyMembershipModal,
        handleCancelVerifyPermission,
        toggleMembershipRedeemOtpSend,
        handleSendOtpMembershipRedeem,
        setSelectedMembershipIDForEdit,
        handleVerifyMembershipRedeemOtp,
        setOpenVerifyMembershipByMerchantModal,
    }
}

export default UseMembership;

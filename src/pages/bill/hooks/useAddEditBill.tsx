import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import moment from "moment";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { getCustomerDropdown } from "service/customer";
import { getPaymentTypeList } from "service/payment-type";
import { getRoomList } from "service/room";
import { getServiceList } from "service/service";
import { getTherapistDropdown } from "service/staff";
import { createBulkBill, getBillById, updateBill, validateGiftCard, redeemGiftCard } from "service/bill";
import { calculateGSTDetails, listPayload, showTwoDecimal } from "utils/helper";
import { PaymentDetailItem } from "./usePaymentModal";
import { Bill, Branch, TableData } from "types/common";
import { PrintBill } from "components/printBill";

// ============================================================================
// Types
// ============================================================================

export type BillFormValue = {
    date: string | null;
    customerID: string;
    Phone: string;
    staffID: string;
    roomID: string;
    cardNo: string;
    csgst: number;
    sgst: number;
    grandTotal: string | null;
    cashSale: number;
    cardSale: number;
    upiSale: number;
    serviceID: string;
    paymentID?: number | null;
    quantity: number;
    rate: number | null;
    hsnCode: string;
    discount: number;
    total: number | null;
    referenceBy: "google" | "instagram_or_facebook" | "direct_call" | "website" | "justdial" | "other" | null;
    managerName: string;
    managerID?: any;
    paymentDetail: PaymentDetailItem[];
};

// ============================================================================
// Constants
// ============================================================================

const ADMIN_ROLES = ['admin', 'super admin'];

const defaultValues: BillFormValue = {
    date: moment().format("DD/MM/yyyy"),
    customerID: "",
    Phone: "",
    staffID: "",
    roomID: "",
    cardNo: "",
    csgst: 0,
    sgst: 0,
    grandTotal: null,
    cashSale: 0,
    cardSale: 0,
    upiSale: 0,
    serviceID: "",
    quantity: 1,
    rate: 0,
    hsnCode: "9997",
    discount: 0,
    total: 0,
    referenceBy: null,
    managerID: null,
    managerName: localStorage.getItem("managerName") ?? "",
    paymentDetail: [],
};

// ============================================================================
// Utility / Helper Functions
// ============================================================================

/**
 * Standardized error handler to display messages via Snackbar.
 * @param error - The exact error object thrown
 */
const showError = (error: unknown) => {
    const err = error as Error | { messageCode?: string; message?: string };
    const message = err?.message || (err as any)?.messageCode || "Something went wrong";

    openSnackbar({
        open: true,
        message,
        variant: "alert",
        severity: 'error',
        alert: { color: "error" },
    });
};

/**
 * Standardized success handler to display messages via Snackbar.
 * @param message - The success message string
 */
const showSuccess = (message: string) =>
    openSnackbar({
        open: true,
        message,
        variant: "alert",
        severity: 'primary',
        alert: { color: "success" }
    });

// ============================================================================
// Hook
// ============================================================================

/**
 * Custom hook to encapsulate the logic for Adding and Editing a Bill.
 * Contains form handling, dependent API calls, caching of dropdowns, 
 * GST calculations, and print logic all grouped efficiently.
 */
const UseAddEditBill = () => {
    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { user, isAdmin, startLoading, stopLoading } = useAuth();

    // ------------------------------------------------------------------------
    // State: Dropdown Lists
    // ------------------------------------------------------------------------

    const [paymentType, setPaymentType] = useState<any[]>([]);
    const [staffList, setStaffList] = useState<any[]>([]);
    const [roomList, setRoomList] = useState<any[]>([]);
    const [serviceList, setServiceList] = useState<any[]>([]);

    // Customer search state and debouncer
    const [customerList, setCustomerList] = useState<any[]>([]);
    const [isCustomerSearching, setIsCustomerSearching] = useState<boolean>(false);
    const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ------------------------------------------------------------------------
    // State: Gift Card
    // ------------------------------------------------------------------------

    const [giftCard, setGiftCard] = useState<any>(null);
    const [giftCardCode, setGiftCardCode] = useState<string>("");
    const [isGiftCardValidating, setIsGiftCardValidating] = useState<boolean>(false);

    // ------------------------------------------------------------------------
    // State: Modal Visibility Controls
    // ------------------------------------------------------------------------

    const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState<boolean>(false);
    const [isCustomerBillDataModalOpen, setIsCustomerBillDataModalOpen] = useState<boolean>(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
    const [isViewDetailOpen, setIsViewDetailOpen] = useState<boolean>(false);
    const [isAddCustomerOpen, setIsAddCustomerOpen] = useState<boolean>(false);

    // ------------------------------------------------------------------------
    // Form Configuration (react-hook-form)
    // ------------------------------------------------------------------------

    const { control, formState: { isSubmitting, dirtyFields, isDirty }, reset, watch, setValue, getValues, handleSubmit } =
        useForm<BillFormValue>({ defaultValues, mode: "onChange" });

    // ------------------------------------------------------------------------
    // Derived State: Memos
    // ------------------------------------------------------------------------

    /**
     * Extracts and parses GST percentages based on the authenticated user's company profile.
     */
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

    /**
     * Compiles branch details securely protecting data visibility of non-admins.
     */
    const branchDetail = useMemo(() => {
        if (!user) return undefined;
        if (!isAdmin) {
            return {
                phonNumber: user.phoneNumber,
                billTitle: user.billTitle,
                address: user.address,
                phoneNumber2: user.phoneNumber2,
                roleID: user.roleID,
            };
        }
        return { phonNumber: user.phoneNumber };
    }, [user, isAdmin]);

    /**
     * Dynamic title interpretation based on routing execution mode.
     */
    const title = useMemo(
        () => (mode === "edit" && id ? "Edit Bill" : "Add Bill"),
        [mode, id]
    );

    // ------------------------------------------------------------------------
    // Actions: Navigation and Modals
    // ------------------------------------------------------------------------

    const handleBack = useCallback(() => navigate("/bill"), [navigate]);

    const toggleAddCustomerModal = useCallback(() => setIsAddCustomerOpen(prev => !prev), []);
    const toggleViewDetailOpen = useCallback(() => setIsViewDetailOpen(prev => !prev), []);
    const togglePaymentModal = useCallback(() => setIsPaymentModalOpen(prev => !prev), []);
    const toggleCustomerBillDataModalOpen = useCallback(() => setIsCustomerBillDataModalOpen(prev => !prev), []);

    // ------------------------------------------------------------------------
    // Actions: Gift Card Validation
    // ------------------------------------------------------------------------

    /**
     * Validate a gift card code by calling the backend API.
     */
    const validateGiftCardHandler = useCallback(async (code: string) => {
        if (!code || code.trim().length === 0) {
            showError({ message: 'Please enter a gift card code' });
            return;
        }

        const selectedCustomerId = getValues('customerID');
        if (!selectedCustomerId) {
            showError({ message: 'Please select a customer first' });
            return;
        }

        try {
            setIsGiftCardValidating(true);
            const response: any = await validateGiftCard(code.trim());
            if (response.success && response.data) {
                const selectedCustomer = customerList.find((c: any) => c.id === selectedCustomerId);
                const customerPhone = selectedCustomer?.phoneNumber;

                if (response.data.recipientPhoneNumber && customerPhone !== response.data.recipientPhoneNumber) {
                    setGiftCard(null);
                    showError({ message: 'Customer phone number does not match the gift card recipient phone number' });
                    return;
                }

                setGiftCard(response.data);
                showSuccess(`Gift card validated: ₹${response.data.amount}`);
            } else {
                setGiftCard(null);
                showError({ message: response.message || 'Invalid gift card' });
            }
        } catch (error: unknown) {
            setGiftCard(null);
            showError(error);
        } finally {
            setIsGiftCardValidating(false);
        }
    }, [getValues, customerList]);

    /**
     * Clear the applied gift card.
     */
    const clearGiftCard = useCallback(() => {
        setGiftCard(null);
        setGiftCardCode("");
    }, []);

    /**
     * Calculate remaining payable amount after gift card deduction.
     */
    const giftCardDeduction = useMemo(() => {
        if (!giftCard) return { applied: false, giftCardAmount: 0, customerPayable: 0, remainingExpires: 0 };
        const grandTotal = parseFloat(getValues('grandTotal') || '0');
        const giftCardAmount = giftCard.amount;
        if (grandTotal > giftCardAmount) {
            return { applied: true, giftCardAmount, customerPayable: grandTotal - giftCardAmount, remainingExpires: 0 };
        } else {
            return { applied: true, giftCardAmount, customerPayable: 0, remainingExpires: giftCardAmount - grandTotal };
        }
    }, [giftCard, getValues]);

    // ------------------------------------------------------------------------
    // Actions: Customer Search (Debounced)
    // ------------------------------------------------------------------------

    /**
     * Look up customer efficiently based on a 10-digit mobile number,
     * delaying the API call slightly to reduce redundant request spam.
     */
    const searchCustomerViaPhone = useCallback((searchText: string = "") => {
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

        const digitsOnly = searchText.replace(/\D/g, "");

        // Prevent premature unoptimized queries until user achieves full number
        if (digitsOnly.length !== 10) {
            setCustomerList([]);
            return;
        }

        searchDebounceRef.current = setTimeout(async () => {
            try {
                startLoading();
                setIsCustomerSearching(true);
                const whereCondition = { searchText: digitsOnly, isActive: true, isDeleted: false };
                const { success, data }: any = await getCustomerDropdown(whereCondition);
                setCustomerList(success && Array.isArray(data) && data.length > 0 ? data : []);
            } catch (error: unknown) {
                showError(error);
            } finally {
                stopLoading();
                setIsCustomerSearching(false);
            }
        }, 300);
    }, [startLoading, stopLoading]);

    // ------------------------------------------------------------------------
    // Actions: Initial Setup / Dropdown Fetching
    // ------------------------------------------------------------------------

    /**
     * Retrieves all essential reference data concurrently for optimally fast setup.
     */
    const fetchDropDown = useCallback(async () => {
        const whereCondition = { isActive: true, isDeleted: false };
        const payload: any = listPayload(0, whereCondition, 1000);

        const isAdminRole = ADMIN_ROLES.includes(user?.px_role?.name?.toLowerCase() ?? "");

        // Ensure accurate scoping context mapped dynamically for room viewing list
        const roomWhereCondition = isAdminRole
            ? whereCondition
            : { ...whereCondition, createdBy: user?.id };

        // Execute API promises concurrently significantly improving UI block time
        const [staffRes, serviceRes, paymentRes, roomRes]: any[] = await Promise.all([
            getTherapistDropdown({ ...whereCondition, searchText: "THERAPIST" }),
            getServiceList({ ...payload, where: { ...whereCondition, isWebDisplay: false } }),
            getPaymentTypeList(payload),
            getRoomList(listPayload(0, roomWhereCondition, 100000)),
        ]);

        // Securely handle rendering guarantees preventing invalid lists crash
        setStaffList(staffRes?.success && staffRes.data ? staffRes.data : []);
        setServiceList(serviceRes?.success && serviceRes.data ? serviceRes.data?.rows : []);
        setPaymentType(paymentRes?.success && paymentRes.data ? paymentRes.data?.rows : []);
        setRoomList(roomRes?.success && roomRes.data ? roomRes.data?.rows : []);
    }, [user]);

    // ------------------------------------------------------------------------
    // Logic: GST & Total Calculations
    // ------------------------------------------------------------------------

    /**
     * Compute Grand Total safely accounting for optional GST factors conditionally.
     */
    const calculateGrandTotal = useCallback(() => {
        const total = getValues("total") ?? 0;
        if (user?.isShowGst) {
            const csgst = getValues("csgst") ?? 0;
            const sgst = getValues("sgst") ?? 0;
            setValue("grandTotal", (total + csgst + sgst).toFixed(2));
        } else {
            setValue("grandTotal", total.toFixed(2));
        }
    }, [user, getValues, setValue]);

    const calculateGst = useCallback((total: number) => {
        const { baseAmount, cgst, sgst } = calculateGSTDetails(total, gstValue.csgst + gstValue.sgst, true);
        setValue("total", baseAmount);
        setValue("csgst", cgst);
        setValue("sgst", sgst);
        calculateGrandTotal();
    }, [gstValue, setValue, calculateGrandTotal]);

    /**
     * Computes holistic item totals automatically adjusting for quantity, discounting variables, and GST factors.
     */
    const calculateTotal = useCallback(() => {
        const rate = getValues("rate") ?? 0;
        const discount = getValues("discount") ?? 0;
        const quantity = getValues("quantity") || 1;

        let total = quantity * rate;
        if (discount > 0) total -= (total * discount) / 100;

        if (user?.isShowGst) {
            calculateGst(total);
        } else {
            setValue("total", showTwoDecimal(total));
            calculateGrandTotal();
        }
    }, [user, getValues, setValue, calculateGst, calculateGrandTotal]);

    // ------------------------------------------------------------------------
    // Actions: Payment Detail
    // ------------------------------------------------------------------------

    const handlePaymentDetail = useCallback((paymentDetail: PaymentDetailItem[]) => {
        setValue("paymentDetail", paymentDetail);
        setIsPaymentModalOpen(false);
        setIsViewDetailOpen(true);
    }, [setValue]);

    // ------------------------------------------------------------------------
    // Workflow Logic: Transaction Handling & Post-Print
    // ------------------------------------------------------------------------

    /**
     * Manages direct printing dynamically rendering standard template document variables.
     */
    const print = useCallback((billData: Bill) => {
        try {
            const branchData: Branch = {
                title: user?.billTitle || "green health spa and saloon",
                address: user?.address || "NO, 52 HUDA COLONY, MANIKONDA HYDERABAD, TELANGANA - 500089",
                phone1: user?.phoneNumber || "",
                phone2: user?.phoneNumber2 || "",
                reviewUrl: user?.reviewUrl || "",
            };
            const printWindow = window.open("", "_blank", "popup=yes,menubar=no,toolbap=no");
            if (printWindow?.document) {
                printWindow.document.write(PrintBill(billData, branchData, true));
                printWindow.document.close();
                printWindow.onload = () => {
                    printWindow.print();
                    printWindow.close();
                };
            }
        } catch (error: unknown) {
            showError(error);
        }
    }, [user]);

    /**
     * Submission protocol formatting all final inputs and initiating persistence APIs accurately scaling array payloads recursively.
     */
    const handlePrint = useCallback(async (data: BillFormValue) => {
        try {
            const gstRate = gstValue.csgst + gstValue.sgst;
            if (mode !== "add") {
                const { baseAmount, cgst, sgst, totalAmount } = calculateGSTDetails(data.rate!, gstRate, true);
                const payload = {
                    staffID: data.staffID,
                    customerID: data.customerID,
                    roomID: data.roomID,
                    paymentID: data.paymentID,
                    cgst: cgst.toString(),
                    sgst: sgst.toString(),
                    cardNo: data.cardNo,
                    referenceBy: data.referenceBy,
                    grandTotal: totalAmount.toString(),
                    detail: [{
                        serviceID: data.serviceID,
                        rate: baseAmount,
                        discount: data.discount,
                        quantity: data.quantity,
                        total: baseAmount,
                        hsnCode: data.hsnCode,
                    }],
                    updatedBy: user?.id,
                }
                const { success, message }: any = await updateBill(payload, parseInt(id!));
                if (success) {
                    showSuccess(message);
                    navigate("/bill");
                } else {
                    showError(message);
                }
                return;
            }

            // ── Gift Card Redemption Flow ────────────────────────────────
            if (giftCard) {
                const redeemPayload: any = {
                    giftCardId: giftCard.id,
                    giftCardCode: giftCard.codeNumber,
                    userID: user?.id,
                    customerID: data.customerID,
                    staffID: data.staffID,
                    roomID: data.roomID,
                    serviceID: data.serviceID,
                    rate: data.rate,
                    discount: data.discount,
                    quantity: data.quantity,
                    hsnCode: data.hsnCode,
                    referenceBy: data.referenceBy,
                    managerName: localStorage.getItem("managerId"),
                };

                // Only include paymentDetail if customer needs to pay remaining
                if (giftCardDeduction.customerPayable > 0 && data.paymentDetail && data.paymentDetail.length > 0) {
                    redeemPayload.paymentDetail = data.paymentDetail.map((item: PaymentDetailItem) => ({
                        id: item.id,
                        name: item.name,
                        amount: item.amount,
                        cardNo: item.cardNo,
                    }));
                }

                const response: any = await redeemGiftCard(redeemPayload);

                if (response.success && response.data) {
                    showSuccess(response.message || "Gift card redeemed successfully");

                    // ── Construct Table Data for Printing (Applies to both partial and full gift card redemption) ──
                    const tableData: TableData[] = [];
                    const giftCardRedeemedAmount = response.data.redeemAmount || giftCardDeduction.giftCardAmount;

                    // 1. Gift Card Invoice Entry
                    tableData.push({
                        hsnCode: data.hsnCode,
                        item: serviceList.find((s: any) => s.id === data.serviceID)?.name || 'Service',
                        quantity: data.quantity,
                        total: giftCardRedeemedAmount,
                        subTotal: giftCardRedeemedAmount,
                        cgst: 0,
                        sgst: 0,
                        payment: 'Gift Card',
                        paymentId: giftCard.codeNumber,
                        cardNo: giftCard.codeNumber,
                        billNo: giftCard.codeNumber,
                        grandTotal: giftCardRedeemedAmount,
                    });

                    // 2. Customer Payable Invoice Entry (if partial cover / remaining balance paid)
                    if (response.data.scenario === 'partial' && response.data.customerBill) {
                        const bills = Array.isArray(response.data.customerBill)
                            ? response.data.customerBill
                            : [response.data.customerBill];

                        bills.forEach((bill: any) => {
                            const paymentItem = data.paymentDetail?.find((p: PaymentDetailItem) => p.id === bill.paymentID);
                            tableData.push({
                                hsnCode: data.hsnCode,
                                item: serviceList.find((s: any) => s.id === data.serviceID)?.name || 'Service',
                                quantity: data.quantity,
                                total: parseFloat(bill.grandTotal),
                                subTotal: parseFloat(bill.grandTotal),
                                cgst: 0,
                                sgst: 0,
                                payment: paymentItem?.name?.split(" ")[0] || 'Cash',
                                paymentId: bill.paymentID,
                                cardNo: bill.cardNo || '',
                                billNo: bill.billNo,
                                grandTotal: parseFloat(bill.grandTotal),
                            });
                        });
                    }

                    const serviceRateTotal = parseFloat(getValues('grandTotal') || '0');
                    const billData: Bill = {
                        date: new Date(),
                        customer: customerList.find((c: any) => c.id === data.customerID)?.name || getValues('Phone'),
                        staff: staffList.find((s: any) => s.value === data.staffID)?.label,
                        roomNo: roomList.find((r: any) => r.id === data.roomID)?.roomName,
                        cgstPercentage: gstValue.csgst,
                        sgstPercentage: gstValue.sgst,
                        tableData,
                        grandTotal: serviceRateTotal.toString(),
                        gstNo: user?.gstNo || "",
                        isShowGst: user?.isShowGst || false,
                    };

                    print(billData);

                    reset();
                    clearGiftCard();
                    setIsPaymentModalOpen(false);
                    setIsViewDetailOpen(false);
                } else {
                    showError({ message: response.message || "Failed to redeem gift card" });
                }
                return;
            }

            // ── Normal Bill Flow (no gift card) ─────────────────────────
            const payload = data.paymentDetail.map((item: PaymentDetailItem) => {
                const { baseAmount, cgst, sgst, totalAmount } = calculateGSTDetails(item.amount, gstRate, true);
                return {
                    userID: user?.id,
                    staffID: data.staffID,
                    customerID: data.customerID,
                    roomID: data.roomID,
                    paymentID: item.id,
                    cgst: cgst.toString(),
                    sgst: sgst.toString(),
                    cardNo: item.cardNo,
                    referenceBy: data.referenceBy,
                    managerName: localStorage.getItem("managerId"),
                    createdBy: user?.id,
                    grandTotal: totalAmount.toString(),
                    detail: [{
                        serviceID: data.serviceID,
                        rate: baseAmount,
                        discount: data.discount,
                        quantity: data.quantity,
                        total: baseAmount,
                        hsnCode: data.hsnCode,
                    }],
                };
            });

            const response: any = await createBulkBill(payload);

            if (response.success && response.data) {
                showSuccess("Bill created successfully");

                const tableData: TableData[] = data.paymentDetail.map((payment: PaymentDetailItem) => {
                    const { baseAmount, cgst, sgst, totalAmount } = calculateGSTDetails(payment.amount, gstRate, true);
                    const billNo = response.data.find((res: any) => res.paymentID === payment.id)?.billNo;
                    return {
                        hsnCode: data.hsnCode,
                        item: serviceList.find((s: any) => s.id === data.serviceID)?.name,
                        quantity: data.quantity,
                        total: baseAmount,
                        subTotal: baseAmount,
                        cgst,
                        sgst,
                        payment: payment.name.split(" ")[0],
                        paymentId: payment.id,
                        cardNo: payment.cardNo,
                        billNo,
                        grandTotal: totalAmount,
                    };
                });

                const billData: Bill = {
                    date: new Date(),
                    customer: customerList.find((c: any) => c.id === data.customerID)?.name,
                    staff: staffList.find((s: any) => s.value === data.staffID)?.label,
                    roomNo: roomList.find((r: any) => r.id === data.roomID)?.roomName,
                    cgstPercentage: gstValue.csgst,
                    sgstPercentage: gstValue.sgst,
                    tableData,
                    grandTotal: data.grandTotal || "",
                    gstNo: user?.gstNo || "",
                    isShowGst: user?.isShowGst || false,
                };

                print(billData);
                reset();
                setIsPaymentModalOpen(false);
                setIsViewDetailOpen(false);
            } else {
                openSnackbar({
                    open: true,
                    message: "Failed to create bill",
                    variant: "alert",
                    severity: 'error',
                    alert: { color: "error" }
                });
            }
        } catch (error: unknown) {
            showError(error);
        }
    }, [mode, user, gstValue, giftCard, giftCardDeduction, serviceList, customerList, staffList, roomList, print, reset, clearGiftCard]);

    // ------------------------------------------------------------------------
    // Initialization Details: Edit Mode Recovery
    // ------------------------------------------------------------------------

    /**
     * Securely queries API infrastructure manually populating form configurations from valid fetched instances selectively.
     */
    const fetchBill = useCallback(async () => {
        if (!id) return;
        try {
            startLoading();
            const response: any = await getBillById(parseInt(id));
            if (response.success && response.data) {
                const d = response.data;
                const detail = d.detail?.[0];

                setValue("date", moment(new Date(d.createdAt)).format("DD/MM/yyyy"));
                setValue("customerID", d.customerID);
                setValue("staffID", d.staffID);
                setValue("roomID", d.roomID);
                setValue("serviceID", detail?.serviceID);
                setValue("paymentID", d?.paymentID);
                setValue("rate", detail?.rate);
                setValue("discount", detail?.discount);
                setValue("quantity", detail?.quantity);
                setValue("total", detail?.total);
                setValue("csgst", d.cgst);
                setValue("sgst", d.sgst);
                setValue("grandTotal", d.grandTotal);
                setValue("paymentDetail", d.paymentDetail);
                setValue("Phone", d.px_customer?.name);
                setValue("cardNo", d.cardNo);
                setValue("referenceBy", d.referenceBy);
                setValue("managerID", Array.isArray(d.managerName) ? d.managerName.map((m: any) => m?.id) : d.managerName?.id)
                setValue("managerName",
                    Array.isArray(d.managerName)
                        ? d.managerName.map((m: any) => m?.nickName).join(",")
                        : d.managerName?.nickName
                );

                searchCustomerViaPhone(d.px_customer?.phoneNumber);
            } else {
                openSnackbar({
                    open: true,
                    message: response?.message || "Failed to fetch bill",
                    variant: "alert",
                    severity: 'error',
                    alert: { color: "error" }
                });
                handleBack();
            }
        } catch (error: unknown) {
            showError(error);
        } finally {
            stopLoading();
        }
    }, [id, setValue, searchCustomerViaPhone, handleBack, startLoading, stopLoading]);

    // ------------------------------------------------------------------------
    // Lifecycle Mapping
    // ------------------------------------------------------------------------

    useEffect(() => {
        fetchDropDown();

        return () => {
            if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        };
    }, [fetchDropDown]);

    useEffect(() => {
        if (mode === "edit" && id) fetchBill();
    }, [mode, id, fetchBill]);

    const isEdit = useMemo(() => mode === "edit", [mode]);

    const isCardSelected = useMemo((): boolean => {
        if (isEdit) {
            const selectedPayment = paymentType.find((item) => item.id.toString() === getValues('paymentID'));
            return selectedPayment?.name === 'Card';
        }
        return false;
    }, [watch('paymentID'), paymentType, isEdit]);

    // ------------------------------------------------------------------------
    // Exports
    // ------------------------------------------------------------------------

    return {
        // Data & Variables
        title,
        isEdit,
        gstValue,
        branchDetail,
        isSubmitting,
        isCardSelected,
        isCustomerSearching,

        // Gift Card
        giftCard,
        giftCardCode,
        isGiftCardValidating,
        giftCardDeduction,
        setGiftCardCode,
        validateGiftCardHandler,
        clearGiftCard,

        // List Collections
        paymentType,
        staffList,
        roomList,
        serviceList,
        customerList,

        // Toggles
        isSaveModalOpen,
        isCustomerModalOpen,
        isCustomerBillDataModalOpen,
        isPaymentModalOpen,
        isViewDetailOpen,
        isAddCustomerOpen,

        // Form Configurations
        control,
        setValue,
        getValues,
        handleSubmit,

        // Expose Internal Methods
        handleBack,
        handlePrint,
        calculateTotal,
        togglePaymentModal,
        handlePaymentDetail,
        toggleViewDetailOpen,
        searchCustomerViaPhone,
        toggleAddCustomerModal,
        toggleCustomerBillDataModalOpen
    };
};

export default UseAddEditBill;
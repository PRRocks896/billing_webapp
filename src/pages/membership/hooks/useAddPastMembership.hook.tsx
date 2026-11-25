import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { getCustomerDropdown } from "service/customer";
import { addPastMembership } from "service/membership";
import { getMembershipPlanViaPayload } from "service/membershipPlan";
import { getPaymentTypeList } from "service/payment-type";
import { getBranch } from "service/user";
import { getStaffList } from "service/staff";
import { listPayload } from "utils/helper";
import moment from "moment";

export type pastMembershipForm = {
    userID: number | null;
    customerID: number | null;
    createdAt: any;
    paymentID: number | null;
    membershipPlanID: number | null;
    managerName: string;
    registerPhoto: [],
    extraHours: string;
    minutes: string;
    validity: string;
    cardNo: string;
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

const UseAddPastMembership = () => {
    const { user, isAdmin, startLoading, stopLoading } = useAuth();

    const [isAddCustomerOpen, setIsAddCustomerOpen] = useState<boolean>(false);
    const [membershipPlanList, setMembershipPlanList] = useState<any[]>([]);
    const [customerList, setCustomerList] = useState<any[]>([]);
    const [managerList, setManagerList] = useState<any[]>([]);
    const [branchList, setBranchList] = useState<any[]>([]);
    const [paymentTypeList, setPaymentTypeList] = useState<any[]>([]);
    const [isCustomerSearching, setIsCustomerSearching] = useState<boolean>(false);
    const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const getDefaultValues = useCallback((): pastMembershipForm => ({
        // Branch users can only add for their own branch; admins pick one.
        userID: !isAdmin && user?.id ? user.id : null,
        customerID: null,
        createdAt: moment().format('YYYY-MM-DD'),
        paymentID: null,
        membershipPlanID: null,
        managerName: "",
        registerPhoto: [],
        extraHours: "0",
        minutes: "",
        validity: "6",
        cardNo: "",
    }), [isAdmin, user?.id]);

    const {
        setValue,
        control,
        handleSubmit,
        watch,
        getValues,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<pastMembershipForm>({
        defaultValues: getDefaultValues(),
    });

    // ── Modal toggles ──────────────────────────────────────────────────────
    const toggleAddCustomerModal = useCallback(() => setIsAddCustomerOpen(prev => !prev), []);

    // ── Customer search (debounced) ────────────────────────────────────────
    
    const searchCustomerViaPhone = useCallback((searchText: string = "") => {
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
            }
        }, 300);
    }, []);

    const resetForm = useCallback(() => {
        reset(getDefaultValues());
        setCustomerList([]);
    }, [reset, getDefaultValues]);

    const onSubmit = async (data: pastMembershipForm) => {
        try {
            startLoading();
            const extraHours = parseInt(data.extraHours);
            const minutes = parseInt(data.minutes);
            if (isNaN(minutes) || minutes < 0) {
                showError({ message: "Minutes must be a valid number" });
                return;
            }
            if (!isNaN(extraHours) && extraHours < 0) {
                showError({ message: "Extra hours cannot be negative" });
                return;
            }
            // cardNo / registerPhoto are not stored on the membership, so they are not sent.
            const payload = {
                userID: data.userID,
                customerID: data.customerID,
                membershipPlanID: data.membershipPlanID,
                paymentID: data.paymentID,
                managerName: data.managerName,
                validity: data.validity,
                createdAt: moment(data.createdAt).toDate(),
                extraHours: isNaN(extraHours) ? 0 : extraHours,
                minutes,
                createdBy: user?.id,
            };
            const { success, message }: any = await addPastMembership(payload);
            if (!success) {
                showError({ message });
                return;
            }
            showSuccess(message || "Membership created successfully");
            resetForm();
        } catch (error: any) {
            showError(error);
        } finally {
            stopLoading();
        }
    }

    const cancelHandler = () => {
        resetForm();
    }

    const isCardSelected = useMemo(() => {
        const selectedPaymentType = paymentTypeList.find((item) => item.id === getValues('paymentID'));
        return selectedPaymentType && selectedPaymentType.name.toLowerCase() === 'card' ? true : false;
        // eslint-disable-next-line
    }, [watch('paymentID'), getValues, paymentTypeList]);

    useEffect(() => {
        (async () => {
            try {
                startLoading();
                const whereCondition = {
                    isActive: true,
                    isDeleted: false,
                };
                const payload = listPayload(0, whereCondition, 100000);
                const [
                    paymentTypeResponse,
                    membershipPlanResponse,
                    branchResponse,
                    managerResponse
                ] = await Promise.all([
                    getPaymentTypeList(payload),
                    getMembershipPlanViaPayload(whereCondition),
                    getBranch(whereCondition),
                    getStaffList(listPayload(0, { ...whereCondition, searchText: "MANAGER" }, 100000))
                ]);
                setPaymentTypeList(paymentTypeResponse?.data?.rows ?? paymentTypeResponse?.data ?? []);
                setMembershipPlanList(membershipPlanResponse?.data?.rows ?? membershipPlanResponse?.data ?? []);
                setBranchList(branchResponse?.data?.rows ?? branchResponse?.data?.filter((data: any) => data?.px_role?.name?.toLowerCase() === 'branch') ?? []);
                setManagerList(managerResponse?.data?.rows ?? managerResponse?.data ?? []);
            } catch (error: any) {
                showError(error);
            } finally {
                stopLoading();
            }
        })();
    }, []);

    return {
        control,
        customerList,
        isCustomerSearching,
        membershipPlanList,
        searchCustomerViaPhone,
        managerList,
        branchList,
        paymentTypeList,
        isAddCustomerOpen,
        toggleAddCustomerModal,
        handleSubmit,
        onSubmit,
        reset: resetForm,
        isAdmin,
        cancelHandler,
        isCardSelected,
        isSubmitting,
    }
}

export default UseAddPastMembership;
import { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import moment from "moment";

import { getBranch } from "service/user";
import { getCompanyMapping } from "service/company";
import { getCityByFind, getCityMapping } from "service/city";
import { getBillListPayload, bulkVerifyBills } from "service/bill";
import useAuth from "hooks/useAuth";
import { openSnackbar } from "api/snackbar";

export interface BillVerifyItem {
    mappedId: number;
    billNo: string;
    cardNo: string;
    customerName: string;
    customerPhone: string;
    staffName: string;
    managerName: string;
    roomName: string;
    paymentType: string;
    paymentID: number;
    grandTotal: number;
    cgst: number;
    sgst: number;
    detail: any[];
    isVerify: boolean;
    statementReceiveAmount: number | null;
    createdAt: string;
}

export type FormData = {
    bills: BillVerifyItem[];
};

export type StatusFilter = 'all' | 'verified' | 'pending' | 'mismatch';

const defaultValues: FormData = {
    bills: []
};

const UseBillVerify = () => {
    const { pathname } = useLocation();
    const { user, isAdmin, isBranch, accessRights, startLoading, stopLoading } = useAuth();
    const rights = accessRights(pathname);

    // Filters state
    const [date, setDate] = useState<Date | null>(new Date());
    const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
    const [companyOptions, setCompanyOptions] = useState<any[]>([]);
    const [selectedCity, setSelectedCity] = useState<number | null>(null);
    const [cityOptions, setCityOptions] = useState<any[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
    const [branchOptions, setBranchOptions] = useState<any[]>([]);

    // UI & Table state
    const [hasLoaded, setHasLoaded] = useState<boolean>(false);
    const [isFetchingBills, setIsFetchingBills] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [paymentFilter, setPaymentFilter] = useState<string>('all');

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { isDirty }
    } = useForm<FormData>({
        defaultValues,
        mode: 'onChange'
    });

    const { fields } = useFieldArray({
        control,
        name: 'bills',
        keyName: '_fieldId'
    });

    const watchedBills = watch('bills') || [];

    const isBranchRole = (item: any) =>
        item?.px_role?.name?.toLowerCase() === 'branch';

    // ── Cascade Selection Fetchers ──────────────────────────────────────────

    const fetchCompany = useCallback(async () => {
        try {
            startLoading();
            const { success, data }: any = await getCompanyMapping({
                userID: user?.id,
                isActive: true,
                isDeleted: false
            });
            if (success && data && data.length > 0) {
                const companies = data.map((item: any) => item.px_company).filter(Boolean);
                setCompanyOptions(companies);
                if (companies.length === 1) {
                    setSelectedCompany(companies[0].id);
                }
            }
        } catch (err: any) {
            openSnackbar({
                open: true,
                message: err?.message || 'Failed to fetch companies.',
                variant: 'alert',
                severity: 'error',
                alert: { color: 'error' }
            });
        } finally {
            stopLoading();
        }
    }, [user?.id, startLoading, stopLoading]);

    const fetchCity = useCallback(async () => {
        if (!selectedCompany) {
            setCityOptions([]);
            setSelectedCity(null);
            return;
        }
        try {
            startLoading();
            setCityOptions([]);
            const selectedCompanyOption: any = companyOptions?.find((option: any) => option.id === selectedCompany);
            const { success, data }: any = await getCityByFind({
                stateID: selectedCompanyOption?.stateID,
                isActive: true,
                isDeleted: false
            });
            if (!success) {
                return;
            }
            const cityIds = data?.map((item: any) => item.id) ?? [];
            const cityMappingRes: any = await getCityMapping({
                isActive: true,
                isDeleted: false,
                userID: user?.id,
                cityID: { in: cityIds }
            });
            if (cityMappingRes.success && cityMappingRes.data) {
                const mappedCities = cityMappingRes.data.map((m: any) => m?.px_city).filter(Boolean);
                setCityOptions(mappedCities);
                if (mappedCities.length === 1) {
                    setSelectedCity(mappedCities[0].id);
                }
            }
        } catch (err: any) {
            openSnackbar({
                open: true,
                message: err?.message || 'Failed to fetch cities.',
                variant: 'alert',
                severity: 'error',
                alert: { color: 'error' }
            });
        } finally {
            stopLoading();
        }
    }, [selectedCompany, companyOptions, user?.id, startLoading, stopLoading]);

    const fetchBranchList = useCallback(async () => {
        if (!selectedCity && isAdmin) {
            setBranchOptions([]);
            setSelectedBranch(null);
            return;
        }
        try {
            startLoading();
            setBranchOptions([]);
            const { success, data: branches }: any = await getBranch({
                isActive: true,
                isDeleted: false,
                ...(selectedCompany ? { companyID: selectedCompany } : {}),
                ...(selectedCity ? { cityID: selectedCity } : {})
            });
            if (success && branches) {
                const filtered = branches.filter(isBranchRole);
                setBranchOptions(filtered);
                if (filtered.length === 1) {
                    setSelectedBranch(filtered[0].id);
                }
            }
        } catch (err: any) {
            openSnackbar({
                open: true,
                message: err?.message || 'Failed to fetch branches.',
                variant: 'alert',
                severity: 'error',
                alert: { color: 'error' }
            });
        } finally {
            stopLoading();
        }
    }, [selectedCity, selectedCompany, isAdmin, startLoading, stopLoading]);

    // ── Fetch Bills ──────────────────────────────────────────────────────────

    const fetchBill = async () => {
        const targetBranchId = selectedBranch || (!isAdmin ? user?.id : null);
        if (!targetBranchId) {
            openSnackbar({
                open: true,
                message: 'Please select a branch to load billing records.',
                variant: 'alert',
                severity: 'warning',
                alert: { color: 'warning' }
            });
            return;
        }
        if (!date) {
            openSnackbar({
                open: true,
                message: 'Please select a date.',
                variant: 'alert',
                severity: 'warning',
                alert: { color: 'warning' }
            });
            return;
        }

        try {
            setIsFetchingBills(true);
            startLoading();

            const payload: any = {
                isActive: true,
                isDeleted: false,
                createdAt: moment(date).format('YYYY-MM-DD'),
                userID: targetBranchId
            };

            const { success, data, message }: any = await getBillListPayload(payload);

            if (!success) {
                reset({ bills: [] });
                setHasLoaded(true);
                openSnackbar({
                    open: true,
                    message: message || 'No bills found for the selected date and branch.',
                    variant: 'alert',
                    severity: 'info',
                    alert: { color: 'info' }
                });
                return;
            }

            if (data && Array.isArray(data)) {
                // Filter out Cash payment bills completely (only verify bank/online/UPI/Card statements)
                const nonCashData = data.filter((item: any) => {
                    const paymentName = (item?.px_payment_type?.name || '').toLowerCase().trim();
                    return paymentName !== 'cash' && !paymentName.includes('cash');
                });

                const formattedBills: BillVerifyItem[] = nonCashData.map((item: any) => {
                    const grandTotalNum = parseFloat(item?.grandTotal || '0');
                    const isVerified = Boolean(item?.isVerify);
                    const statementAmount = item?.statementReceiveAmount !== null && item?.statementReceiveAmount !== undefined
                        ? Number(item.statementReceiveAmount)
                        : (isVerified ? grandTotalNum : null);

                    return {
                        mappedId: item?.id,
                        billNo: item?.billNo || '',
                        cardNo: item?.cardNo || '',
                        customerName: item?.px_customer?.name || 'Walk-in Customer',
                        customerPhone: item?.px_customer?.phoneNumber || 'N/A',
                        managerName: item?.managerData?.map((item: any) => item.nickName).join(','),
                        staffName: item?.px_staff?.nickName || 'N/A',
                        roomName: item?.px_room?.roomName || item?.roomNo || 'N/A',
                        paymentType: item?.px_payment_type?.name || 'Unknown',
                        paymentID: item?.paymentID,
                        grandTotal: grandTotalNum,
                        cgst: parseFloat(item?.cgst || '0'),
                        sgst: parseFloat(item?.sgst || '0'),
                        detail: item?.detail || [],
                        isVerify: isVerified,
                        statementReceiveAmount: statementAmount,
                        createdAt: moment(item?.createdAt).format('DD-MMM-YYYY hh:mm A')
                    };
                });

                reset({ bills: formattedBills });
                setHasLoaded(true);
                openSnackbar({
                    open: true,
                    message: `Loaded ${formattedBills.length} online/statement billing records successfully.`,
                    variant: 'alert',
                    severity: 'success',
                    alert: { color: 'success' }
                });
            } else {
                reset({ bills: [] });
                setHasLoaded(true);
            }
        } catch (err: any) {
            openSnackbar({
                open: true,
                message: err?.message || 'Failed to fetch bills.',
                variant: 'alert',
                severity: 'error',
                alert: { color: 'error' }
            });
        } finally {
            setIsFetchingBills(false);
            stopLoading();
        }
    };

    // ── Batch & Helper Actions ──────────────────────────────────────────────

    const handleToggleVerify = (index: number, verified: boolean) => {
        setValue(`bills.${index}.isVerify`, verified, { shouldDirty: true, shouldValidate: true });
        if (verified) {
            const currentStatement = watchedBills[index]?.statementReceiveAmount;
            const grandTotal = watchedBills[index]?.grandTotal;
            if (currentStatement === null || currentStatement === undefined || currentStatement === 0) {
                setValue(`bills.${index}.statementReceiveAmount`, grandTotal, { shouldDirty: true, shouldValidate: true });
            }
        }
    };

    const handleStatementAmountChange = (index: number, value: string | number | null) => {
        const parsed = value === '' || value === null ? null : Number(value);
        const grandTotal = Number(watchedBills[index]?.grandTotal ?? 0);

        setValue(`bills.${index}.statementReceiveAmount`, parsed, { shouldDirty: true, shouldValidate: true });

        // If statement amount matches grandTotal, mark as verified; otherwise mark isVerify as false
        if (parsed !== null && parsed === grandTotal) {
            setValue(`bills.${index}.isVerify`, true, { shouldDirty: true, shouldValidate: true });
        } else {
            setValue(`bills.${index}.isVerify`, false, { shouldDirty: true, shouldValidate: true });
        }
    };

    const handleQuickMatch = (index: number) => {
        const grandTotal = watchedBills[index]?.grandTotal || 0;
        setValue(`bills.${index}.statementReceiveAmount`, grandTotal, { shouldDirty: true, shouldValidate: true });
        setValue(`bills.${index}.isVerify`, true, { shouldDirty: true, shouldValidate: true });
    };

    const handleVerifyAll = (verified: boolean) => {
        watchedBills.forEach((bill, index) => {
            setValue(`bills.${index}.isVerify`, verified, { shouldDirty: true });
            if (verified) {
                if (bill.statementReceiveAmount === null || bill.statementReceiveAmount === 0) {
                    setValue(`bills.${index}.statementReceiveAmount`, bill.grandTotal, { shouldDirty: true });
                }
            }
        });
        openSnackbar({
            open: true,
            message: verified ? 'Marked all bills as verified.' : 'Marked all bills as unverified.',
            variant: 'alert',
            severity: 'info',
            alert: { color: 'info' }
        });
    };

    const handleAutoFillAllStatement = () => {
        watchedBills.forEach((bill, index) => {
            setValue(`bills.${index}.statementReceiveAmount`, bill.grandTotal, { shouldDirty: true });
            setValue(`bills.${index}.isVerify`, true, { shouldDirty: true });
        });
        openSnackbar({
            open: true,
            message: 'Auto-matched all statement receive amounts to billed totals.',
            variant: 'alert',
            severity: 'success',
            alert: { color: 'success' }
        });
    };

    // ── Form Submission ──────────────────────────────────────────────────────

    const onSubmit = async (formData: FormData) => {
        if (!formData.bills || formData.bills.length === 0) {
            openSnackbar({
                open: true,
                message: 'No bills available to save.',
                variant: 'alert',
                severity: 'warning',
                alert: { color: 'warning' }
            });
            return;
        }

        try {
            setIsSaving(true);
            startLoading();

            const payload = {
                bills: formData.bills.map((item) => ({
                    id: item.mappedId,
                    isVerify: Boolean(item.isVerify),
                    statementReceiveAmount: item.statementReceiveAmount !== null && item.statementReceiveAmount !== undefined
                        ? Number(item.statementReceiveAmount)
                        : null
                })),
                updatedBy: user?.id
            };

            const response: any = await bulkVerifyBills(payload);

            if (response && response.success) {
                openSnackbar({
                    open: true,
                    message: response.message || 'All bill verifications updated successfully!',
                    variant: 'alert',
                    severity: 'success',
                    alert: { color: 'success' }
                });
                reset({ bills: formData.bills });
            } else {
                openSnackbar({
                    open: true,
                    message: response?.message || 'Failed to save bill verifications.',
                    variant: 'alert',
                    severity: 'error',
                    alert: { color: 'error' }
                });
            }
        } catch (err: any) {
            openSnackbar({
                open: true,
                message: err?.message || 'Failed to update bills.',
                variant: 'alert',
                severity: 'error',
                alert: { color: 'error' }
            });
        } finally {
            setIsSaving(false);
            stopLoading();
        }
    };

    // ── Real-time Statistics & Filtered Views ───────────────────────────────

    const stats = useMemo(() => {
        let totalCount = watchedBills.length;
        let verifiedCount = 0;
        let pendingCount = 0;
        let mismatchCount = 0;
        let totalGrandTotal = 0;
        let totalStatementAmount = 0;
        const paymentMap = new Map<string, { count: number; total: number; verifiedTotal: number }>();

        watchedBills.forEach((bill) => {
            const grandTotal = Number(bill.grandTotal || 0);
            const statementAmount = bill.statementReceiveAmount !== null ? Number(bill.statementReceiveAmount) : 0;
            const isVerified = Boolean(bill.isVerify);

            totalGrandTotal += grandTotal;
            if (isVerified) {
                verifiedCount += 1;
                totalStatementAmount += statementAmount;
            } else {
                pendingCount += 1;
            }

            if (isVerified && statementAmount !== grandTotal) {
                mismatchCount += 1;
            }

            const pType = bill.paymentType || 'Other';
            if (!paymentMap.has(pType)) {
                paymentMap.set(pType, { count: 0, total: 0, verifiedTotal: 0 });
            }
            const pEntry = paymentMap.get(pType)!;
            pEntry.count += 1;
            pEntry.total += grandTotal;
            if (isVerified) {
                pEntry.verifiedTotal += statementAmount;
            }
        });

        const totalVariance = totalStatementAmount - totalGrandTotal;
        const paymentBreakdown = Array.from(paymentMap.entries()).map(([name, data]) => ({
            name,
            ...data
        }));

        return {
            totalCount,
            verifiedCount,
            pendingCount,
            mismatchCount,
            totalGrandTotal,
            totalStatementAmount,
            totalVariance,
            paymentBreakdown,
            verifiedPercentage: totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0
        };
    }, [watchedBills]);

    // Filtered bills for the table view
    const filteredBillsWithIndex = useMemo(() => {
        return watchedBills
            .map((bill, index) => ({ bill, index }))
            .filter(({ bill }) => {
                // Status Filter
                if (statusFilter === 'verified' && !bill.isVerify) return false;
                if (statusFilter === 'pending' && bill.isVerify) return false;
                if (statusFilter === 'mismatch' && (!bill.isVerify || bill.statementReceiveAmount === bill.grandTotal)) return false;

                // Payment Type Filter
                if (paymentFilter !== 'all' && bill.paymentType?.toLowerCase() !== paymentFilter.toLowerCase()) return false;

                // Search Filter
                if (searchText.trim().length > 0) {
                    const q = searchText.toLowerCase();
                    const matchBillNo = bill.billNo?.toLowerCase().includes(q);
                    const matchCustomer = bill.customerName?.toLowerCase().includes(q);
                    const matchPhone = bill.customerPhone?.toLowerCase().includes(q);
                    const matchStaff = bill.staffName?.toLowerCase().includes(q);
                    const matchPayment = bill.paymentType?.toLowerCase().includes(q);
                    const matchRoom = bill.roomName?.toLowerCase().includes(q);
                    return matchBillNo || matchCustomer || matchPhone || matchStaff || matchPayment || matchRoom;
                }

                return true;
            });
    }, [watchedBills, statusFilter, paymentFilter, searchText]);

    // Unique payment types for filter dropdown
    const availablePaymentTypes = useMemo(() => {
        const types = new Set<string>();
        watchedBills.forEach((b) => {
            if (b.paymentType) types.add(b.paymentType);
        });
        return Array.from(types);
    }, [watchedBills]);

    // ── Cascade Effects ──────────────────────────────────────────────────────

    useEffect(() => {
        if (selectedCity) {
            fetchBranchList();
        }
    }, [selectedCity, fetchBranchList]);

    useEffect(() => {
        if (selectedCompany) {
            fetchCity();
        }
    }, [selectedCompany, fetchCity]);

    useEffect(() => {
        if (isAdmin || user?.companyID) {
            fetchCompany();
        } else if (!isAdmin && user?.id) {
            setSelectedBranch(user.id);
        }
    }, [isAdmin, user, fetchCompany]);

    return {
        // Form & Table
        control,
        fields,
        watchedBills,
        filteredBillsWithIndex,
        isDirty,
        isSaving,
        isFetchingBills,
        hasLoaded,
        rights,

        // Filters
        date,
        selectedCompany,
        companyOptions,
        selectedCity,
        cityOptions,
        selectedBranch,
        branchOptions,
        isAdmin,
        isBranch,

        // Search & Table Filters
        searchText,
        statusFilter,
        paymentFilter,
        availablePaymentTypes,
        stats,

        // Handlers
        setDate,
        setSelectedCompany,
        setSelectedCity,
        setSelectedBranch,
        setSearchText,
        setStatusFilter,
        setPaymentFilter,
        fetchBill,
        onSubmit,
        handleSubmit,
        handleToggleVerify,
        handleStatementAmountChange,
        handleQuickMatch,
        handleVerifyAll,
        handleAutoFillAllStatement
    };
};

export default UseBillVerify;
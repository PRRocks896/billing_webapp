import { useLocation } from "react-router-dom";
import useAuth from "hooks/useAuth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getCompanyMapping } from "service/company";
import { openSnackbar } from "api/snackbar";
import { getCityByFind, getCityMapping } from "service/city";
import { getBranch } from "service/user";
import { ROWS } from "utils/constant";
import moment from "moment";
import { getBillList } from "service/bill";

export const getPaymentColor = (paymentType: string = "") => {
    const p = paymentType.toLowerCase();
    if (p.includes("cash")) return { bg: "#E8F5E9", text: "#2E7D32", border: "#A5D6A7" };
    if (p.includes("upi") || p.includes("gpay") || p.includes("paytm") || p.includes("phonepe")) return { bg: "#EDE7F6", text: "#673AB7", border: "#D1C4E9" };
    if (p.includes("card") || p.includes("pos")) return { bg: "#E3F2FD", text: "#1976D2", border: "#BBDEFB" };
    return { bg: "#FFF3E0", text: "#E65100", border: "#FFE0B2" };
};

export interface VerificationStats {
    totalCount: number;
    verifiedCount: number;
    pendingCount: number;
    mismatchCount: number;
    totalGrandTotal: number;
    totalStatementAmount: number;
    totalCgst: number;
    totalSgst: number;
    totalVariance: number;
    verifiedPercentage: number;
    paymentBreakdown: Array<{ name: string; total: number; count: number }>;
}

const initialStats: VerificationStats = {
    totalCount: 0,
    verifiedCount: 0,
    pendingCount: 0,
    mismatchCount: 0,
    totalGrandTotal: 0,
    totalStatementAmount: 0,
    totalCgst: 0,
    totalSgst: 0,
    totalVariance: 0,
    verifiedPercentage: 0,
    paymentBreakdown: []
};

const UseBillVerifyDetail = () => {
    const { pathname } = useLocation();
    const { user, isAdmin, isBranch, accessRights, accessSectionRights, startLoading, stopLoading } = useAuth();
    const rights = accessRights(pathname);

    const sectionRights = useMemo(() => {
        const result: any = {};
        ['export_section', 'admin_section'].forEach((section) => {
            result[section] = accessSectionRights(section);
        });
        return result;
    }, [user, accessSectionRights]);

    // List & Pagination State
    const [list, setList] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [rows, setRows] = useState<number>(ROWS);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasLoaded, setHasLoaded] = useState<boolean>(false);

    // Filter States
    const [fromDate, setFromDate] = useState<Date | null>(new Date());
    const [toDate, setToDate] = useState<Date | null>(new Date());
    const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
    const [companyOptions, setCompanyOptions] = useState<any[]>([]);
    const [selectedCity, setSelectedCity] = useState<number | null>(null);
    const [cityOptions, setCityOptions] = useState<any[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
    const [branchOptions, setBranchOptions] = useState<any[]>([]);
    const [selectedBranchForExport, setSelectedBranchForExport] = useState<any[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<boolean | null>(null);
    const [excludeCash, setExcludeCash] = useState<boolean>(true);
    const [searchText, setSearchText] = useState<string>('');
    const [paymentFilter, setPaymentFilter] = useState<string>('all');

    // Aggregate Stats
    const [stats, setStats] = useState<VerificationStats>(initialStats);

    // Detailed Inspection Modal State
    const [selectedBillForModal, setSelectedBillForModal] = useState<any | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

    const statusOptions = useMemo(() => [
        { label: 'All Statuses', value: null },
        { label: 'Verified Only', value: true },
        { label: 'Pending Only', value: false }
    ], []);

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

    // ── Main Data Fetcher ───────────────────────────────────────────────────

    const fetch = useCallback(async (targetPage = page, targetRows = rows) => {
        try {
            setIsLoading(true);
            startLoading();

            const payload: any = {
                where: {
                    isDeleted: false,
                    excludeCash: excludeCash
                },
                pagination: {
                    page: targetPage + 1,
                    rows: targetRows,
                    sortBy: 'createdAt',
                    descending: false
                }
            };

            if (selectedBranch) {
                payload.where.userID = selectedBranch;
            } else if (!isAdmin && user?.id) {
                payload.where.userID = user.id;
            }

            if (selectedStatus !== null) {
                payload.where.isVerify = selectedStatus;
            }

            if (searchText.trim()) {
                payload.where.searchText = searchText.trim();
            }

            if (fromDate && toDate) {
                payload.where.startDate = moment(fromDate).format('YYYY-MM-DD');
                payload.where.endDate = moment(toDate).format('YYYY-MM-DD');
            }

            const { success, data, message }: any = await getBillList(payload);

            if (!success) {
                setList([]);
                setTotalCount(0);
                setStats(initialStats);
                setHasLoaded(true);
                openSnackbar({
                    open: true,
                    message: message || 'Failed to fetch bill list.',
                    variant: 'alert',
                    severity: 'error',
                    alert: { color: 'error' }
                });
                return;
            }

            const rawRows = data?.rows || [];
            setList(rawRows);
            setTotalCount(data?.count || 0);
            setHasLoaded(true);

            if (data?.stats) {
                setStats(data.stats);
            }
        } catch (error: any) {
            setList([]);
            setTotalCount(0);
            setStats(initialStats);
            setHasLoaded(true);
            openSnackbar({
                open: true,
                message: error?.message || error?.messageCode || (error as Error).message || 'Something went wrong while loading bills',
                variant: 'alert',
                severity: 'error',
                alert: {
                    color: 'error'
                }
            });
        } finally {
            setIsLoading(false);
            stopLoading();
        }
    }, [page, rows, fromDate, toDate, selectedBranch, selectedStatus, excludeCash, searchText, isAdmin, user?.id, startLoading, stopLoading]);

    // ── Quick Date Range Preset Selector ───────────────────────────────────

    const setDateRangePreset = (preset: 'today' | 'yesterday' | 'this_week' | 'this_month' | 'last_month') => {
        const today = new Date();
        switch (preset) {
            case 'today':
                setFromDate(today);
                setToDate(today);
                break;
            case 'yesterday': {
                const yest = moment().subtract(1, 'days').toDate();
                setFromDate(yest);
                setToDate(yest);
                break;
            }
            case 'this_week': {
                const startOfWeek = moment().startOf('isoWeek').toDate();
                setFromDate(startOfWeek);
                setToDate(today);
                break;
            }
            case 'this_month': {
                const startOfMonth = moment().startOf('month').toDate();
                setFromDate(startOfMonth);
                setToDate(today);
                break;
            }
            case 'last_month': {
                const startOfLastMonth = moment().subtract(1, 'month').startOf('month').toDate();
                const endOfLastMonth = moment().subtract(1, 'month').endOf('month').toDate();
                setFromDate(startOfLastMonth);
                setToDate(endOfLastMonth);
                break;
            }
        }
    };

    // ── Detail Modal Handlers ───────────────────────────────────────────────

    const handleOpenDetailModal = (bill: any) => {
        setSelectedBillForModal(bill);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedBillForModal(null);
    };

    // ── CSV Export Helper ───────────────────────────────────────────────────

    const handleExportCSV = () => {
        if (!list || list.length === 0) {
            openSnackbar({
                open: true,
                message: 'No billing records to export.',
                variant: 'alert',
                severity: 'warning',
                alert: { color: 'warning' }
            });
            return;
        }

        const headers = [
            'Bill No',
            'Date & Time',
            'Branch',
            'Customer Name',
            'Customer Phone',
            'Manager',
            'Staff',
            'Room',
            'Payment Mode',
            'Card No',
            'Billed Amount',
            'CGST',
            'SGST',
            'Statement Received',
            'Variance (Diff)',
            'Verification Status'
        ];

        const rowsData = list.map((item) => {
            const stVal = item.statementReceiveAmount !== null && item.statementReceiveAmount !== undefined
                ? Number(item.statementReceiveAmount)
                : '';
            const diff = stVal !== '' ? Number(stVal) - Number(item.grandTotal || 0) : '';
            const managerStr = Array.isArray(item.managerName)
                ? item.managerName.map((m: any) => m.nickName || m.name).join('; ')
                : (item.managerName || '');

            return [
                `"${item.billNo || ''}"`,
                `"${moment(item.createdAt).format('YYYY-MM-DD HH:mm')}"`,
                `"${item.px_user?.branchName || item.px_user?.lastName || ''}"`,
                `"${item.px_customer?.name || ''}"`,
                `"${item.px_customer?.phoneNumber || ''}"`,
                `"${managerStr}"`,
                `"${item.px_staff?.nickName || item.px_staff?.name || ''}"`,
                `"${item.px_room?.roomName || ''}"`,
                `"${item.px_payment_type?.name || ''}"`,
                `"${item.cardNo || ''}"`,
                item.grandTotal || 0,
                item.cgst || 0,
                item.sgst || 0,
                stVal,
                diff,
                item.isVerify ? 'Verified' : 'Pending'
            ].join(',');
        });

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rowsData].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `bill_reconciliation_report_${moment().format('YYYYMMDD_HHmm')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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
        if (isAdmin && user?.companyID) {
            fetchCompany();
        } else if (!isAdmin && user?.id) {
            setSelectedBranch(user.id);
        }
    }, [isAdmin, user, fetchCompany]);

    useEffect(() => {
        fetch(page, rows);
    }, [page, rows]);

    return {
        // Table Data & Pagination
        list,
        page,
        rows,
        totalCount,
        isLoading,
        hasLoaded,
        sectionRights,

        // Filters State
        toDate,
        fromDate,
        selectedCompany,
        companyOptions,
        statusOptions,
        selectedStatus,
        selectedCity,
        cityOptions,
        selectedBranch,
        branchOptions,
        selectedBranchForExport,
        excludeCash,
        searchText,
        paymentFilter,

        // Aggregated Stats
        stats,

        // Modal State
        selectedBillForModal,
        isDetailModalOpen,

        // Auth & Rights
        isAdmin,
        isBranch,
        rights,

        // Actions & Handlers
        fetch,
        setPage,
        setRows,
        setToDate,
        setFromDate,
        setSelectedCity,
        setSelectedStatus,
        setSelectedBranch,
        setSelectedCompany,
        setSelectedBranchForExport,
        setExcludeCash,
        setSearchText,
        setPaymentFilter,
        setDateRangePreset,
        handleOpenDetailModal,
        handleCloseDetailModal,
        handleExportCSV
    };
};

export default UseBillVerifyDetail;
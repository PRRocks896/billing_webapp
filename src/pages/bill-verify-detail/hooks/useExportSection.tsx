import { useCallback, useEffect, useMemo, useState } from "react";
import useAuth from "hooks/useAuth";
import { getCompanyMapping } from "service/company";
import { getBranch } from "service/user";
import { getPaymentTypeList } from "service/payment-type";
import { openSnackbar } from "api/snackbar";
import moment from "moment";
import { listPayload } from "utils/helper";
import { getBillDetailVerifyStatementReport } from "service/report";

const useExportSection = () => {
    const { user, isAdmin, isBranch, accessSectionRights, startLoading, stopLoading } = useAuth();

    const exportSectionRights = useMemo(() => {
        return accessSectionRights('export_section') || { view: false, download: false };
    }, [user, accessSectionRights]);

    // Date filters - defaulting from start of month to today as seen in standard export flows
    const [fromDate, setFromDate] = useState<Date | null>(moment().startOf('month').toDate());
    const [toDate, setToDate] = useState<Date | null>(new Date());

    // Selection filters
    const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
    const [companyOptions, setCompanyOptions] = useState<any[]>([]);

    const [selectedBranch, setSelectedBranch] = useState<any[]>([]);
    const [branchOptions, setBranchOptions] = useState<any[]>([]);

    const [selectedPayment, setSelectedPayment] = useState<any[]>([]);
    const [paymentOptions, setPaymentOptions] = useState<any[]>([]);

    const [selectedStatus, setSelectedStatus] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const statusOptions = useMemo(() => [
        { label: 'All Statuses', value: null },
        { label: 'Verified Only', value: true },
        { label: 'Pending Only', value: false }
    ], []);

    const isBranchRole = (item: any) =>
        item?.px_role?.name?.toLowerCase() === 'branch';

    // ── Fetch Companies ─────────────────────────────────────────────────────

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
            const paymentRes: any = await getPaymentTypeList(listPayload(0, { isActive: true, isDeleted: false }, 1000));
            if (!paymentRes.success) {
                openSnackbar({
                    open: true,
                    message: paymentRes.message,
                    variant: 'alert',
                    severity: 'error',
                    alert: { color: 'error' }
                });
                return;
            }
            if (paymentRes.data && paymentRes.data.rows) {
                setPaymentOptions(paymentRes.data?.rows?.filter((item: any) => item.name.toLowerCase() !== 'cash'));
            }
        } catch (err: any) {
            openSnackbar({
                open: true,
                message: err?.message || 'Failed to fetch companies for export.',
                variant: 'alert',
                severity: 'error',
                alert: { color: 'error' }
            });
        } finally {
            stopLoading();
        }
    }, [user?.id, startLoading, stopLoading]);

    // ── Fetch Branches ──────────────────────────────────────────────────────

    const fetchBranchList = useCallback(async () => {
        try {
            startLoading();
            setBranchOptions([]);
            const { success, data: branches }: any = await getBranch({
                isActive: true,
                isDeleted: false,
                ...(selectedCompany ? { companyID: selectedCompany } : {})
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
                message: err?.message || 'Failed to fetch branches for export.',
                variant: 'alert',
                severity: 'error',
                alert: { color: 'error' }
            });
        } finally {
            stopLoading();
        }
    }, [selectedCompany, startLoading, stopLoading]);

    // ── Effects ─────────────────────────────────────────────────────────────

    useEffect(() => {
        if (isAdmin && user?.companyID) {
            fetchCompany();
        } else if (!isAdmin && user?.id) {
            setSelectedBranch([user.id]);
        }
    }, [isAdmin, user, fetchCompany]);

    useEffect(() => {
        if (selectedCompany) {
            fetchBranchList();
        }
    }, [selectedCompany, fetchBranchList]);

    // ── Export Action Handler ───────────────────────────────────────────────

    const handleExport = async () => {
        try {
            setIsLoading(true);
            startLoading();

            let exportPayload: any = {
                startDate: fromDate ? moment(fromDate).format('YYYY-MM-DD') : null,
                endDate: toDate ? moment(toDate).format('YYYY-MM-DD') : null,
                companyID: selectedCompany,
                userID: selectedBranch,
                paymentID: selectedPayment
            };

            if (selectedStatus !== null) {
                exportPayload = { ...exportPayload, isVerify: selectedStatus }
            }
            await getBillDetailVerifyStatementReport(exportPayload, `bill-verification-detail-${exportPayload.startDate}-${exportPayload.endDate}.xlsx`)
            // User can hook in their own export API here

            // openSnackbar({
            //     open: true,
            //     message: 'Export initiated successfully.',
            //     variant: 'alert',
            //     severity: 'success',
            //     alert: { color: 'success' }
            // });
        } catch (error: any) {
            openSnackbar({
                open: true,
                message: error?.message || 'Failed to export bill verification records.',
                variant: 'alert',
                severity: 'error',
                alert: { color: 'error' }
            });
        } finally {
            setIsLoading(false);
            stopLoading();
        }
    };

    return {
        // Date filters
        fromDate,
        setFromDate,
        toDate,
        setToDate,

        selectedPayment,
        setSelectedPayment,
        paymentOptions,

        // Company filters
        selectedCompany,
        setSelectedCompany,
        companyOptions,

        // Branch filters
        selectedBranch,
        setSelectedBranch,
        branchOptions,

        // Status filters
        selectedStatus,
        setSelectedStatus,
        statusOptions,

        // State & Actions
        isLoading,
        exportSectionRights,
        isAdmin,
        isBranch,
        handleExport
    };
};

export default useExportSection;

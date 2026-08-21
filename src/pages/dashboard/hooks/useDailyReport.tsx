
import { useEffect, useMemo, useState } from "react";
import moment from "moment";

import useAuth from "hooks/useAuth";
import { getDailyDetailReport } from "service/dailyReport";
import { getBranch } from "service/user";
import { getCityMapping } from "service/city";
import { getCityByFind } from "service/city";
import { getCompanyById } from "service/company";
import { openSnackbar } from "api/snackbar";

const UseDailyReport = (companyID?: number | null) => {
    const { user, isAdmin, startLoading, stopLoading } = useAuth();
    const [isShowCustom, setIsShowCustom] = useState<boolean>(false);
    const [slot, setSlot] = useState<number>(0);

    const [fromDate, setFromDate] = useState<Date>(moment().toDate());
    const [toDate, setToDate] = useState<Date>(moment().toDate());
    const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
    const [branchOptions, setBranchOptions] = useState<any[]>([]);
    const [selectedCity, setSelectedCity] = useState<any>(null);
    const [cityOptions, setCityOptions] = useState<any[]>([]);
    const [dailyReportList, setDailyReportList] = useState<any[]>([]);
    const [selectedExpenses, setSelectedExpenses] = useState<{ description: string; amount: number; }[]>([]);
    const [showExpenseDetail, setShowExpenseDetail] = useState<boolean>(false);

    const toggleIsShowCustom = () => setIsShowCustom(!isShowCustom);
    const toggleExpenseDetail = () => setShowExpenseDetail(!showExpenseDetail);

    // ── Helpers ──────────────────────────────────────────────────────────────────
    const showError = (msg: string) =>
        openSnackbar({ open: true, message: msg, variant: 'alert', severity: 'error', alert: { color: 'error' } });

    const fetchDailyReport = async () => {
        try {
            startLoading();
            setDailyReportList([]);
            const payload: any = {
                branchID: selectedBranch,
                fromDate: moment(fromDate).format("YYYY-MM-DD"),
                toDate: moment(toDate).format("YYYY-MM-DD")
            }
            const { success, message, data }: any = await getDailyDetailReport(payload);
            if (!success) {
                showError(message);
                return;
            }
            setDailyReportList(data || []);
        } catch (error: any) {
            showError(error?.message || error?.messageCode || (error as Error).message || 'Something went wrong')
        } finally {
            stopLoading();
        }
    }

    useEffect(() => {
        if (!isShowCustom && (companyID || isAdmin) && selectedBranch) {
            fetchDailyReport();
        } else {
            setDailyReportList([]);
        }
    }, [companyID, fromDate, toDate, isAdmin, selectedBranch]);

    useEffect(() => {
        if (slot === 3) {
            setIsShowCustom(true);
            return;
        }
        setIsShowCustom(false);
        if (slot === 0) {
            setFromDate(moment().toDate());
            setToDate(moment().toDate());
        } else if (slot === 1) {
            setFromDate(moment().startOf('month').toDate());
            setToDate(moment().endOf('month').toDate());
        } else if (slot === 2) {
            setFromDate(moment().subtract(1, 'months').startOf('month').toDate());
            setToDate(moment().subtract(1, 'months').endOf('month').toDate());
        }
    }, [slot]);

    /** Throws if the API response indicates failure — keeps the happy path flat. */
    const assertSuccess = (response: any, fallback = 'Something went wrong') => {
        if (!response?.success) throw new Error(response?.message || fallback);
        return response;
    };

    const isBranchRole = (item: any) =>
        item?.px_role?.name?.toLowerCase() === 'branch';

    // ── Fetch city + branch options ─────────────────────────────────────────────
    useEffect(() => {
        // Non-admin path: chain company → cities-by-state → city-mapping → branches
        const fetchForNonAdmin = async () => {
            if (!companyID || !user?.id) return;

            setBranchOptions([]);
            setCityOptions([]);

            const { data: company } = assertSuccess(await getCompanyById(companyID));

            const { data: cities } = assertSuccess(await getCityByFind({
                isActive: true,
                isDeleted: false,
                stateID: company.stateID,
            }));

            const cityIds = cities?.map((c: any) => c.id) ?? [];

            const { data: cityMappings } = assertSuccess(await getCityMapping({
                isActive: true,
                isDeleted: false,
                userID: user.id,
                cityID: { in: cityIds },
            }));

            setCityOptions(cityMappings?.map((m: any) => m?.px_city) ?? []);

            const mappedCityIds = cityMappings?.map((m: any) => m?.px_city?.id).filter(Boolean) ?? [];

            const { data: branches } = assertSuccess(await getBranch({
                isActive: true,
                isDeleted: false,
                companyID,
                cityID: { in: mappedCityIds },
            }));

            setBranchOptions(branches?.filter(isBranchRole) ?? []);
        };

        // Admin path: simple branch list fetch
        const fetchForAdmin = async () => {
            const payload: any = { isActive: true, isDeleted: false };
            if (companyID) payload.companyID = companyID;

            const { data: branches } = assertSuccess(await getBranch(payload));
            setBranchOptions(branches?.filter(isBranchRole) ?? []);
        };

        (async () => {
            try {
                startLoading();
                if (isAdmin) {
                    await fetchForAdmin();
                } else {
                    await fetchForNonAdmin();
                }
            } catch (err: any) {
                showError(err?.message || 'Something went wrong');
            } finally {
                stopLoading();
            }
        })();
    }, [companyID, user, isAdmin]);

    return {
        slot,
        toDate,
        isAdmin,
        fromDate,
        cityOptions,
        selectedCity,
        isShowCustom,
        branchOptions,
        selectedBranch,
        dailyReportList,
        selectedExpenses,
        showExpenseDetail,
        setSlot,
        setToDate,
        setFromDate,
        setSelectedCity,
        setIsShowCustom,
        fetchDailyReport,
        setSelectedBranch,
        toggleIsShowCustom,
        setSelectedExpenses,
        toggleExpenseDetail,
    }
}

export default UseDailyReport;
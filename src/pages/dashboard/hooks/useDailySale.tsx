
import { useEffect, useMemo, useState } from "react";
import moment from "moment";

import useAuth from "hooks/useAuth";
import { searchViaDashboard } from "service/bill";
import { getBranch } from "service/user";
import { getCityMapping } from "service/city";
import { getCityByFind } from "service/city";
import { getCompanyById } from "service/company";
import { openSnackbar } from "api/snackbar";

const DAILYSALE = [
    'daily_sales_analysis_upi',
    'daily_sales_analysis_card',
    'daily_sales_analysis_cash'
]

const UseDailySale = (companyID?: number | null) => {
    const { user, isAdmin, accessSectionRights, startLoading, stopLoading } = useAuth();

    const [isShowCustom, setIsShowCustom] = useState<boolean>(false);
    const [slot, setSlot] = useState<number>(0);

    const [fromDate, setFromDate] = useState<Date>(moment().toDate());
    const [toDate, setToDate] = useState<Date>(moment().toDate());
    const [selectedBranch, setSelectedBranch] = useState<number[]>([]);
    const [branchOptions, setBranchOptions] = useState<any[]>([]);
    const [selectedCity, setSelectedCity] = useState<any>(null);
    const [cityOptions, setCityOptions] = useState<any[]>([]);
    const [dailySaleList, setDailySaleList] = useState<any[]>([]);

    const dailySaleSectionRights = useMemo(() => {
        const result: any = {};
        DAILYSALE.forEach((section: string) => {
            result[section] = accessSectionRights(section);
        });
        return result;
    }, [accessSectionRights, isAdmin, DAILYSALE]);

    const toggleIsShowCustom = () => {
        setIsShowCustom(!isShowCustom);
    }

    const fetchDailyReport = async () => {
        try {
            startLoading();
            setDailySaleList([]);
            let payload: any = {
                searchText: '',
                isActive: true,
                isDeleted: false,
                startDate: moment(fromDate).format("YYYY-MM-DD"),
                endDate: moment(toDate).format("YYYY-MM-DD")
            }

            if (companyID) {
                payload.companyID = companyID;
            }

            if (selectedCity && (selectedBranch && selectedBranch.length === 0)) {
                payload.userID = branchOptions?.map((item: any) => ({ value: item.id }))
            }

            if (selectedBranch && selectedBranch.length > 0) {
                payload.userID = selectedBranch?.map((item: any) => ({ value: item }));
            }
            const { success, message, data }: any = await searchViaDashboard({ where: payload });
            if (!success) {
                openSnackbar({
                    open: true,
                    message: message,
                    variant: 'alert',
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                });
                return;
            }
            setDailySaleList(data || []);
        } catch (error: any) {
            openSnackbar({
                open: true,
                message: error?.message || error?.messageCode || (error as Error).message || 'Something went wrong',
                variant: 'alert',
                severity: 'error',
                alert: {
                    color: 'error'
                }
            })
        } finally {
            stopLoading();
        }
    }

    useEffect(() => {
        if (!isShowCustom && (companyID || isAdmin)) {
            fetchDailyReport();
        }
    }, [fromDate, toDate, selectedCity, companyID, selectedBranch, isShowCustom]);

    useEffect(() => {
        if (slot === 4) {
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
        } else if (slot === 3) {
            setFromDate(moment().subtract(4, 'months').startOf('month').toDate());
            setToDate(moment().subtract(1, 'months').endOf('month').toDate());
        } else if (slot === 2) {
            setFromDate(moment().subtract(1, 'months').startOf('month').toDate());
            setToDate(moment().subtract(1, 'months').endOf('month').toDate());
        }
        // else if (slot === 4) {
        //     setFromDate(moment().subtract(12, 'months').startOf('month').toDate());
        //     setToDate(moment().endOf('month').toDate());
        // }
    }, [slot]);

    // ── Helpers ──────────────────────────────────────────────────────────────────
    const showError = (msg: string) =>
        openSnackbar({ open: true, message: msg, variant: 'alert', severity: 'error', alert: { color: 'error' } });

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
        dailySaleList,
        branchOptions,
        selectedBranch,
        dailySaleSectionRights,
        setSlot,
        setToDate,
        setFromDate,
        setSelectedCity,
        setIsShowCustom,
        fetchDailyReport,
        setSelectedBranch,
        toggleIsShowCustom,
    }
}

export default UseDailySale;

import { useEffect, useState } from "react";
import moment from "moment";

import useAuth from "hooks/useAuth";
import { searchViaDashboard } from "service/bill";
import { getBranch } from "service/user";
import { openSnackbar } from "api/snackbar";

const UseDailySale = () => {
    const { startLoading, stopLoading } = useAuth();

    const [isShowCustom, setIsShowCustom] = useState<boolean>(false);
    const [slot, setSlot] = useState<number>(0);

    const [fromDate, setFromDate] = useState<Date>(moment().startOf('month').toDate());
    const [toDate, setToDate] = useState<Date>(moment().endOf('month').toDate());
    const [selectedBranch, setSelectedBranch] = useState<number[]>([]);
    const [branchOptions, setBranchOptions] = useState<any[]>([]);
    const [dailySaleList, setDailySaleList] = useState<any[]>([]);

    const toggleIsShowCustom = () => {
        setIsShowCustom(!isShowCustom);
    }

    const fetchDailyReport = async () => {
        try {
            startLoading();
            let payload: any = {
                searchText: '',
                isActive: true,
                isDeleted: false,
                startDate: moment(fromDate).format("YYYY-MM-DD"),
                endDate: moment(toDate).format("YYYY-MM-DD")
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
        if (!isShowCustom) {
            fetchDailyReport();
        }
    }, [fromDate, toDate, selectedBranch, isShowCustom]);

    useEffect(() => {
        if (slot === 4) {
            setIsShowCustom(true);
            return;
        }
        setIsShowCustom(false);
        if (slot === 0) {
            setFromDate(moment().startOf('month').toDate());
            setToDate(moment().endOf('month').toDate());
        } else if (slot === 1) {
            setFromDate(moment().subtract(3, 'months').startOf('month').toDate());
            setToDate(moment().endOf('month').toDate());
        } else if (slot === 2) {
            setFromDate(moment().subtract(6, 'months').startOf('month').toDate());
            setToDate(moment().endOf('month').toDate());
        } else if (slot === 3) {
            setFromDate(moment().subtract(12, 'months').startOf('month').toDate());
            setToDate(moment().endOf('month').toDate());
        }
    }, [slot]);

    useEffect(() => {
        (async () => {
            try {
                startLoading();
                const { success, message, data }: any = await getBranch({
                    isActive: true,
                    isDeleted: false,
                });
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
                setBranchOptions(data.filter((item: any) => {
                    if (item && item.px_role && item.px_role.name && !['admin', 'super admin'].includes(item.px_role.name.toLowerCase())) {
                        return item;
                    }
                }));
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
        })()
    }, []);

    return {
        slot,
        toDate,
        fromDate,
        isShowCustom,
        dailySaleList,
        branchOptions,
        selectedBranch,
        setSlot,
        setToDate,
        setFromDate,
        setIsShowCustom,
        fetchDailyReport,
        setSelectedBranch,
        toggleIsShowCustom,
    }
}

export default UseDailySale;
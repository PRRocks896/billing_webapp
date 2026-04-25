import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import moment from "moment";
import { useEffect, useState } from "react";
import { getMonthSale } from "service/dailyReport";

import { getBranch } from "service/user";

const UseMonthlySale = () => {
    const { user, startLoading, stopLoading } = useAuth();

    const [isShowCustom, setIsShowCustom] = useState<boolean>(false);
    const [slot, setSlot] = useState<number>(0);

    const [fromDate, setFromDate] = useState<Date>(moment().startOf('month').toDate());
    const [toDate, setToDate] = useState<Date>(moment().endOf('month').toDate());
    const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
    const [branchOptions, setBranchOptions] = useState<any[]>([]);
    const [labels, setLabels] = useState<string[]>([]);
    const [salesData, setSalesData] = useState<any[]>([]);

    const toggleIsShowCustom = () => {
        setIsShowCustom(!isShowCustom);
    }

    const fetchMonthlySalesReport = async () => {
        try {
            startLoading();
            let payload: any = {
                startDate: moment(fromDate).format("YYYY-MM-DD"),
                endDate: moment(toDate).format("YYYY-MM-DD")
            }
            if (selectedBranch) {
                payload.userID = selectedBranch;
            }
            const { success, data }: any = await getMonthSale(payload);
            if (success && data && data.datasets && data.labels) {
                setSalesData(data?.datasets?.map((item: any) => {
                    return {
                        name: item.label.toUpperCase(),
                        data: item.data
                    }
                }));
                setLabels(data?.labels || []);
            } else {
                setSalesData([]);
                setLabels([]);
            }
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
            fetchMonthlySalesReport();
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
        labels,
        fromDate,
        salesData,
        isShowCustom,
        branchOptions,
        selectedBranch,
        setSlot,
        setToDate,
        setFromDate,
        setIsShowCustom,
        setSelectedBranch,
        toggleIsShowCustom,
        fetchMonthlySalesReport
    }
}

export default UseMonthlySale;
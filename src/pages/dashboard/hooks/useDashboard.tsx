import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";

import { fetchDashboardDetails, repeatCustomer, fetchBranchWiseIncome } from "service/dashboard";
import { newCustomerCount } from "service/customer";

const UseDashboard = () => {
    const { user, isAdmin, startLoading, stopLoading } = useAuth();

    const [details, setDetails] = useState<any>(null);

    const [fromDate, setFromDate] = useState<Date>(new Date(moment().subtract(1, 'M').toDate()));
    const [toDate, setToDate] = useState<Date>(new Date());
    const [repeatCustomerData, setRepeatCustomerData] = useState<number[]>([]);
    const [repeatCustomerLabel, setRepeatCustomerLabel] = useState<string[]>([]);

    const [newCustomerFromDate, setNewCustomerFromDate] = useState<Date>(new Date(moment().subtract(1, 'M').toDate()));
    const [newCustomerToDate, setNewCustomerToDate] = useState<Date>(new Date());
    const [newCustomerData, setNewCustomerData] = useState<number[]>([]);
    const [newCustomerLabel, setNewCustomerLabel] = useState<string[]>([]);

    const [branchWiseIncomeFromDate, setBranchWiseIncomeFromDate] = useState<Date>(new Date(moment().subtract(12, 'M').toDate()));
    const [branchWiseIncomeToDate, setBranchWiseIncomeToDate] = useState<Date>(new Date());
    const [branchWiseIncomeData, setBranchWiseIncomeData] = useState<{
        otherExpanse: number;
        totalExpanse: number;
        totalIncome: number;
        totalRent: number;
    }>({ otherExpanse: 0, totalExpanse: 0, totalIncome: 0, totalRent: 0 });

    const handleBranchWiseIncomeDateChange = (value: number) => {
        setBranchWiseIncomeToDate(new Date());
        switch (value) {
            case 1:
                setBranchWiseIncomeFromDate(moment().subtract(1, 'M').toDate());
                break;
            case 3:
                setBranchWiseIncomeFromDate(moment().subtract(3, 'M').toDate());
                break;
            case 6:
                setBranchWiseIncomeFromDate(moment().subtract(6, 'M').toDate());
                break;
            case 12:
                setBranchWiseIncomeFromDate(moment().subtract(12, 'M').toDate());
                break;
            default:
                break;
        }
    }

    const fetchBranchWiseIncomeData = useCallback(async () => {
        try {
            startLoading();
            const { success, message, data }: any = await fetchBranchWiseIncome({ startDate: moment(branchWiseIncomeFromDate).format('yyyy/MM/DD'), endDate: moment(branchWiseIncomeToDate).format('yyyy/MM/DD') });
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
            if (data) {
                setBranchWiseIncomeData(data);
            }
        } catch (error: any) {
            openSnackbar({
                open: true,
                message: (error as Error).message || error?.response?.data?.message || 'Something went wrong',
                variant: 'alert',
                severity: 'error',
                alert: {
                    color: 'error'
                }
            })
        } finally {
            stopLoading();
        }
    }, [branchWiseIncomeFromDate, branchWiseIncomeToDate]);

    const handleNewCustomerDateChange = (value: number) => {
        setNewCustomerToDate(new Date());
        switch (value) {
            case 1:
                setNewCustomerFromDate(moment().subtract(1, 'M').toDate());
                break;
            case 3:
                setNewCustomerFromDate(moment().subtract(3, 'M').toDate());
                break;
            case 6:
                setNewCustomerFromDate(moment().subtract(6, 'M').toDate());
                break;
            default:
                break;
        }
    }

    const fetchNewCustomerData = useCallback(async () => {
        try {
            startLoading();
            const { success, message, data }: any = await newCustomerCount({ startDate: moment(newCustomerFromDate).format('yyyy/MM/DD'), endDate: moment(newCustomerToDate).format('yyyy/MM/DD') });
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
            if (data && data.values) {
                setNewCustomerData(data.values);
            }
            if (data && data.labels) {
                setNewCustomerLabel(data.labels);
            }
        } catch (error: any) {
            openSnackbar({
                open: true,
                message: (error as Error).message || error?.response?.data?.message || 'Something went wrong',
                variant: 'alert',
                severity: 'error',
                alert: {
                    color: 'error'
                }
            })
        } finally {
            stopLoading();
        }
    }, [newCustomerFromDate, newCustomerToDate]);

    const handleDateChange = (value: number) => {
        setToDate(new Date());
        switch (value) {
            case 1:
                setFromDate(moment().subtract(1, 'M').toDate());
                break;
            case 3:
                setFromDate(moment().subtract(3, 'M').toDate());
                break;
            case 6:
                setFromDate(moment().subtract(6, 'M').toDate());
                break;
            default:
                break;
        }
    };

    const fetchRepeatCustomerData = useCallback(async () => {
        try {
            startLoading();
            const { success, message, data }: any = await repeatCustomer({ startDate: moment(fromDate).format('yyyy/MM/DD'), endDate: moment(toDate).format('yyyy/MM/DD') });
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
            if (data && data.values) {
                setRepeatCustomerData(data.values);
            }
            if (data && data.labels) {
                setRepeatCustomerLabel(data.labels);
            }
        } catch (error: any) {
            openSnackbar({
                open: true,
                message: (error as Error).message || error?.response?.data?.message || 'Something went wrong',
                variant: 'alert',
                severity: 'error',
                alert: {
                    color: 'error'
                }
            })
        } finally {
            stopLoading();
        }
    }, [fromDate, toDate]);

    // Automatically refetch when fromDate or toDate changes
    useEffect(() => {
        fetchRepeatCustomerData();
    }, [fetchRepeatCustomerData]);

    useEffect(() => {
        fetchNewCustomerData();
    }, [fetchNewCustomerData]);

    useEffect(() => {
        fetchBranchWiseIncomeData();
    }, [fetchBranchWiseIncomeData]);

    useEffect(() => {
        (async () => {
            try {
                startLoading();
                const { success, message, data }: any = await fetchDashboardDetails({ currentDate: moment(new Date()).format('yyyy/MM/DD') });
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
                if (data && data.counts) {
                    setDetails(data.counts);
                }
            } catch (error: any) {
                openSnackbar({
                    open: true,
                    message: (error as Error).message || error?.response?.data?.message || 'Something went wrong',
                    variant: 'alert',
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                })
            } finally {
                stopLoading();
            }
        })();
    }, []);

    return {
        user,
        isAdmin,
        details,
        toDate,
        fromDate,
        newCustomerData,
        newCustomerLabel,
        newCustomerToDate,
        repeatCustomerData,
        newCustomerFromDate,
        repeatCustomerLabel,
        branchWiseIncomeData,
        branchWiseIncomeToDate,
        branchWiseIncomeFromDate,
        handleDateChange,
        handleNewCustomerDateChange,
        handleBranchWiseIncomeDateChange
    }
}

export default UseDashboard;
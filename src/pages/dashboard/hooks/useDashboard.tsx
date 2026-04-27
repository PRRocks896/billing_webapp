import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";

import { fetchDashboardDetails, repeatCustomer, fetchBranchWiseIncome, fetchReferenceChart } from "service/dashboard";
import { newCustomerCount } from "service/customer";

const DEFAULT_INCOME_DATA = { otherExpanse: 0, totalExpanse: 0, totalIncome: 0, totalRent: 0 };
const DEFAULT_REFERENCE_DATA = [
    { label: "google", value: 0 },
    { label: "social", value: 0 },
    { label: "direct_call", value: 0 },
    { label: "website", value: 0 },
    { label: "justdial", value: 0 },
    { label: "other", value: 0 }
];

const getDateRange = (value: number) => {
    const today = new Date();
    switch (value) {
        case 0:
            return { from: moment().startOf('month').toDate(), to: today };
        case 1:
            return {
                from: moment().startOf('month').subtract(1, 'M').toDate(),
                to: moment().endOf('month').subtract(1, 'M').toDate()
            };
        case 3:
            return {
                from: moment().startOf('month').subtract(3, 'M').toDate(),
                to: moment().endOf('month').subtract(1, 'M').toDate()
            };
        case 6:
            return {
                from: moment().startOf('month').subtract(6, 'M').toDate(),
                to: moment().endOf('month').subtract(1, 'M').toDate()
            };
        case 12:
            return {
                from: moment().startOf('month').subtract(12, 'M').toDate(),
                to: moment().endOf('month').subtract(1, 'M').toDate()
            };
        default:
            return { from: moment().startOf('month').toDate(), to: today };
    }
};

const UseDashboard = () => {
    const { user, isAdmin, startLoading, stopLoading } = useAuth();

    const [details, setDetails] = useState<any>(null);

    const [fromDate, setFromDate] = useState<Date>(() => moment().startOf('month').toDate());
    const [toDate, setToDate] = useState<Date>(() => new Date());
    const [repeatCustomerData, setRepeatCustomerData] = useState<number[]>([]);
    const [repeatCustomerLabel, setRepeatCustomerLabel] = useState<string[]>([]);

    const [newCustomerFromDate, setNewCustomerFromDate] = useState<Date>(() => moment().startOf('month').toDate());
    const [newCustomerToDate, setNewCustomerToDate] = useState<Date>(() => new Date());
    const [newCustomerData, setNewCustomerData] = useState<number[]>([]);
    const [newCustomerLabel, setNewCustomerLabel] = useState<string[]>([]);

    const [branchWiseIncomeFromDate, setBranchWiseIncomeFromDate] = useState<Date>(() => moment().startOf('month').toDate());
    const [branchWiseIncomeToDate, setBranchWiseIncomeToDate] = useState<Date>(() => new Date());
    const [branchWiseIncomeData, setBranchWiseIncomeData] = useState<{
        otherExpanse: number;
        totalExpanse: number;
        totalIncome: number;
        totalRent: number;
    }>(DEFAULT_INCOME_DATA);

    const [referenceChartFromDate, setReferenceChartFromDate] = useState<Date>(() => moment().startOf('month').toDate());
    const [referenceChartToDate, setReferenceChartToDate] = useState<Date>(() => new Date());
    const [referenceChartData, setReferenceChartData] = useState<{
        label: string;
        value: any
    }[]>(DEFAULT_REFERENCE_DATA);

    const handleReferenceChartDateChange = useCallback((value: number) => {
        const { from, to } = getDateRange(value);
        setReferenceChartFromDate(from);
        setReferenceChartToDate(to);
    }, []);

    const fetchReferenceChartData = useCallback(async () => {
        try {
            startLoading();
            const { success, data }: any = await fetchReferenceChart({
                startDate: moment(referenceChartFromDate).format('yyyy/MM/DD'),
                endDate: moment(referenceChartToDate).format('yyyy/MM/DD')
            });
            if (!success) {
                setReferenceChartData(DEFAULT_REFERENCE_DATA);
                return;
            }
            if (data) {
                setReferenceChartData(data);
            }
        } catch (error: any) {
            openSnackbar({
                open: true,
                message: (error as Error).message || error?.response?.data?.message || 'Something went wrong',
                variant: 'alert',
                severity: 'error',
                alert: { color: 'error' }
            });
        } finally {
            stopLoading();
        }
    }, [referenceChartFromDate, referenceChartToDate, startLoading, stopLoading]);

    const handleBranchWiseIncomeDateChange = useCallback((value: number) => {
        const { from, to } = getDateRange(value);
        setBranchWiseIncomeFromDate(from);
        setBranchWiseIncomeToDate(to);
    }, []);

    const fetchBranchWiseIncomeData = useCallback(async () => {
        try {
            startLoading();
            const { success, data }: any = await fetchBranchWiseIncome({
                startDate: moment(branchWiseIncomeFromDate).format('yyyy/MM/DD'),
                endDate: moment(branchWiseIncomeToDate).format('yyyy/MM/DD')
            });
            if (!success) {
                setBranchWiseIncomeData(DEFAULT_INCOME_DATA);
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
                alert: { color: 'error' }
            });
        } finally {
            stopLoading();
        }
    }, [branchWiseIncomeFromDate, branchWiseIncomeToDate, startLoading, stopLoading]);

    const handleNewCustomerDateChange = useCallback((value: number) => {
        const { from, to } = getDateRange(value);
        setNewCustomerFromDate(from);
        setNewCustomerToDate(to);
    }, []);

    const fetchNewCustomerData = useCallback(async () => {
        try {
            startLoading();
            const { success, data }: any = await newCustomerCount({
                startDate: moment(newCustomerFromDate).format('yyyy/MM/DD'),
                endDate: moment(newCustomerToDate).format('yyyy/MM/DD')
            });
            if (!success) {
                setNewCustomerData([]);
                setNewCustomerLabel([]);
                return;
            }
            if (data?.values) {
                setNewCustomerData(data.values);
            }
            if (data?.labels) {
                setNewCustomerLabel(data.labels);
            }
        } catch (error: any) {
            openSnackbar({
                open: true,
                message: (error as Error).message || error?.response?.data?.message || 'Something went wrong',
                variant: 'alert',
                severity: 'error',
                alert: { color: 'error' }
            });
        } finally {
            stopLoading();
        }
    }, [newCustomerFromDate, newCustomerToDate, startLoading, stopLoading]);

    const handleDateChange = useCallback((value: number) => {
        const { from, to } = getDateRange(value);
        setFromDate(from);
        setToDate(to);
    }, []);

    const fetchRepeatCustomerData = useCallback(async () => {
        try {
            startLoading();
            const { success, data }: any = await repeatCustomer({
                startDate: moment(fromDate).format('yyyy/MM/DD'),
                endDate: moment(toDate).format('yyyy/MM/DD')
            });
            if (!success) {
                setRepeatCustomerData([]);
                setRepeatCustomerLabel([]);
                return;
            }
            if (data?.values) {
                setRepeatCustomerData(data.values);
            }
            if (data?.labels) {
                setRepeatCustomerLabel(data.labels);
            }
        } catch (error: any) {
            openSnackbar({
                open: true,
                message: (error as Error).message || error?.response?.data?.message || 'Something went wrong',
                variant: 'alert',
                severity: 'error',
                alert: { color: 'error' }
            });
        } finally {
            stopLoading();
        }
    }, [fromDate, toDate, startLoading, stopLoading]);

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
        fetchReferenceChartData();
    }, [fetchReferenceChartData]);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                startLoading();
                const { success, data }: any = await fetchDashboardDetails({ currentDate: moment().format('yyyy/MM/DD') });
                if (!success) {
                    setDetails(null);
                    return;
                }
                if (data?.counts) {
                    setDetails(data.counts);
                }
            } catch (error: any) {
                openSnackbar({
                    open: true,
                    message: (error as Error).message || error?.response?.data?.message || 'Something went wrong',
                    variant: 'alert',
                    severity: 'error',
                    alert: { color: 'error' }
                });
            } finally {
                stopLoading();
            }
        };
        fetchDetails();
    }, [startLoading, stopLoading]);

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
        referenceChartData,
        referenceChartToDate,
        referenceChartFromDate,
        handleDateChange,
        handleNewCustomerDateChange,
        handleReferenceChartDateChange,
        handleBranchWiseIncomeDateChange
    };
};

export default UseDashboard;
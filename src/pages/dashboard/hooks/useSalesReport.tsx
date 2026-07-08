import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import moment from "moment";
import { useEffect, useState } from "react";
import { getSalesExpenseReport } from "service/dailyReport";

const UseSalesReport = (companyID?: number | null) => {
    const { user, isAdmin, startLoading, stopLoading } = useAuth();

    const [fromDate, setFromDate] = useState<Date>(new Date());
    const [toDate, setToDate] = useState<Date>(new Date());
    const [labels, setLabels] = useState<string[]>([]);
    const [salesData, setSalesData] = useState<number[]>([]);
    const [expenseData, setExpenseData] = useState<number[]>([]);
    const [isShowCustom, setIsShowCustom] = useState<boolean>(false);
    const [slot, setSlot] = useState<number>(0);

    const toggleIsShowCustom = () => {
        setIsShowCustom(!isShowCustom);
    }

    const fetchSalesExpenseReport = async () => {
        try {
            startLoading();
            let payload: any = {
                fromDate: moment(fromDate).format('YYYY-MM-DD'),
                toDate: moment(toDate).format('YYYY-MM-DD')
            };
            if (companyID) {
                payload.customerID = companyID;
            }
            const { success, data }: any = await getSalesExpenseReport(payload);
            if (success) {
                const labels = Object.keys(data);
                const salesData = labels.map(label => data[label].sales || 0);
                const expenseData = labels.map(label => data[label].exp || 0);
                setSalesData(salesData);
                setExpenseData(expenseData);
                setLabels(labels);
            } else {
                setSalesData([]);
                setExpenseData([]);
                setLabels([]);
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
    };

    useEffect(() => {
        if (!isShowCustom) {
            fetchSalesExpenseReport();
        }
    }, [companyID, fromDate, toDate, isShowCustom]);

    useEffect(() => {
        if (slot === 3) {
            setIsShowCustom(true);
            return;
        }
        setIsShowCustom(false);
        if (slot === 0) {
            setFromDate(new Date());
            setToDate(new Date());
        } else if (slot === 1) {
            setFromDate(moment().subtract(7, 'days').toDate());
            setToDate(new Date());
        } else if (slot === 2) {
            setFromDate(moment().subtract(30, 'days').toDate());
            setToDate(new Date());
        }
    }, [slot]);

    useEffect(() => {
        // Initial fetch or any setup can be done here if needed
        fetchSalesExpenseReport();
    }, []);

    return {
        slot,
        toDate,
        labels,
        fromDate,
        salesData,
        expenseData,
        isShowCustom,
        setSlot,
        setToDate,
        setFromDate,
        toggleIsShowCustom,
        fetchSalesExpenseReport
    }
}

export default UseSalesReport;
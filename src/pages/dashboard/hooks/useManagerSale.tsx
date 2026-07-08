import { useEffect, useState } from "react";
import moment from "moment";

import useAuth from "hooks/useAuth";
import { openSnackbar } from "api/snackbar";

import { getManagerSalesReport } from "service/dailyReport";

const UseManagerSale = (companyID?: number | null) => {
    const { startLoading, stopLoading } = useAuth();

    const [fromDate, setFromDate] = useState<Date>(new Date());
    const [toDate, setToDate] = useState<Date>(new Date());
    const [labels, setLabels] = useState<string[]>([]);
    const [salesData, setSalesData] = useState<number[]>([]);
    const [isShowCustom, setIsShowCustom] = useState<boolean>(false);
    const [slot, setSlot] = useState<number>(0);

    const toggleIsShowCustom = () => {
        setIsShowCustom(!isShowCustom);
    }

    const fetchManagerSalesReport = async () => {
        try {
            startLoading();
            let payload: any = {
                fromDate: moment(fromDate).format('YYYY-MM-DD'),
                toDate: moment(toDate).format('YYYY-MM-DD')
            };

            if (companyID) {
                payload.companyID = companyID;
            }

            const { success, data }: any = await getManagerSalesReport(payload);
            if (success) {
                // Process the data as needed
                const labels = data.map((item: any) => item.nickName);
                const salesData = data.map((item: any) => item.totalSales || 0);
                setSalesData(salesData);
                setLabels(labels);
            } else {
                setSalesData([]);
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
            fetchManagerSalesReport();
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
        fetchManagerSalesReport();
    }, []);

    return {
        slot,
        toDate,
        labels,
        fromDate,
        salesData,
        isShowCustom,
        setSlot,
        setToDate,
        setFromDate,
        toggleIsShowCustom,
        fetchManagerSalesReport
    }
}

export default UseManagerSale;
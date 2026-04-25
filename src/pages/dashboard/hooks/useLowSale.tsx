import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import moment from "moment";
import { useEffect, useState } from "react";
import { getLowSalesBranchReport } from "service/dailyReport";

const UseLowSale = () => {
    const { startLoading, stopLoading } = useAuth();

    const [date, setDate] = useState<Date>(new Date());
    const [labels, setLabels] = useState([]);
    const [salesData, setSalesData] = useState([]);

    const fetchLowSaleReport = async () => {
        try {
            startLoading();
            const { success, message, data }: any = await getLowSalesBranchReport({
                date: moment(date).format('yyyy-MM-DD'),
            });
            if (!success) {
                setSalesData([]);
                setLabels([]);
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
            if (data && data.length > 0) {
                // Process the data as needed
                const labels = data.map((item: any) => item.branch);
                const salesData = data.map((item: any) => item.total || 0);
                setSalesData(salesData);
                setLabels(labels);
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

    return {
        date,
        labels,
        salesData,
        setDate,
        fetchLowSaleReport
    }
}

export default UseLowSale;
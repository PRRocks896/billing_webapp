import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';

import { startLoading, stopLoading } from "../../../redux/loader";
import { getManagerSalesReport } from "../../../service/dailyReport";

const useManagerSaleHook = () => {
    const dispatch = useDispatch();

    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const [labels, setLabels] = useState([]);
    const [salesData, setSalesData] = useState([]);
    
    const handleDateChange = (value) => {
        setDateRange(value);
    };

    const fetchManagerSaleReport = async () => {
        try {
            dispatch(startLoading());
            const payload = {
                fromDate: moment(dateRange[0]).format("YYYY-MM-DD"),
                toDate: moment(dateRange[1]).format("YYYY-MM-DD"),
                // branchId: user?.branch?._id,
            };
            const { success, message, data } = await getManagerSalesReport(payload);
            if (success && data && data.length > 0) {
                // Process the data as needed
                const labels = data.map(item => item.nickName);
                const salesData = data.map(item => item.totalSales || 0);
                setSalesData(salesData);
                setLabels(labels);
            } else {
                setSalesData([]);
                setLabels([]);
                console.error("Error fetching sales and expense report:", message);
            }
        } catch (error) {
            console.error("Error in fetchSalesExpenseReport:", error);
        } finally {
            dispatch(stopLoading());
        }
    };

    useEffect(() => {
        // Initial fetch or any setup can be done here if needed
        fetchManagerSaleReport();
    }, []);

    return {
        labels,
        dateRange,
        salesData,
        handleDateChange,
        fetchManagerSaleReport
    }
};

export default useManagerSaleHook;
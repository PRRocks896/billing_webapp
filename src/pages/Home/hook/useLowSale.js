import { useEffect, useState } from "react";
import { useDispatch, } from "react-redux";
import moment from 'moment';
import dayjs from 'dayjs';

import { startLoading, stopLoading } from "../../../redux/loader";
import { getLowSalesBranchReport } from "../../../service/dailyReport";

const useLowSalesHook = () => {
    const dispatch = useDispatch();

    const [date, setDate] = useState(dayjs());
    const [labels, setLabels] = useState([]);
    const [salesData, setSalesData] = useState([]);
    
    const handleDateChange = (value) => {
        setDate(value);
    };

    const fetchLowSalesReport = async () => {
        try {
            dispatch(startLoading());
            const payload = {
                date: date.format("YYYY-MM-DD") //moment(date).format("YYYY-MM-DD"),
            };
            const { success, message, data } = await getLowSalesBranchReport(payload);
            if (success && data && data.length > 0) {
                // Process the data as needed
                const labels = data.map(item => item.branch);
                const salesData = data.map(item => item.total || 0);
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
        fetchLowSalesReport();
    }, []);

    return {
        date,
        labels,
        salesData,
        handleDateChange,
        fetchLowSalesReport
    }
};

export default useLowSalesHook;
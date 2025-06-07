import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';

import { startLoading, stopLoading } from "../../../redux/loader";
import { getSalesExpenseReport } from "../../../service/dailyReport";

const useSalesExpenseHook = () => {
    const dispatch = useDispatch();

    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const [labels, setLabels] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [expenseData, setExpenseData] = useState([]);
    const user = useSelector((state) => state.loggedInUser);

    const handleDateChange = (value) => {
        setDateRange(value);
    };

    const fetchSalesExpenseReport = async () => {
        try {
            dispatch(startLoading());
            const payload = {
                fromDate: moment(dateRange[0]).format("YYYY-MM-DD"),
                toDate: moment(dateRange[1]).format("YYYY-MM-DD"),
                // branchId: user?.branch?._id,
            };
            const { success, message, data } = await getSalesExpenseReport(payload);
            if (success && data) {
                // Process the data as needed
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
        fetchSalesExpenseReport();
    }, []);

    return {
        labels,
        dateRange,
        salesData,
        expenseData,
        handleDateChange,
        fetchSalesExpenseReport
    }
};

export default useSalesExpenseHook;
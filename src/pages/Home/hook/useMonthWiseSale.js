import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';

import { startLoading, stopLoading } from "../../../redux/loader";
import { listPayload, showToast } from "../../../utils/helper";
import { getUserList } from "../../../service/users";
import { getMonthSale } from "../../../service/dailyReport";

const UseMonthWiseSale = () => {
    const dispatch = useDispatch();

    const [branchOptions, setBranchOptions] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const [labels, setLabels] = useState([]);
    const [salesData, setSalesData] = useState([]);

    const handleDateChange = (value) => {
        setDateRange(value);
    };

    const fetchBranch = async () => {
        try {
            const body = listPayload(0, { isActive: true }, 1000);

            const response = await getUserList(body);
            if (response?.statusCode === 200) {
                const payload = response?.data?.rows;
                const branchOption = payload.filter(item => item.roleID !== 1).map((row) => ({
                    value: row.id,
                    label: row.lastName,
                }));
                setBranchOptions(branchOption);
                // setBranchOptions([{value: null, label: 'All'}].concat(branchOption));
            } else if (response?.statusCode === 404) {
                const payload = [];
                setBranchOptions(payload);
            }
        } catch (error) {
            showToast(error?.message, false);
        }
    };

    const fetchMonthSale = async () => {
        try {
            dispatch(startLoading());
            
            const response = await getMonthSale({
                userID: selectedBranch?.value,
                startDate: moment(dateRange[0]).format("YYYY-MM-DD"),
                endDate: moment(dateRange[1]).format("YYYY-MM-DD")
            });
            if(response && response.success && response.data && response.data.datasets && response.data.labels) {
                setSalesData(response.data?.datasets || []);
                setLabels(response.data?.labels || []);
            } else {
                showToast(response?.message, false);
                setSalesData([]);
                setLabels([]);
            }
        } catch (error) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    }

    useEffect(() => {
        fetchBranch();
    }, []);

    return {
        labels,
        dateRange,
        salesData,
        branchOptions,
        selectedBranch,
        fetchMonthSale,
        handleDateChange,
        setSelectedBranch
    }
}

export default UseMonthWiseSale;
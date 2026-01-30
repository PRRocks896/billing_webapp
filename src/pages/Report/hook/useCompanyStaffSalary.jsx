import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import { exportCompanyWiseSalary } from "../../../service/salary";
import { showToast, listPayload } from "../../../utils/helper";
import { startLoading, stopLoading } from "../../../redux/loader";
import { getCompanyList } from "../../../service/company";

const UseCompanyStaffSalary = () => {
    const dispatch = useDispatch();

    const [month, setMonth] = useState((moment().month() + 1));
    const [year, setYear] = useState(moment().format('yyyy'));
    const [companyList, setCompanyList] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);

    const fetchCompany = async () => {
        try {
            dispatch(startLoading());
            const body = listPayload(0, { isActive: true, isDeleted: false }, 1000);
            const response = await getCompanyList(body);
            if (response?.statusCode === 200) {
                const payload = response?.data?.rows;
                setCompanyList(payload);
            } else if (response?.statusCode === 404) {
                const payload = [];
                setCompanyList(payload);
            }
        } catch (err) {
            showToast(err?.response?.statusText, false);
        } finally {
            dispatch(stopLoading());
        }
    }

    const getReport = async () => {
        try {
            dispatch(startLoading());
            if (year && year.length !== 4) {
                showToast('Please Enter Correct Year', false);
                return;
            }
            if (!selectedCompany) {
                showToast('Please Select Company', false);
                return
            }
            await exportCompanyWiseSalary({
                year: year,
                month: month,
                companyID: selectedCompany
            }, `${companyList.find((item) => item.id === selectedCompany)?.companyName}_${year}_${month}.pdf`.toLowerCase());
        } catch (error) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    }

    useEffect(() => {
        fetchCompany();
    }, []);

    return {
        year,
        month,
        companyList,
        setYear,
        setMonth,
        getReport,
        setSelectedCompany
    }
}

export default UseCompanyStaffSalary;
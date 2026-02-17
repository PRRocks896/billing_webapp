import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";

import { getCompanyList } from "../../../service/company";
import { getUserList } from "../../../service/users";
import { getPaymentBankDropdownList } from "../../../service/paymentBank";
import { exportCompanyWiseSalaryPayment } from "../../../service/salary";
import { showToast, listPayload } from "../../../utils/helper";
import { startLoading, stopLoading } from "../../../redux/loader";

const UseCompanyStaffPayment = () => {
    const dispatch = useDispatch();

    const [month, setMonth] = useState((moment().month() + 1));
    const [year, setYear] = useState(moment().format('yyyy'));
    const [companyList, setCompanyList] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [userList, setUserList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [paymentBankList, setPaymentBankList] = useState([]);
    const [selectedPaymentBank, setSelectedPaymentBank] = useState(null);

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

    const fetchUserList = async (companyId = "") => {
        try {
            let whereCondition = {
                isActive: true,
                isDeleted: false,
            };
            if (companyId) {
                whereCondition = {
                    ...whereCondition,
                    companyID: companyId,
                }
            }
            
            const payload = listPayload(0, whereCondition, 100000);
            const response = await getUserList(payload);
            if (response?.success) {
                const items = response?.data?.rows?.map((row) => ({
                    value: row.id,
                    label: row.lastName,
                }));
                setUserList(items);
                // setUserList([{value: null, label: 'All'}].concat(items));
            } else {
                showToast(response?.message, false);
                setUserList([]);
            }
        } catch (error) {
            showToast(error?.message, false);
        }
    }

    const getReport = async () => {
        try {
            dispatch(startLoading());
            if(!month) {
                showToast('Please Select Month', false);
                return;
            }
            if (year && year.length !== 4) {
                showToast('Please Enter Correct Year', false);
                return;
            }
            if (!selectedCompany) {
                showToast('Please Select Company', false);
                return;
            }
            if (!selectedPaymentBank) {
                showToast('Please Selet Payment Bank', false);
                return;
            }
            const branches = selectedUser?.filter((item) => item.value).map((item) => item?.value)
            await exportCompanyWiseSalaryPayment({
                year: year,
                month: month,
                companyID: selectedCompany,
                paymentBankID: selectedPaymentBank,
                branchId: branches
            }, `${companyList.find((item) => item.id === selectedCompany)?.companyName}_${year}_${month}_payment_sheet.xlsx`.toLowerCase());
        } catch (error) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    }

    useEffect(() => {
        // fetchCompany();
        (async () => {
            try {
                dispatch(startLoading());
                const where = {
                    isActive: true,
                    isDeleted: false
                }
                const body = listPayload(0, where, 1000);
                const [
                    companyResponse,
                    paymentBankResponse
                ] = await Promise.all([
                    getCompanyList(body),
                    getPaymentBankDropdownList(where)
                ]);
                if (companyResponse?.statusCode === 200) {
                    const payload = companyResponse?.data?.rows;
                    setCompanyList(payload);
                } else {
                    const payload = [];
                    setCompanyList(payload);
                }
                if(paymentBankResponse?.statusCode === 200) {
                    setPaymentBankList(paymentBankResponse.data);
                } else {
                    setPaymentBankList([]);
                }
            } catch (error) {
                showToast(error?.message, false);
            } finally {
                dispatch(stopLoading());
            }
        })();
    }, []);

    return {
        year,
        month,
        userList,
        companyList,
        paymentBankList,
        setYear,
        setMonth,
        getReport,
        fetchUserList,
        setSelectedUser,
        setSelectedCompany,
        setSelectedPaymentBank
    }
}

export default UseCompanyStaffPayment;
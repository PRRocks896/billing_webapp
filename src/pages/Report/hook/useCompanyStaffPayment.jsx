import { useState } from "react";
import { useDispatch } from "react-redux";

import { getCompanyList } from "../../../service/company";

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
}
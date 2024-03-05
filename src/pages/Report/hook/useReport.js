import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';

import { getReportList } from "../../../service/report";
import { listPayload, showToast } from "../../../utils/helper";
import { startLoading, stopLoading } from "../../../redux/loader";
import { getUserList } from "../../../service/users";
import { getPaymentTypeList } from "../../../service/paymentType";

export const useReport = () => {
  const dispatch = useDispatch();
  const [pdfData, setPdfData] = useState(null);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [branch, setBranch] = useState([]);
  const [paymentList, setPaymentList] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState([]);
  const user = useSelector((state) => state.loggedInUser);

  const handleDateChange = (value) => {
    setDateRange(value);
  };
  const handleBranchChange = (newValue) => {
    setBranch(newValue);
  };
  const handlePaymentChange = (newValue) => {
    setSelectedPayment(newValue);
  }

  const fetchBranch = async () => {
    try {
      const body = listPayload(0, {}, 1000);

      const response = await getUserList(body);
      if (response?.statusCode === 200) {
        const payload = response?.data?.rows;
        const branchOption = payload.filter(item => item.roleID !== 1).map((row) => ({
          value: row.id,
          label: row.branchName,
        }));
        setBranchOptions([{value: null, label: 'All'}].concat(branchOption));
      } else if (response?.statusCode === 404) {
        const payload = [];
        setBranchOptions(payload);
      }
    } catch (error) {
      showToast(error?.message, false);
    }
  };

  const fetchPaymentType = async () => {
    try {
      const whereCondition = {
        isActive: true,
        isDeleted: false
      };
      const payload = listPayload(0, whereCondition, 100000);
      const { success, message, data } = await getPaymentTypeList(payload)
      if(success) {
        const items = data?.rows?.map((row) => ({
          value: row.id,
          label: row.name,
        }));
        setPaymentList([{value: null, label: 'All'}].concat(items));
      } else {
        showToast(message, false);
      }
    } catch(error) {
      showToast(error?.message, false);
    }
  }

  useEffect(() => {
    if (user.roleID === 1) {
      fetchBranch();
      fetchPaymentType();
    }
  }, [user.roleID]);

  const fetchReportDate = async () => {
    try {
      console.log(selectedPayment);
      setPdfData(null);
      dispatch(startLoading());

      const body = {
        userID: branch,
        paymentID: selectedPayment,
        // userID: user.roleID !== 1 ? user.id : branch.value,
        startDate: moment(dateRange[0]).format('yyyy-MM-DD'), //formatDate(dateRange[0]),
        endDate: moment(dateRange[1]).format('yyyy-MM-DD') //formatDate(dateRange[1]),
      };
      const response = await getReportList(body);
      setPdfData(response);
    } catch (error) {
      showToast("No report found", false);
    } finally {
      dispatch(stopLoading());
    }
  };

  // useEffect(() => {
  //   fetchReportDate();
  // }, [fetchReportDate]);

  return {
    branch,
    pdfData,
    dateRange,
    paymentList,
    branchOptions,
    roleId: user.roleID,
    fetchReportDate,
    handleDateChange,
    handleBranchChange,
    handlePaymentChange,
  };
};

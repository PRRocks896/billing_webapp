import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';

import { getReportList, getGstReportList } from "../../../service/report";
import { listPayload, showToast } from "../../../utils/helper";
import { startLoading, stopLoading } from "../../../redux/loader";
import { getCompanyList } from "../../../service/company";
import { getPaymentTypeList } from "../../../service/paymentType";

export const useReport = () => {
  const dispatch = useDispatch();
  const [pdfData, setPdfData] = useState(null);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [gstDateRange, setGstDateRange] = useState([new Date(), new Date()]);
  // const [branchOptions, setBranchOptions] = useState([]);
  // const [branch, setBranch] = useState([]);
  const [company, setCompany] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [paymentList, setPaymentList] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState([]);
  const [selectedGstPayment, setSelectedGstPayment] = useState([]);
  const user = useSelector((state) => state.loggedInUser);

  const companyOptions = useMemo(() => {
    const data = company.map((item) => {
      return { value: item.id, label: item.companyName };
    });
    // setRoleOptions([...data]);
    return data;
  }, [company]);

  const handleGstDateChange = (value) => {
    setGstDateRange(value);
  };

  const handleDateChange = (value) => {
    setDateRange(value);
  };
  const handleBranchChange = (newValue) => {
    setSelectedCompany(newValue);
  };
  const handlePaymentChange = (newValue) => {
    setSelectedPayment(newValue);
  }

  const handleGstPaymentChange = (newValue) => {
    setSelectedGstPayment(newValue);
  }

  const fetchBranch = async () => {
    try {
      const body = listPayload(0, {isActive: true}, 1000);

      const response = await getCompanyList(body);
      if (response?.statusCode === 200) {
        const payload = response?.data?.rows;
        setCompany(payload);
        // const branchOption = payload.filter(item => item.roleID !== 1).map((row) => ({
        //   value: row.id,
        //   label: row.branchName,
        // }));
        // setBranchOptions([{value: null, label: 'All'}].concat(branchOption));
      } else if (response?.statusCode === 404) {
        const payload = [];
        setCompany(payload);
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

  const fetchGstReportData = async () => {
    try {
      dispatch(startLoading());
      setPdfData(null);
      const body = {
        paymentID: selectedGstPayment,
        startDate: moment(gstDateRange[0]).format('yyyy-MM-DD'), //formatDate(dateRange[0]),
        endDate: moment(gstDateRange[1]).format('yyyy-MM-DD') //formatDate(dateRange[1])
      };
      const response = await getGstReportList(body, `Bill Software all branch GST report ${moment(gstDateRange[0]).format('DD-MM-yyyy')}_${moment(gstDateRange[1]).format('DD-MM-yyyy')}.xlsx`.toUpperCase());
      setPdfData(response);
    } catch(error) {
      showToast("No report found", false);
    } finally {
      dispatch(stopLoading());
    }
  }

  const fetchReportDate = async () => {
    try {
      setPdfData(null);
      dispatch(startLoading());

      const body = {
        // userID: user.roleID !== 1 ? [{
        //   value: user.id,
        //   label: user.lastName,
        // }] : branch,
        companyID: selectedCompany && selectedCompany?.value,
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
    // branch,
    pdfData,
    dateRange,
    gstDateRange,
    paymentList,
    // branchOptions,
    selectedCompany,
    companyOptions,
    roleId: user.roleID,
    fetchReportDate,
    handleDateChange,
    handleBranchChange,
    handlePaymentChange,
    fetchGstReportData,
    handleGstDateChange,
    handleGstPaymentChange,
  };
};

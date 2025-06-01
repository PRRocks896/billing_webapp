import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';

import { getReportList, getGstReportList, getManagerList, getStaffSalaryReport } from "../../../service/report";
import { listPayload, showToast } from "../../../utils/helper";
import { startLoading, stopLoading } from "../../../redux/loader";
import { getCompanyList } from "../../../service/company";
import { getPaymentTypeList } from "../../../service/paymentType";
import { getManager } from "../../../service/staff";
import { getUserList } from "../../../service/users";

export const useReport = () => {
  const dispatch = useDispatch();
  const [pdfData, setPdfData] = useState(null);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [gstDateRange, setGstDateRange] = useState([new Date(), new Date()]);
  const [managerDateRange, setManagerDateRange] = useState([new Date(), new Date()]);
  // const [branchOptions, setBranchOptions] = useState([]);
  // const [branch, setBranch] = useState([]);
  const [company, setCompany] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [paymentList, setPaymentList] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState([]);
  const [selectedGstPayment, setSelectedGstPayment] = useState([]);
  const [managerList, setManagerList] = useState([]);
  const [selectedManager, setSelectedManager] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const serviceList = [
    { value: 'bill', label: 'Bill' },
    { value: 'membership', label: 'Membership' },
    { value: 'membership-redeem', label: 'Membership Redeem' },
    { value: 'daily-report', label: 'Daily Report' },
    { value: 'renew-plan', label: 'Renew Plan' },
  ]

  const user = useSelector((state) => state.loggedInUser);

  const companyOptions = useMemo(() => {
    const data = company.map((item) => {
      return { value: item.id, label: item.companyName };
    });
    // setRoleOptions([...data]);
    return data;
  }, [company]);

  const handleManagerDateChange = (value) => {
    setManagerDateRange(value);
  };

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

  const handleManagerChange = (newValue) => {
    setSelectedManager(newValue);
  }

  const fetchUserList = async (companyId) => {
    try {
      const whereCondition = {
        isActive: true,
        isDeleted: false,
        companyID: companyId,
      };
      const payload = listPayload(0, whereCondition, 100000);
      const response = await getUserList(payload);
      if (response?.success) {
        const items = response?.data?.rows?.map((row) => ({
          value: row.id,
          label: row.lastName,
        }));
        setUserList([{value: null, label: 'All'}].concat(items));
      } else {
        showToast(response?.message, false);
        setUserList([]);
      }
    } catch (error) {
      showToast(error?.message, false);
    }
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

  const fetchManager = async () => {
    try {
      const whereCondition = {
        isActive: true,
        isDeleted: false
      };
      const response = await getManager(
        whereCondition
      );
      if(response && response.success) {
        const payload = response.data;
        setManagerList(payload);
      } else {
        setManagerList([]);
        showToast(response?.message, false);
      }
    } catch (error) {
      showToast(error?.message, false);
    }
  }

  useEffect(() => {
    if (user.roleID === 1) {
      fetchBranch();
      fetchPaymentType();
      fetchManager();
    }
  }, [user.roleID]);

  const fetchManagerReportData = async () => {
    try {
      dispatch(startLoading());
      setPdfData(null);
      const body = {
        managerName: selectedManager,
        startDate: moment(managerDateRange[0]).format('yyyy-MM-DD'), //formatDate(dateRange[0]),
        endDate: moment(managerDateRange[1]).format('yyyy-MM-DD') //formatDate(dateRange[1])
      };
      const response = await getManagerList(body, selectedService, `Bill Software Manager's ${selectedService} report ${moment(managerDateRange[0]).format('DD-MM-yyyy')}-${moment(managerDateRange[1]).format('DD-MM-yyyy')}.xlsx`.toUpperCase());
      setPdfData(response);
    } catch(error) {
      showToast("No report found", false);
    } finally {
      dispatch(stopLoading());
    }
  }

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

  const fetchAttendanceReportData = async () => {
    try {
      dispatch(startLoading());
      setPdfData(null);
      const body = {
        branchID: selectedUser ? selectedUser : null,
        companyID: selectedCompany && selectedCompany?.value,
        year: year,
        month: month,
      };
      const response = await getStaffSalaryReport(body, `Bill Software branch Attendance report ${year}_${month}.xlsx`.toUpperCase());
      console.log("Attendance Report Response: ", response);
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
    year,
    month,
    userList,
    selectedUser,
    setSelectedUser,
    pdfData,
    dateRange,
    gstDateRange,
    managerDateRange,
    managerList,
    paymentList,
    // branchOptions,
    selectedCompany,
    companyOptions,
    serviceList,
    selectedService,
    roleId: user.roleID,
    setYear,
    setMonth,
    fetchUserList,
    fetchReportDate,
    handleDateChange,
    handleBranchChange,
    handlePaymentChange,
    fetchGstReportData,
    handleGstDateChange,
    handleGstPaymentChange,
    fetchManagerReportData,
    handleManagerDateChange,
    handleManagerChange,
    setSelectedService,
    fetchAttendanceReportData
  };
};

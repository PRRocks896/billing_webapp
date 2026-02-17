import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';

import { getAuditorStaffDetailReport, getReportList, getGstReportList, getManagerList, getStaffSalaryReport, getAttendanceStaffReport, getManagerInsentiveReport, getAuditorReport } from "../../../service/report";
import { listPayload, showToast } from "../../../utils/helper";
import { startLoading, stopLoading } from "../../../redux/loader";
import { getCompanyList } from "../../../service/company";
import { getPaymentTypeList } from "../../../service/paymentType";
import { getManager } from "../../../service/staff";
import { getUserList } from "../../../service/users";
import { getStaffList } from "../../../service/staff";
import { generateSlug } from "../../../utils/helper";

export const useReport = () => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.loggedInUser);
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

  const [attUserList, setAttUserList] = useState([]);
  const [selectedAttUser, setSelectedAttUser] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [attYear, setAttYear] = useState(new Date().getFullYear());
  const [attMonth, setAttMonth] = useState(new Date().getMonth() + 1);

  const [selectedInsentiveManager, setSelectedInsentiveManager] = useState(null);
  const [insentiveManagerYear, setInsentiveManagerYear] = useState(new Date().getFullYear());
  const [insentiveManagerMonth, setInsentiveManagerMonth] = useState(new Date().getMonth() + 1);
  const [salesType, setSalesType] = useState(0);
  const [weekDays, setWeekDays] = useState(null);
  const [weekDaysPercentage, setWeekDaysPercentage] = useState(null);
  const [weekEnd, setweekEnd] = useState(null);
  const [weekEndPercentage, setWeekEndPercentage] = useState(null);

  const [auditoDateRange, setAuditoDateRange] = useState([new Date(), new Date()]);
  const [auditorSelectedCompany, setAuditorSelectedCompany] = useState(null);
  const [selectedAuditorPayment, setSelectedAuditorPayment] = useState([]);

  const [auditorStaffSelectedCompany, setAuditorStaffSelectedCompany] = useState(null);
  const [auditorStaffSelectedBranch, setAuditorStaffSelectedBranch] = useState([]);

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

  const handleAuditorDateChange = (value) => {
    setAuditoDateRange(value);
  };
  
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
        setUserList([{value: null, label: 'All'}].concat(items));
      } else {
        showToast(response?.message, false);
        setUserList([]);
      }
    } catch (error) {
      showToast(error?.message, false);
    }
  }

  const fetchAttUserList = async () => {
    try {
      let whereCondition = {
        isActive: true,
        isDeleted: false,
      };
      const payload = listPayload(0, whereCondition, 100000);
      const response = await getUserList(payload);
      if (response?.success) {
        const items = response?.data?.rows?.filter((row) => row.roleID !== 1)?.map((row) => ({
          value: row.id,
          label: row.lastName,
        }));
        setAttUserList(items);
      } else {
        showToast(response?.message, false);
        setAttUserList([]);
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
      const response = await getStaffList(listPayload(0, ['admin', 'super admin'].includes(loggedInUser?.px_role?.name?.toLowerCase()) ? {...whereCondition, searchText: "MANAGER"} : {...whereCondition, searchText: "MANAGER"}, 100000)); //getManager(whereCondition);
      if(response && response.success) {
        const payload = response.data?.rows;
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
    // if (user.roleID === 1) {
      fetchBranch();
      fetchPaymentType();
      fetchManager();
      fetchAttUserList();
    // }
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
      const response = await getStaffSalaryReport(body, generateSlug(`${selectedCompany?.label}_salary_report_${year}_${month}.xlsx`.toLowerCase()));
      setPdfData(response);
    } catch(error) {
      showToast("No report found", false);
    } finally {
      dispatch(stopLoading());
    }
  }

  const fetchInsentiveManagerReportData = async () => {
    try {
      dispatch(startLoading());
      setPdfData(null);
      const managerName = managerList.find((manager) => manager.id === selectedInsentiveManager);
      let body = {
        manegerID: selectedInsentiveManager,
        year: insentiveManagerYear,
        month: insentiveManagerMonth,
        // weekDays: weekDays,
        // weekDaysPercentage: weekDaysPercentage,
        // weekEnd: weekEnd,
        // weekEndPercentage: weekEndPercentage
      };
      if(salesType === 0) {
        body = {
          ...body,
          amount1: weekDays,
          percentage1: weekDaysPercentage,
          amount2: weekEnd,
          percentage2: weekEndPercentage
        }
      } else {
        body = {
          ...body,
          weekDays: weekDays,
          weekDaysPercentage: weekDaysPercentage,
          weekEnd: weekEnd,
          weekEndPercentage: weekEndPercentage
        }
      }
      const response = await getManagerInsentiveReport(body, generateSlug(`${managerName.nickName}_(${managerName.name})_insentive_report_${insentiveManagerYear}_${insentiveManagerMonth}.xlsx`.toLowerCase()));
      // setPdfData(response);
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

  const fetchStaffList = async (userId = null) => {
    try {
      const whereCondition = {
        isActive: true,
        isDeleted: false,
        userId: userId ? userId : selectedAttUser ? selectedAttUser : null,
      };
      const payload = listPayload(0, whereCondition, 100000);
      const response = await getStaffList(payload);
      if (response?.success) {
        const items = response?.data?.rows?.map((row) => ({
          value: row.id,
          label: row.name,
          nickName: row.nickName
        }));
        setStaffList(items);
      } else {
        showToast(response?.message, false);
        setStaffList([]);
      }
    } catch (error) {
      showToast(error?.message, false);
    }
  }

  const fetchStaffAttendanceReportData = async () => {
    try {
      dispatch(stopLoading());
      setPdfData(null);
      const payload = {
        branchID: selectedAttUser ? selectedAttUser : null,
        staffID: selectedStaff ? selectedStaff : null,
        year: attYear,
        month: attMonth,
      }
      const response = await getAttendanceStaffReport(payload, generateSlug(`attendance_report_${selectedAttUser ? selectedAttUser.label : 'all'}_${attYear}_${attMonth}.pdf`.toLowerCase()));
      if(response?.success) {
        setPdfData(response.data);
      } else {
        setPdfData(null);
      }
    } catch (error) {
      showToast("No report found", false);
    } finally {
      dispatch(stopLoading());
    }
  }

  const fetchAuditorStaffReportData = async () => {
    try {
      dispatch(startLoading());
      const branches = auditorStaffSelectedBranch.filter((item) => item.value).map((item) => item?.value)
      let payload = {
        companyID: auditorStaffSelectedCompany,
        // branchID: auditorStaffSelectedBranch.filter((item) => item.value).map((item) => item?.value)
      }
      if(branches.length > 0) {
        payload = {
          ...payload,
          branchID: branches
        }
      }
      await getAuditorStaffDetailReport(payload, generateSlug(`${companyOptions.find((item) => item.value === auditorStaffSelectedCompany)?.label}_auditor_staff_detail_report.xlsx`.toLowerCase()));
    } catch (error) {
      showToast("No report found", false);
    } finally {
      dispatch(stopLoading());
    }
  }

  const fetchAuditorReportData = async () => {
    try {
      dispatch(startLoading());
      setPdfData(null);
      const payload = {
        paymentID: selectedAuditorPayment,
        companyID: auditorSelectedCompany && auditorSelectedCompany?.value,
        // startDate: auditoDateRange[0],
        // endDate: auditoDateRange[1],
        // companyID: selectedCompany && selectedCompany?.value,
        // paymentID: selectedPayment,
        // userID: user.roleID !== 1 ? user.id : branch.value,
        startDate: moment(auditoDateRange[0]).format('yyyy-MM-DD'), //formatDate(dateRange[0]),
        endDate: moment(auditoDateRange[1]).format('yyyy-MM-DD') //formatDate(dateRange[1]),
      }
      const response = await getAuditorReport(payload, generateSlug(`${auditorSelectedCompany?.label}_report_${moment(auditoDateRange[0]).format('yyyy-MM-DD')}_to_${moment(auditoDateRange[1]).format('yyyy-MM-DD')}.xlsx`.toLowerCase()));
      if(response?.success) {
        setPdfData(response.data);
      } else {
        setPdfData(null);
      }
    } catch (error) {
      showToast("No report found", false);
    } finally {
      dispatch(stopLoading());
    }
  }

  // useEffect(() => {
  //   fetchReportDate();
  // }, [fetchReportDate]);

  return {
    // branch,
    attUserList,
    selectedAttUser,
    setSelectedAttUser,
    fetchStaffList,
    attMonth,
    setAttMonth,
    attYear,
    setAttYear,
    selectedStaff,
    setSelectedStaff,
    staffList,
    year,
    month,
    userList,
    selectedUser,
    setSelectedUser,
    pdfData,
    dateRange,
    gstDateRange,
    managerDateRange,
    auditoDateRange,
    auditorSelectedCompany,
    setAuditorSelectedCompany,
    selectedAuditorPayment,
    setSelectedAuditorPayment,
    handleAuditorDateChange,
    fetchAuditorReportData,
    managerList,
    paymentList,
    // branchOptions,
    selectedCompany,
    companyOptions,
    serviceList,
    selectedService,
    roleId: user.roleID,
    selectedInsentiveManager,
    setSelectedInsentiveManager,
    insentiveManagerYear,
    setInsentiveManagerYear,
    insentiveManagerMonth,
    setInsentiveManagerMonth,
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
    fetchAttendanceReportData,
    fetchStaffAttendanceReportData,
    fetchInsentiveManagerReportData,
    setSalesType,
    salesType,
    weekDays,
    weekDaysPercentage,
    weekEnd,
    weekEndPercentage,
    setWeekDays,
    setWeekDaysPercentage,
    setweekEnd,
    setWeekEndPercentage,
    auditorStaffSelectedBranch,
    auditorStaffSelectedCompany,
    setAuditorStaffSelectedBranch,
    setAuditorStaffSelectedCompany,
    fetchAuditorStaffReportData
  };
};

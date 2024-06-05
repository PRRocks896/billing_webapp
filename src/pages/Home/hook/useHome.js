import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';

import { fetchDashboardDetails } from "../../../service/home";
import { searchViaDashboard } from "../../../service/bill";
import { getUserList } from "../../../service/users";
import { startLoading, stopLoading } from "../../../redux/loader";
import { listPayload, showToast } from "../../../utils/helper";
// import { useSelector } from "react-redux";

const currentDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

export const useHome = () => {
  const dispatch = useDispatch();

  const [details, setDetails] = useState();
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [branch, setBranch] = useState([]);
  const [billList, setBillList] = useState([]);
  const user = useSelector((state) => state.loggedInUser);
  // const loggedInUser = useSelector((state) => state.loggedInUser);

  const isAdmin = useMemo(() => {
    return user && user.px_role && user.px_role.name && ['super admin', 'admin'].includes(user.px_role.name.toLowerCase())
  }, [user]);

  const handleDateChange = (value) => {
    setDateRange(value);
  };

  const handleBranchChange = (newValue) => {
    setBranch(newValue);
  };

  const fetchDashboardData = async () => {
    try {
      const params = { currentDate: currentDate() };
      const {success, message, data} = await fetchDashboardDetails(params);
      if(success) {
        setDetails({
          counts: {
            customerCount: data.counts.customerCount,
            staffCount: data.counts.staffCount,
            serviceCount: data.counts.serviceCount,
            billCount: data.counts.billCount,
          }
        });
      } else {
        showToast(message, false);
      }
    } catch (error) {
      showToast(error?.message, false);
    }
  };

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

  const fetchDailyReport = async () => {
    try {
      dispatch(startLoading());
      const body = {
        where: {
          searchText: '',
          isActive: true,
          isDeleted: false,
          userID: branch,
          startDate: moment(dateRange[0]).format('yyyy-MM-DD'), //formatDate(dateRange[0]),
          endDate: moment(dateRange[1]).format('yyyy-MM-DD') //formatDate(dateRange[1]),
        }
      };
      const response = await searchViaDashboard(body);
      if(response?.statusCode === 200) {
        setBillList(response.data)
      } else {
        showToast(response?.message);
      }
    } catch(err) {
      showToast(err?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  }

  useEffect(() => {
    fetchDashboardData();
    fetchBranch();
  }, []);

  // useEffect(() => {
  //   if (loggedInUser && loggedInUser?.id) {
  //     async function fetchCommonindexDBData() {
  //       let whereCondition = {
  //         isActive: true,
  //       };
  //       if (loggedInUser?.px_role?.name?.toLowerCase() !== "admin") {
  //         whereCondition = {
  //           ...whereCondition,
  //           createdBy: loggedInUser.id,
  //         };
  //       }
  //       const customeStaffbody = listPayload(0, whereCondition, 1000);
  //       const servicePaymentbody = listPayload(0, { isActive: true }, 1000);
  //       const [
  //         customerRepsonse,
  //         staffResponse,
  //         serviceResponse,
  //         paymentResponse,
  //       ] = await Promise.all([
  //         getCustomerList(customeStaffbody),
  //         getStaffList(customeStaffbody),
  //         getServiceList(servicePaymentbody),
  //         getPaymentTypeList(servicePaymentbody),
  //       ]);
  //       if (customerRepsonse?.statusCode === 200) {
  //         const payload = customerRepsonse?.data?.rows?.map((row) => ({
  //           ...row,
  //           flag: 0,
  //         }));
  //         await addData(Stores.Customer, payload, "bulk");
  //       } else if (customerRepsonse?.statusCode === 404) {
  //         const payload = [];
  //         await addData(Stores.Customer, payload, "bulk");
  //       }
  //       if (staffResponse?.statusCode === 200) {
  //         const payload = staffResponse?.data?.rows;
  //         await addData(Stores.Staff, payload, "bulk");
  //       } else if (staffResponse?.statusCode === 404) {
  //         const payload = [];
  //         await addData(Stores.Staff, payload, "bulk");
  //       }
  //       if (serviceResponse?.statusCode === 200) {
  //         const payload = serviceResponse?.data?.rows;
  //         await addData(Stores.Service, payload, "bulk");
  //       } else if (serviceResponse?.statusCode === 404) {
  //         const payload = [];
  //         await addData(Stores.Service, payload, "bulk");
  //       }
  //       if (paymentResponse?.statusCode === 200) {
  //         const payload = paymentResponse?.data?.rows;
  //         await addData(Stores.Payment, payload, "bulk");
  //       } else if (paymentResponse?.statusCode === 404) {
  //         const payload = [];
  //         await addData(Stores.Payment, payload, "bulk");
  //       }
  //     }
  //     fetchCommonindexDBData();
  //   }
  // }, [loggedInUser]);

  return {
    isAdmin,
    billList,
    details,
    dateRange,
    branchOptions,
    fetchDailyReport,
    handleDateChange,
    handleBranchChange
  };
};

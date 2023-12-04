import { useEffect, useState } from "react";
import { fetchDashboardDetails } from "../../../service/home";
import { showToast } from "../../../utils/helper";
// import { useSelector } from "react-redux";

const currentDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

export const useHome = () => {
  const [details, setDetails] = useState();
  // const loggedInUser = useSelector((state) => state.loggedInUser);

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

  useEffect(() => {
    fetchDashboardData();
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
    details,
  };
};

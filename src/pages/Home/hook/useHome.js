import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { fetchDashboardDetails } from "../../../service/home";
import { listPayload, showToast } from "../../../utils/helper";
import { useSelector } from "react-redux";
import { getStaffList } from "../../../service/staff";
import { Stores, addData } from "../../../utils/db";
import { getCustomerList } from "../../../service/customer";
import { getServiceList } from "../../../service/service";
import { getPaymentTypeList } from "../../../service/paymentType";

const currentDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

export const useHome = () => {
  const [details, setDetails] = useState();
  const loggedInUser = useSelector((state) => state.loggedInUser);
  // const userRole = loggedInUser?.px_role?.name?.toLowerCase();

  // const handleInitDB = async () => {
  //   const status = await initDB();
  //   console.log("rk", status);
  //   // setIsDBReady(status);
  // };

  // useLayoutEffect(() => {
  //   handleInitDB();
  // }, []);

  const fetchDashboardData = async () => {
    try {
      const params = { currentDate: currentDate() };
      const response = await fetchDashboardDetails(params);
      setDetails(response?.data);

      // const data = await getStoreData(Stores.Bills);
      // console.log("Bill data retriwing", data);
    } catch (error) {
      showToast(error?.message, false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // const insertBill = async () => {
  //   const payload = {
  //     billNo: "1",
  //     customer: "Customer",
  //     phone: 9879854706,
  //     item: "Malis",
  //     qty: 1,
  //     disc: 12,
  //     total: 5000000,
  //   };
  //   console.log(payload);
  //   const result = await addData(Stores.Bills, payload);
  //   if (result instanceof Error) {
  //     console.error("Error adding bill:", result.message);
  //   } else {
  //     console.log("Bill added:", result);
  //   }
  // };

  // useEffect(() => {
  //   setTimeout(() => {
  //     insertBill();
  //   }, 1000);
  // });

  useEffect(() => {
    if(loggedInUser && loggedInUser?.id) {
      async function fetchCommonindexDBData() {
        let whereCondition = {
          isActive: true,
        };
        if (loggedInUser?.px_role?.name?.toLowerCase() !== "admin") {
          whereCondition = {
            ...whereCondition,
            createdBy: loggedInUser.id,
          };
        }
        const customeStaffbody = listPayload(0, whereCondition, 1000);
        const servicePaymentbody = listPayload(0, { isActive: true }, 1000);
        const [
          customerRepsonse,
          staffResponse,
          serviceResponse,
          paymentResponse
        ] = await Promise.all([
          getCustomerList(customeStaffbody),
          getStaffList(customeStaffbody),
          getServiceList(servicePaymentbody),
          getPaymentTypeList(servicePaymentbody)
        ]);
        if (customerRepsonse?.statusCode === 200) {
          const payload = customerRepsonse?.data?.rows;
          await addData(Stores.Customer, payload, "bulk");
        } else if (customerRepsonse?.statusCode === 404) {
          const payload = [];
          await addData(Stores.Customer, payload, "bulk");
        }
        if (staffResponse?.statusCode === 200) {
          const payload = staffResponse?.data?.rows;
          await addData(Stores.Staff, payload, "bulk");
        } else if (staffResponse?.statusCode === 404) {
          const payload = [];
          await addData(Stores.Staff, payload, "bulk");
        }
        if (serviceResponse?.statusCode === 200) {
          const payload = serviceResponse?.data?.rows;
          await addData(Stores.Service, payload, "bulk");
        } else if (serviceResponse?.statusCode === 404) {
          const payload = [];
          await addData(Stores.Service, payload, "bulk");
        }
        if (paymentResponse?.statusCode === 200) {
          const payload = paymentResponse?.data?.rows;
          await addData(Stores.Payment, payload, "bulk");
        } else if (paymentResponse?.statusCode === 404) {
          const payload = [];
          await addData(Stores.Payment, payload, "bulk");
        }
      }
      fetchCommonindexDBData();
    }
  }, [loggedInUser])
  return {
    details,
  };
};

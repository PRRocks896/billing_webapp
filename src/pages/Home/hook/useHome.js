import { useEffect, useState } from "react";
import { fetchDashboardDetails } from "../../../service/home";
import { showToast } from "../../../utils/helper";

const currentDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

export const useHome = () => {
  const [details, setDetails] = useState();

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

  return {
    details,
  };
};

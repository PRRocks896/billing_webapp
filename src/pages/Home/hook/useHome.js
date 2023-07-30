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

  const fetchDashboardData = async () => {
    try {
      const params = { currentDate: currentDate() };
      const response = await fetchDashboardDetails(params);
      setDetails(response.data);
    } catch (error) {
      console.log(error);
      showToast(error.message, false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    details,
  };
};

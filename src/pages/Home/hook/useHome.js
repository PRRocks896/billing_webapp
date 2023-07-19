import { useEffect, useState } from "react";
import { fetchDashboardDetails } from "../../../service/home";
import { showToast } from "../../../utils/helper";

export const useHome = () => {
  const [details, setDetails] = useState();

  const fetchDashboardData = async () => {
    try {
      const resposen = await fetchDashboardDetails();
      console.log(resposen);
      setDetails(resposen.data);
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

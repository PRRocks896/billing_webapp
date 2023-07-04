import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getServiceList } from "../../../service/service";
import { showToast } from "../../../utils/helper";
import { serviceAction } from "../../../redux/service";

export const useService = () => {
  const dispatch = useDispatch();

  //  fetch staff logic
  const fetchServiceData = useCallback(async () => {
    try {
      const body = {
        where: {
          isActive: true,
          isDeleted: false,
        },
        pagination: {
          sortBy: "createdAt",
          descending: true,
          rows: 5,
          page: 1,
        },
      };
      const response = await getServiceList(body);
      //   console.log(response);
      if (response.statusCode === 200) {
        const payload = response.data.rows;
        dispatch(serviceAction.storeServices(payload));
      } else if (response.statusCode === 404) {
        const payload = [];
        dispatch(serviceAction.storeServices(payload));
      }
    } catch (error) {
      showToast(error.message, false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchServiceData();
  }, [fetchServiceData]);

  return {};
};

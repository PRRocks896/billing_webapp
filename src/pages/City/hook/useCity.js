import { useCallback, useEffect } from "react";
import { showToast } from "../../../utils/helper";
import { getCityList } from "../../../service/city";
import { cityAction } from "../../../redux/city";
import { useDispatch } from "react-redux";

export const useCity = () => {
  const dispatch = useDispatch();

  //  fetch city logic
  const fetchCityData = useCallback(async () => {
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
      const response = await getCityList(body);
      if (response.statusCode === 200) {
        const payload = response.data.rows;
        dispatch(cityAction.storeCity(payload));
      }
    } catch (error) {
      showToast(error.message, false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCityData();
  }, [fetchCityData]);

  return {};
};

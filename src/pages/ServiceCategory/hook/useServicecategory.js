import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { serviceCategoryAction } from "../../../redux/serviceCategory";
import { showToast } from "../../../utils/helper";
import { getServiceCategoryList } from "../../../service/serviceCategory";

export const useServiceCategory = () => {
  const dispatch = useDispatch();

  //  fetch staff logic
  const fetchServiceCategoryData = useCallback(async () => {
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
      const response = await getServiceCategoryList(body);
      console.log(response);
      if (response.statusCode === 200) {
        const payload = response.data.rows;
        dispatch(serviceCategoryAction.storeServiceCategories(payload));
      }
    } catch (error) {
      showToast(error.message, false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchServiceCategoryData();
  }, [fetchServiceCategoryData]);

  return {};
};

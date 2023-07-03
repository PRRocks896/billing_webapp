import { useCallback, useEffect } from "react";
import { showToast } from "../../../utils/helper";
import { getStatesList } from "../../../service/states";
import { statesAction } from "../../../redux/states";
import { useDispatch } from "react-redux";

export const useStates = () => {
  const dispatch = useDispatch();

  //  fetch staff logic
  const fetchStatesData = useCallback(async () => {
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
      const response = await getStatesList(body);
      console.log("response", response);
      if (response.statusCode === 200) {
        const payload = response.data.rows;
        dispatch(statesAction.storeStates(payload));
      }
    } catch (error) {
      showToast(error.message, false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchStatesData();
  }, [fetchStatesData]);

  return {};
};

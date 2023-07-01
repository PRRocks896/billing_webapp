import { useCallback, useEffect, useState } from "react";
import { showToast } from "../../utils/helper";
import { getStaffList } from "../../service/staff";
import { staffAction } from "../../redux/staff";
import { useDispatch } from "react-redux";

export const useStaff = () => {
  const dispatch = useDispatch();
  const [deleteId, setDeleteId] = useState("");

  //  fetch staff logic
  const fetchStaffData = useCallback(async () => {
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
      const response = await getStaffList(body);
      if (response.statusCode === 200) {
        const payload = response.data.rows;
        dispatch(staffAction.storeStaff(payload));
      }
    } catch (error) {
      showToast(error.message, false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchStaffData();
  }, [fetchStaffData]);

  // delete logic
  const setDeleteIdHandler = (id) => {
    setDeleteId(id);
  };
  const deleteStaff = () => {
    console.log(deleteId);
  };

  return {
    deleteStaff,
    setDeleteIdHandler,
  };
};

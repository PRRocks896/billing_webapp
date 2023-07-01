import { useEffect } from "react";
import { showToast } from "../../utils/helper";
import { getStaffList } from "../../service/staff";
import { staffAction } from "../../redux/staff";
import { useDispatch } from "react-redux";

export const useStaff = () => {
  const dispatch = useDispatch();

  const fetchStaffData = async () => {
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
        dispatch(staffAction.addStaff(payload));
      }
    } catch (error) {
      showToast(error.message, false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);
};

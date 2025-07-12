import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { getAttendanceList } from "../../../service/staff";
import { startLoading, stopLoading } from "../../../redux/loader";
import { showToast } from "../../../utils/helper";

export const useAttendanceListHomePage = () => {
  const dispatch = useDispatch();


  const [staffList, setStaffList] = useState([]);  

const AttendanceList = async () => {
    try {
      dispatch(startLoading());
      const body = {
          isActive: true,
          isDeleted: false,
      };
      const response = await getAttendanceList(body);
      if(response?.statusCode === 200) {
        setStaffList(response.data)
      } else {
        showToast(response?.message);
      }
    } catch(err) {
      showToast(err?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  }


  useEffect(() => {
    AttendanceList();
  }, []);

  return {
    staffList,
    refreshList: AttendanceList, 
  };
};

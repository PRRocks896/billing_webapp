import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getAttendanceList } from "../../../service/staff";
import { startLoading, stopLoading } from "../../../redux/loader";
import { showToast } from "../../../utils/helper";

export const useAttendanceListHomePage = () => {
  const dispatch = useDispatch();


  const [staffList, setStaffList] = useState([]);  

  const user = useSelector((state) => state.loggedInUser);
  const isAdmin = useMemo(() => {
    return user && user.px_role && user.px_role.name && ['super admin', 'admin'].includes(user.px_role.name.toLowerCase())
  }, [user]);

const AttendanceList = async () => {
    try {
      dispatch(startLoading());
      let body = {
        isActive: true,
        isDeleted: false,
      };
      if(!isAdmin) {
        body = {
          ...body,
          createdBy: user?.id,
        };
      }
      const response = await getAttendanceList(body);
      if(response?.statusCode === 200) {
        setStaffList([...response.data, ...response.data, ...response.data, ...response.data])
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

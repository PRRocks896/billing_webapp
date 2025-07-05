import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAttendanceList } from "../../../service/staff";
import { showToast } from "../../../utils/helper";

const currentDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

export const useAttendanceListHomepage = () => {
  const dispatch = useDispatch();

  const [details, setDetails] = useState();
  const [loginList, setLoginList] = useState([]);
  const [dateRange] = useState([new Date(), new Date()]);
  const [branchOptions] = useState([]);
  const [billList] = useState([]);

  const user = useSelector((state) => state.loggedInUser);

  const isAdmin = useMemo(() => {
    return user && user.px_role && user.px_role.name &&
      ['super admin', 'admin'].includes(user.px_role.name.toLowerCase());
  }, [user]);

  const fetchAttendanceList = async () => {
    try {
      const params = { currentDate: currentDate() };
      const { success, message, data } = await getAttendanceList(params);

      if (success) {
        setDetails({
          counts: {
            customerCount: data.counts.customerCount,
            staffCount: data.counts.staffCount,
            serviceCount: data.counts.serviceCount,
            billCount: data.counts.billCount,
          }
        });

        // Store loginList
        if (Array.isArray(data.loginList)) {
          setLoginList(data.loginList);
        }

      } else {
        showToast(message, false);
      }
    } catch (error) {
      showToast(error?.message, false);
    }
  };

  useEffect(() => {
    fetchAttendanceList();
  }, []);

  return {
    isAdmin,
    billList,
    details,
    dateRange,
    branchOptions,
    loginList, // ✅ returning login list
  };
};

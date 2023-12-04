import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';

import { getReportList } from "../../../service/report";
import { listPayload, showToast } from "../../../utils/helper";
import { startLoading, stopLoading } from "../../../redux/loader";
import { getUserList } from "../../../service/users";

export const useReport = () => {
  const dispatch = useDispatch();
  const [pdfData, setPdfData] = useState(null);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [branch, setBranch] = useState("");
  const user = useSelector((state) => state.loggedInUser);

  const handleDateChange = (value) => {
    setDateRange(value);
  };
  const handleBranchChange = (newValue) => {
    setBranch(newValue);
  };

  const fetchBranch = async () => {
    try {
      const body = listPayload(0, {}, 1000);

      const response = await getUserList(body);
      if (response?.statusCode === 200) {
        const payload = response?.data?.rows;
        const branchOption = payload.map((row) => ({
          value: row.id,
          label: row.branchName,
        }));
        setBranchOptions([{value: null, label: 'All'}].concat(branchOption));
      } else if (response?.statusCode === 404) {
        const payload = [];
        setBranchOptions(payload);
      }
    } catch (error) {
      showToast(error?.message, false);
    }
  };

  useEffect(() => {
    if (user.roleID === 1) {
      fetchBranch();
    }
  }, [user.roleID]);

  const fetchReportDate = useCallback(async () => {
    try {
      setPdfData(null);
      dispatch(startLoading());

      const body = {
        userID: user.roleID !== 1 ? user.id : branch.value,
        startDate: moment(dateRange[0]).format('yyyy-MM-DD'), //formatDate(dateRange[0]),
        endDate: moment(dateRange[1]).format('yyyy-MM-DD') //formatDate(dateRange[1]),
      };
      const response = await getReportList(body);
      setPdfData(response);
    } catch (error) {
      showToast("No report found", false);
    } finally {
      dispatch(stopLoading());
    }
  }, [branch, dateRange, dispatch, user.id, user.roleID]);

  useEffect(() => {
    fetchReportDate();
  }, [fetchReportDate]);

  return {
    pdfData,
    dateRange,
    handleDateChange,
    roleId: user.roleID,
    branchOptions,
    branch,
    handleBranchChange,
  };
};

import { useDispatch, useSelector } from "react-redux";
import { getReportList } from "../../../service/report";
// import { reportAction } from "../../../redux/report";
import { showToast } from "../../../utils/helper";
import { startLoading, stopLoading } from "../../../redux/loader";
import { useCallback, useEffect, useState } from "react";
import { getUserList } from "../../../service/users";

function formatDate(date) {
  const isoDate = date.toISOString();

  const year = isoDate.slice(0, 4);
  const month = isoDate.slice(5, 7);
  const day = isoDate.slice(8, 10);

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

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
      const body = {
        where: {
          // isActive: true,
          isDeleted: false,
          searchText: "",
        },
        pagination: {
          sortBy: "createdAt",
          descending: true,
          rows: 1000,
          page: 1,
        },
      };
      const response = await getUserList(body);
      if (response.statusCode === 200) {
        const payload = response.data.rows;
        const branchOption = payload.map((row) => ({
          value: row.id,
          label: row.branchName,
        }));
        setBranchOptions(branchOption);
      } else if (response.statusCode === 404) {
        const payload = [];
        setBranchOptions(payload);
      }
    } catch (error) {
      showToast(error.message, false);
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
        startDate: formatDate(dateRange[0]),
        endDate: formatDate(dateRange[1]),
      };
      if (body.userID) {
        const response = await getReportList(body);
        setPdfData(response);
      }
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

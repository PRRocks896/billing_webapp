import { useDispatch } from "react-redux";
import { getReportList } from "../../../service/report";
// import { reportAction } from "../../../redux/report";
import { showToast } from "../../../utils/helper";
import { startLoading, stopLoading } from "../../../redux/loader";
import { useCallback, useEffect, useState } from "react";

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

  const handleDateChange = (value) => {
    setDateRange(value);
  };

  const fetchReportDate = useCallback(async () => {
    try {
      setPdfData(null);
      dispatch(startLoading());

      const body = {
        userID: 1,
        startDate: formatDate(dateRange[0]),
        endDate: formatDate(dateRange[1]),
      };
      console.log(body);
      const response = await getReportList(body);
      console.log("report response", response);
      setPdfData(response);
    } catch (error) {
      showToast("No report found", false);
    } finally {
      dispatch(stopLoading());
    }
  }, [dateRange, dispatch]);

  useEffect(() => {
    fetchReportDate();
  }, [fetchReportDate]);

  return { pdfData, dateRange, handleDateChange };
};

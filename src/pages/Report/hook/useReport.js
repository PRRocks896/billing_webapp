import { useDispatch } from "react-redux";
import { getReportList } from "../../../service/report";
// import { reportAction } from "../../../redux/report";
import { showToast } from "../../../utils/helper";
import { startLoading, stopLoading } from "../../../redux/loader";
import { useForm } from "react-hook-form";
import { useState } from "react";

export const useReport = () => {
  const dispatch = useDispatch();
  const [pdfData, setPdfData] = useState(null);

  const { handleSubmit } = useForm({
    defaultValues: {
      startDate: "2023-06-30",
      endDate: "2023-07-30",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      dispatch(startLoading());
      const body = {
        userID: 1,
        startDate: "2023-06-30",
        endDate: "2023-07-30",
      };
      const response = await getReportList(body);
      console.log("report response", response);
      setPdfData(response);
    } catch (error) {
      showToast(error.message, false);
    } finally {
      dispatch(stopLoading());
    }
  };

  return { handleSubmit, onSubmit, pdfData };
};

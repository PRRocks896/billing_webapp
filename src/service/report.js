import { REPORT_LIST_API } from "../utils/constant";
import { post } from "./webRequest";

export const getReportList = async (body) => {
  const response = await post(REPORT_LIST_API, body);
  return response;
};

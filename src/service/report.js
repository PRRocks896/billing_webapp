import { REPORT_LIST_API } from "../utils/constant";
import { getXlsx } from "./webRequest";

export const getReportList = async (body) => {
  const response = await getXlsx(REPORT_LIST_API, body);
  return response;
};

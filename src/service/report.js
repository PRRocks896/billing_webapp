import { REPORT_LIST_API } from "../utils/constant";
import { getPDF } from "./webRequest";

export const getReportList = async (body) => {
  const response = await getPDF(REPORT_LIST_API, body);
  return response;
};

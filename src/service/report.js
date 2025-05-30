import { REPORT_LIST_API, GST_REPORT_LIST_API } from "../utils/constant";
import { getXlsx } from "./webRequest";

export const getReportList = async (body) => {
  const response = await getXlsx(REPORT_LIST_API, body);
  return response;
};

export const getGstReportList = async (body, fileName) => {
  const response = await getXlsx(GST_REPORT_LIST_API, body, fileName);
  return response;
}

export const getManagerList = async (body, serviceName, fileName) => {
  return await getXlsx(`api/${serviceName}/manager`, body, fileName);
}

export const getStaffSalaryReport = async (body, fileName) => {
  return await getXlsx(`api/staff/auto-calculation-staff-salary-details`, body, fileName);
}
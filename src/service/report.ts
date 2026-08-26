import { REPORT_LIST_API, GST_REPORT_LIST_API } from "../utils/constant";
import { getxlsx, getpdf, post } from "../utils/axios";

export const getReportList = async (body: any) => {
    return await getxlsx(REPORT_LIST_API, body);
};

export const getGstReportList = async (body: any, fileName: string) => {
    return await getxlsx(GST_REPORT_LIST_API, body, fileName);
}

export const getManagerList = async (body: any, serviceName: string, fileName: string) => {
    return await getxlsx(`api/${serviceName}/manager`, body, fileName);
}

export const getStaffSalaryReport = async (body: any, fileName: string) => {
    return await getxlsx(`api/staff/auto-calculation-staff-salary-details`, body, fileName);
}

export const getAttendanceStaffReport = async (body: any, fileName: string) => {
    return await getpdf(`api/attendance/attendance-report`, body, fileName, false);
}

export const getManagerInsentiveReport = async (body: any, fileName: string) => {
    return await getxlsx(`api/report/manager-incentive-details`, body, fileName);
}

export const getAuditorReport = async (body: any, fileName: string) => {
    return await getxlsx(`api/report/gst-sale-purchase`, body, fileName);
}

export const getSalaryBranchWiseReport = async (body: any) => {
    return await post(`api/report/salary-branch-wise-list`, body);
}

export const getAuditorStaffDetailReport = async (body: any, fileName: string) => {
    return await getxlsx(`api/staff/auditor-staff-details-fetch`, body, fileName);
}

export const getBillDetailVerifyStatementReport = async (body: any, fileName: string) => {
    return await getxlsx('/api/report/bill-details-verify-statement', body, fileName, true);
}
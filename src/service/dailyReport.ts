import {
    DAILYREPORT,
    REPORT_LIST_API
} from "../utils/constant";
import { getpdf, get, post, del, put } from "../utils/axios";

export const downloadDailyReport = async (payload: any, fileName: string) => {
    return await getpdf(`${DAILYREPORT}/download`, payload, fileName, true);
}

export const getDailyReportList = async (body: any) => {
    const response = await post(`${DAILYREPORT}/list`, body);
    return response;
};

export const createDailyReport = async (body: any) => {
    const response = await post(DAILYREPORT, body);
    return response;
};

export const getDailyReportById = async (id: number) => {
    const response = await get(`${DAILYREPORT}/${id}`);
    return response;
};

export const getDailyReportByPayload = async (payload: any) => {
    return await post(`${DAILYREPORT}/check-pending`, payload);
}

export const updateDailyReport = async (payload: any, id: number) => {
    const response = await put(`${DAILYREPORT}/${id}`, payload);
    return response;
};

export const deleteDailyReport = async (id: number) => {
    const response = await del(`${DAILYREPORT}/${id}`);
    return response;
};

export const getSalesExpenseReport = async (payload: any) => {
    return await post(`${DAILYREPORT}/sales-expense`, payload);
}

export const getLowSalesBranchReport = async (payload: any) => {
    return await post(`${REPORT_LIST_API}/branch-sales-low`, payload);
}

export const getManagerSalesReport = async (payload: any) => {
    return await post(`${REPORT_LIST_API}/maneger-sales-top`, payload);
}

export const getDailyDetail = async (payload: any) => {
    return await post(`${REPORT_LIST_API}/datails-api`, payload);
}

export const getMonthSale = async (payload: any) => {
    return await post(`${REPORT_LIST_API}/chart-sales-reports`, payload);
}

export const getDailyDetailReport = async (payload: any) => {
    return await post(`${DAILYREPORT}/daily-report-details`, payload);
}
import {
    DAILYREPORT
} from "../utils/constant";
import { getPDF, get, post, remove, put } from "./webRequest";

export const downloadDailyReport = async (payload) => {
    // return await post(`${DAILYREPORT}/download`, payload);
    return await getPDF(`${DAILYREPORT}/download`, payload, `Green_Day_Daily_Report_${new Date().toDateString()}.pdf`);
}

export const getDailyReportList = async (body) => {
    const response = await post(`${DAILYREPORT}/list`, body);
    return response;
};

export const createDailyReport = async (body) => {
    const response = await post(DAILYREPORT, body);
    return response;
};

export const getDailyReportById = async (id) => {
    const response = await get(`${DAILYREPORT}/${id}`);
    return response;
};

export const getDailyReportByPayload = async (payload) => {
    return await post(`${DAILYREPORT}/get`, payload);
}

export const updateDailyReport = async (payload, id) => {
    const response = await put(`${DAILYREPORT}/${id}`, payload);
    return response;
};

export const deleteDailyReport = async (id) => {
    const response = await remove(`${DAILYREPORT}/${id}`);
    return response;
};


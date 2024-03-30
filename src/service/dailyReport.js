import {
    DAILYREPORT
} from "../utils/constant";
import { get, post, remove, put } from "./webRequest";

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

export const updateDailyReport = async (payload, id) => {
    const response = await put(`${DAILYREPORT}/${id}`, payload);
    return response;
};

export const deleteDailyReport = async (id) => {
    const response = await remove(`${DAILYREPORT}/${id}`);
    return response;
};


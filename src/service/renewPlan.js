import {
    RENEWPLAN
} from "../utils/constant";
import { get, post, remove, put } from "./webRequest";

export const renewPlanExtraHoursOtp = async (payload) => {
    return await post(`${RENEWPLAN}/extra-hours-otp`, payload);
}

export const getRenewPlan = async (body) => {
    const response = await post(`${RENEWPLAN}/get`, body);
    return response;
}

export const getRenewPlanList = async (body) => {
    const response = await post(`${RENEWPLAN}/list`, body);
    return response;
};

export const createRenewPlan = async (body) => {
    const response = await post(RENEWPLAN, body);
    return response;
};

export const getRenewPlanById = async (id) => {
    const response = await get(`${RENEWPLAN}/${id}`);
    return response;
};

export const updateRenewPlan = async (payload, id) => {
    const response = await put(`${RENEWPLAN}/${id}`, payload);
    return response;
};

export const deleteRenewPlan = async (id) => {
    const response = await remove(`${RENEWPLAN}/${id}`);
    return response;
};


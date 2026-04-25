import {
    RENEWPLAN
} from "../utils/constant";
import { get, post, del, put } from "../utils/axios";

export const renewPlanExtraHoursOtp = async (payload: any) => {
    return await post(`${RENEWPLAN}/extra-hours-otp`, payload);
}

export const getRenewPlan = async (body: any) => {
    const response = await post(`${RENEWPLAN}/get`, body);
    return response;
}

export const getRenewPlanList = async (body: any) => {
    const response = await post(`${RENEWPLAN}/list`, body);
    return response;
};

export const createRenewPlan = async (body: any) => {
    const response = await post(RENEWPLAN, body);
    return response;
};

export const getRenewPlanById = async (id: number) => {
    const response = await get(`${RENEWPLAN}/${id}`);
    return response;
};

export const updateRenewPlan = async (payload: any, id: number) => {
    const response = await put(`${RENEWPLAN}/${id}`, payload);
    return response;
};

export const deleteRenewPlan = async (id: number) => {
    const response = await del(`${RENEWPLAN}/${id}`);
    return response;
};


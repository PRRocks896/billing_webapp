import {
    MEMBERSHIP_PLAN
} from "../utils/constant";
import { get, post, remove, put } from "./webRequest";

export const getMembershipPlanList = async (body) => {
    const response = await post(`${MEMBERSHIP_PLAN}/list`, body);
    return response;
};

export const createMembershipPlan = async (body) => {
    const response = await post(MEMBERSHIP_PLAN, body);
    return response;
};

export const getMembershipPlanById = async (id) => {
    const response = await get(`${MEMBERSHIP_PLAN}/${id}`);
    return response;
};

export const updateMembershipPlan = async (payload, id) => {
    const response = await put(`${MEMBERSHIP_PLAN}/${id}`, payload);
    return response;
};

export const deleteMembershipPlan = async (id) => {
    const response = await remove(`${MEMBERSHIP_PLAN}/${id}`);
    return response;
};


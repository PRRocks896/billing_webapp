import {
    MEMBERSHIP_PLAN
} from "../utils/constant";
import { get, post, del, put } from "../utils/axios";

export const getMembershipPlanList = async (body: any) => {
    return await post(`${MEMBERSHIP_PLAN}/list`, body);
};

export const getMembershipPlanViaPayload = async (body: any) => {
    return await post(`${MEMBERSHIP_PLAN}/find`, body);
};

export const createMembershipPlan = async (body: any) => {
    return await post(MEMBERSHIP_PLAN, body);
};

export const getMembershipPlanById = async (id: number) => {
    return await get(`${MEMBERSHIP_PLAN}/${id}`);
};

export const updateMembershipPlan = async (payload: any, id: number) => {
    return await put(`${MEMBERSHIP_PLAN}/${id}`, payload);
};

export const deleteMembershipPlan = async (id: number) => {
    return await del(`${MEMBERSHIP_PLAN}/${id}`);
};


import {
    MEMBERSHIP
} from "../utils/constant";
import { get, post, del, put } from "../utils/axios";

export const getMembershipList = async (body: any) => {
    return await post(`${MEMBERSHIP}/list`, body);
};

export const getMembershipViaPayload = async (body: any) => {
    return await post(`${MEMBERSHIP}/find`, body);
}

export const createMembership = async (body: any) => {
    return await post(MEMBERSHIP, body);
};

export const getMembershipById = async (id: number) => {
    return await get(`${MEMBERSHIP}/${id}`);
};

export const updateMembership = async (payload: any, id: number) => {
    return await put(`${MEMBERSHIP}/${id}`, payload);
};

export const deleteMembership = async (id: number) => {
    return await del(`${MEMBERSHIP}/${id}`);
};

export const addExtraHours = async (payload: any) => {
    return await post(`${MEMBERSHIP}/extra-hours-otp`, payload);
}
import {
    MEMBERSHIP
} from "../utils/constant";
import { get, post, remove, put } from "./webRequest";

export const addPastMembership = async (payload) => {
    return await post(`${MEMBERSHIP}/past-membership`, payload);
}

export const addExtraHours = async (payload) => {
    return await post(`${MEMBERSHIP}/extra-hours-otp`, payload);
}

export const getMembership = async (body) => {
    const response = await post(`${MEMBERSHIP}/get`, body);
    return response;
}

export const getMembershipList = async (body) => {
    const response = await post(`${MEMBERSHIP}/list`, body);
    return response;
};

export const createMembership = async (body) => {
    const response = await post(MEMBERSHIP, body);
    return response;
};

export const getMembershipById = async (id) => {
    const response = await get(`${MEMBERSHIP}/${id}`);
    return response;
};

export const updateMembership = async (payload, id) => {
    const response = await put(`${MEMBERSHIP}/${id}`, payload);
    return response;
};

export const deleteMembership = async (id) => {
    const response = await remove(`${MEMBERSHIP}/${id}`);
    return response;
};


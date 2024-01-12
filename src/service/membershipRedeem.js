import {
    MEMBERSHIP_REDEEM
} from "../utils/constant";
import { get, post, remove, put } from "./webRequest";

export const getMembershipRedeemList = async (body) => {
    const response = await post(`${MEMBERSHIP_REDEEM}/list`, body);
    return response;
};

export const createMembershipRedeem = async (body) => {
    const response = await post(MEMBERSHIP_REDEEM, body);
    return response;
};

export const getMembershipRedeemById = async (id) => {
    const response = await get(`${MEMBERSHIP_REDEEM}/${id}`);
    return response;
};

export const updateMembershipRedeem = async (payload, id) => {
    const response = await put(`${MEMBERSHIP_REDEEM}/${id}`, payload);
    return response;
};

export const deleteMembershipRedeem = async (id) => {
    const response = await remove(`${MEMBERSHIP_REDEEM}/${id}`);
    return response;
};


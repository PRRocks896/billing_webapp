import {
    MEMBERSHIP_REDEEM
} from "../utils/constant";
import { get, post, del, put } from "../utils/axios";

export const getMembershipRedeemList = async (body: any) => {
    return await post(`${MEMBERSHIP_REDEEM}/list`, body);
};

export const getMembershipRedeemViaPayload = async (body: any) => {
    return await post(`${MEMBERSHIP_REDEEM}/find`, body);
}

export const createMembershipRedeem = async (body: any) => {
    return await post(MEMBERSHIP_REDEEM, body);
};

export const getMembershipRedeemById = async (id: number) => {
    return await get(`${MEMBERSHIP_REDEEM}/${id}`);
};

export const updateMembershipRedeem = async (payload: any, id: number) => {
    return await put(`${MEMBERSHIP_REDEEM}/${id}`, payload);
};

export const deleteMembershipRedeem = async (id: number) => {
    return await del(`${MEMBERSHIP_REDEEM}/${id}`);
};
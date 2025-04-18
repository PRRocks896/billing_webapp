import {
    COUPON
} from "../utils/constant";
import { get, post, remove, put } from "./webRequest";

export const getCoupon = async (body) => {
    const response = await post(`${COUPON}/get`, body);
    return response;
}

export const getCouponList = async (body) => {
    const response = await post(`${COUPON}/list`, body);
    return response;
};

export const createCoupon = async (body) => {
    const response = await post(COUPON, body);
    return response;
};

export const getCouponById = async (id) => {
    const response = await get(`${COUPON}/${id}`);
    return response;
};

export const updateCoupon = async (payload, id) => {
    const response = await put(`${COUPON}/${id}`, payload);
    return response;
};

export const deleteCoupon = async (id) => {
    const response = await remove(`${COUPON}/${id}`);
    return response;
};


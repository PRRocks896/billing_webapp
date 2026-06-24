import {
    REDEEMBOOKING
} from "../utils/constant";
import {
    post,
    put,
    get,
    del
} from "../utils/axios";

export const verifyBooking = async (body: any) => {
    return await post('/api/booking-service/get', body);
};

export const getRedeemBookingList = async (body: any) => {
    return await post(`${REDEEMBOOKING}/list`, body);
};

export const createRedeemBooking = async (body: any) => {
    return await post(REDEEMBOOKING, body);
};

export const deleteRedeemBooking = async (id: number) => {
    return await del(`${REDEEMBOOKING}/${id}`);
};

export const getRedeemBookingById = async (id: number) => {
    return await get(`${REDEEMBOOKING}/${id}`);
};

export const getRedeemBookingSingle = async (body: any) => {
    return await post(`${REDEEMBOOKING}/get`, body);
};

export const updateRedeemBooking = async (payload: any, id: number) => {
    return await put(`${REDEEMBOOKING}/${id}`, payload);
};

export const getRedeemBookingDropdownList = async (body: any) => {
    return await post(`${REDEEMBOOKING}/findAll`, body);
};

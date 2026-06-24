import {
    BOOKINGSERVICE
} from "../utils/constant";
import { get, post, del, put } from "../utils/axios";

export const getBookingServiceList = async (body: any) => {
    return await post(`${BOOKINGSERVICE}/list`, body);
};

export const getBookingServiceById = async (id: number) => {
    return await get(`${BOOKINGSERVICE}/${id}`);
};

export const deleteBookingService = async (id: number) => {
    return await del(`${BOOKINGSERVICE}/${id}`);
};


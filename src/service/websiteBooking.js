import {
    WEBSITEBOOKING
} from "../utils/constant";
import { get, post, remove, put } from "./webRequest";

export const getWebsiteBookingList = async (body) => {
    const response = await post(`${WEBSITEBOOKING}/list`, body);
    return response;
};

export const createWebsiteBooking = async (body) => {
    const response = await post(WEBSITEBOOKING, body);
    return response;
};

export const getWebsiteBookingById = async (id) => {
    const response = await get(`${WEBSITEBOOKING}/${id}`);
    return response;
};

export const updateWebsiteBooking = async (payload, id) => {
    const response = await put(`${WEBSITEBOOKING}/${id}`, payload);
    return response;
};

export const deleteWebsiteBooking = async (id) => {
    const response = await remove(`${WEBSITEBOOKING}/${id}`);
    return response;
};


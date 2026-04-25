import {
    ENQUIRY
} from "../utils/constant";
import { get, post, del, put } from "../utils/axios";

export const getEnquiry = async (body: any) => {
    return await post(`${ENQUIRY}/get`, body);
}

export const getEnquiryList = async (body: any) => {
    return await post(`${ENQUIRY}/list`, body);
};

export const createEnquiry = async (body: any) => {
    return await post(ENQUIRY, body);
};

export const getEnquiryById = async (id: number) => {
    return await get(`${ENQUIRY}/${id}`);
};

export const updateEnquiry = async (payload: any, id: number) => {
    return await put(`${ENQUIRY}/${id}`, payload);
};

export const deleteEnquiry = async (id: number) => {
    return await del(`${ENQUIRY}/${id}`);
};


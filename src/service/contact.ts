import {
    CONTACTUS
} from "../utils/constant";
import { get, post, del, put } from "../utils/axios";

export const getContactUsList = async (body: any) => {
    return await post(`${CONTACTUS}/list`, body);
};

export const createContactUs = async (body: any) => {
    return await post(CONTACTUS, body);
};

export const getContactUsById = async (id: number) => {
    return await get(`${CONTACTUS}/${id}`);
};

export const updateContactUs = async (payload: any, id: number) => {
    return await put(`${CONTACTUS}/${id}`, payload);
};

export const deleteContactUs = async (id: number) => {
    return await del(`${CONTACTUS}/${id}`);
};

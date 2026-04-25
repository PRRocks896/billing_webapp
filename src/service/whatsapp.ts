import {
    WHATSAPP
} from "../utils/constant";
import { get, post, put, del } from "../utils/axios";

export const createWhatsapp = async (body: any) => {
    return await post(WHATSAPP, body);
};

export const getWhatsappById = async (id: number) => {
    return await get(`${WHATSAPP}/${id}`);
};

export const updateWhatsapp = async (payload: any, id: number) => {
    return await put(`${WHATSAPP}/${id}`, payload);
};

export const deleteWhatsapp = async (id: number) => {
    return await del(`${WHATSAPP}/${id}`);
}

export const getWhatsappList = async (payload: any) => {
    return await post(`${WHATSAPP}/list`, payload);
}
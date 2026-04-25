import {
    FAQ
} from "../utils/constant";
import { get, post, del, put } from "../utils/axios";

export const getFaq = async (body: any) => {
    return await post(`${FAQ}/get`, body);
}

export const getFaqList = async (body: any) => {
    return await post(`${FAQ}/list`, body);
};

export const createFaq = async (body: any) => {
    return await post(FAQ, body);
};

export const getFaqById = async (id: number) => {
    return await get(`${FAQ}/${id}`);
};

export const updateFaq = async (payload: any, id: number) => {
    return await put(`${FAQ}/${id}`, payload);
};

export const deleteFaq = async (id: number) => {
    return await del(`${FAQ}/${id}`);
};


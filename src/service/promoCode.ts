import {
    PROMOCODE
} from "../utils/constant";
import {
    post,
    put,
    get,
    del
} from "../utils/axios";

export const getPromoCodeList = async (body: any) => {
    return await post(`${PROMOCODE}/list`, body);
};

export const createPromoCode = async (body: any) => {
    return await post(PROMOCODE, body);
};

export const deletePromoCode = async (id: number) => {
    return await del(`${PROMOCODE}/${id}`);
};

export const getPromoCodeById = async (id: number) => {
    return await get(`${PROMOCODE}/${id}`);
};

export const updatePromoCode = async (payload: any, id: number) => {
    return await put(`${PROMOCODE}/${id}`, payload);
};

export const getPromoCodeDropdownList = async (body: any) => {
    return await post(`${PROMOCODE}/findAll`, body);
};

import {
    GIFTCATEGORY
} from "../utils/constant";
import {
    post,
    put,
    get,
    del
} from "../utils/axios";

export const getGiftCategoryList = async (body: any) => {
    return await post(`${GIFTCATEGORY}/list`, body);
};

export const createGiftCategory = async (body: any) => {
    return await post(GIFTCATEGORY, body);
};

export const deleteGiftCategory = async (id: number) => {
    return await del(`${GIFTCATEGORY}/${id}`);
};

export const getGiftCategoryById = async (id: number) => {
    return await get(`${GIFTCATEGORY}/${id}`);
};

export const updateGiftCategory = async (payload: any, id: number) => {
    return await put(`${GIFTCATEGORY}/${id}`, payload);
};
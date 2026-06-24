import {
    PURCHASEGIFTCARD
} from "../utils/constant";
import {
    post,
    put,
    get,
    del
} from "../utils/axios";

export const getPurchaseGiftCardList = async (body: any) => {
    return await post(`${PURCHASEGIFTCARD}/list`, body);
};

export const createPurchaseGiftCard = async (body: any) => {
    return await post(PURCHASEGIFTCARD, body);
};

export const deletePurchaseGiftCard = async (id: number) => {
    return await del(`${PURCHASEGIFTCARD}/${id}`);
};

export const getPurchaseGiftCardById = async (id: number) => {
    return await get(`${PURCHASEGIFTCARD}/${id}`);
};

export const updatePurchaseGiftCard = async (payload: any, id: number) => {
    return await put(`${PURCHASEGIFTCARD}/${id}`, payload);
};
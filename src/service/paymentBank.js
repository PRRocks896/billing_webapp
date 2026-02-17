import {
    PAYMENTBANK
} from "../utils/constant";
import {
    post,
    put,
    get,
    remove
} from "./webRequest";

export const getPaymentBankList = async (body) => {
    return await post(`${PAYMENTBANK}/list`, body);
};

export const createPaymentBank = async (body) => {
    return await post(PAYMENTBANK, body);
};

export const deletePaymentBank = async (id) => {
    return await remove(`${PAYMENTBANK}/${id}`);
};

export const getPaymentBank = async (id) => {
    return await get(`${PAYMENTBANK}/${id}`);
};

export const updatePaymentBank = async (payload, id) => {
    return await put(`${PAYMENTBANK}/${id}`, payload);
};

export const getPaymentBankDropdownList = async (body) => {
    return await post(`${PAYMENTBANK}/findAll`, body);
};

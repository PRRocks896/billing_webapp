import {
    PAYMENTBANK
} from "../utils/constant";
import {
    post,
    put,
    get,
    del
} from "../utils/axios";

export const getPaymentBankList = async (body: any) => {
    return await post(`${PAYMENTBANK}/list`, body);
};

export const createPaymentBank = async (body: any) => {
    return await post(PAYMENTBANK, body);
};

export const deletePaymentBank = async (id: number) => {
    return await del(`${PAYMENTBANK}/${id}`);
};

export const getPaymentBank = async (id: number) => {
    return await get(`${PAYMENTBANK}/${id}`);
};

export const updatePaymentBank = async (payload: any, id: number) => {
    return await put(`${PAYMENTBANK}/${id}`, payload);
};

export const getPaymentBankDropdownList = async (body: any) => {
    return await post(`${PAYMENTBANK}/findAll`, body);
};

import {
    CREATE_PAYMENT_TYPE_API,
    GET_SINGLE_PAYMENT_TYPE_API,
    PAYMENT_TYPE_LIST_API,
    UPDATE_PAYMENT_TYPE_API,
    DELETE_PAYMENT_TYPE_API,
} from "../utils/constant";
import { get, post, del, put } from "../utils/axios";

export const getPaymentTypeList = async (body: any) => {
    return await post(PAYMENT_TYPE_LIST_API, body);
};

export const createPaymentType = async (body: any) => {
    return await post(CREATE_PAYMENT_TYPE_API, body);
};

export const getPaymentTypeById = async (id: number) => {
    return await get(`${GET_SINGLE_PAYMENT_TYPE_API}/${id}`);
};

export const updatePaymentType = async (payload: any, id: number) => {
    return await put(`${UPDATE_PAYMENT_TYPE_API}/${id}`, payload);
};

export const deletePaymentType = async (id: number) => {
    return await del(`${DELETE_PAYMENT_TYPE_API}/${id}`);
};

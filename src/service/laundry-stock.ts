import { LAUNDRYSTOCK } from "../utils/constant";
import { post, put, get, del, getxlsx } from "../utils/axios";

export const getLaundryStockList = async (body: any) => {
    return await post(`${LAUNDRYSTOCK}/list`, body);
};

export const bulkCreateLaundaryStock = async (body: any) => {
    return await post(`${LAUNDRYSTOCK}/bulkcreate`, body);
};

export const deleteLaundaryStock = async (id: number) => {
    return await del(`${LAUNDRYSTOCK}/${id}`);
};

export const getLaundaryStockById = async (id: number) => {
    return await get(`${LAUNDRYSTOCK}/${id}`);
};

export const updateLaundaryStock = async (payload: any, id: number) => {
    return await put(`${LAUNDRYSTOCK}/${id}`, payload);
};

export const fetchLaundryStocksViaPayload = async (payload: any) => {
    return await post(`${LAUNDRYSTOCK}/find`, payload);
};

export const fetchLaundryStockViaPayload = async (payload: any) => {
    return await post(`${LAUNDRYSTOCK}/get`, payload);
};
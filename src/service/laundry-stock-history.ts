import { LAUNDRYSTOCKHISTORY } from "../utils/constant";
import { post, put, get, del, getxlsx } from "../utils/axios";

export const getLaundryStockHistoryList = async (body: any) => {
    return await post(`${LAUNDRYSTOCKHISTORY}/list`, body);
};

export const deleteLaundaryStockHistory = async (id: number) => {
    return await del(`${LAUNDRYSTOCKHISTORY}/${id}`);
};

export const getLaundaryStockHistoryById = async (id: number) => {
    return await get(`${LAUNDRYSTOCKHISTORY}/${id}`);
};

export const updateLaundaryStockHistory = async (payload: any, id: number) => {
    return await put(`${LAUNDRYSTOCKHISTORY}/${id}`, payload);
};

export const fetchLaundryStockHistorysViaPayload = async (payload: any) => {
    return await post(`${LAUNDRYSTOCKHISTORY}/find`, payload);
};

export const fetchLaundryStockHistoryViaPayload = async (payload: any) => {
    return await post(`${LAUNDRYSTOCKHISTORY}/get`, payload);
};
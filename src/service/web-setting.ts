import {
    WEBSETTING
} from "../utils/constant";
import { get, post, put, del } from "../utils/axios";

export const createWebSetting = async (body: any) => {
    return await post(WEBSETTING, body);
};

export const getWebSettingById = async (id: number) => {
    return await get(`${WEBSETTING}/${id}`);
};

export const updateWebSetting = async (payload: any, id: number) => {
    return await put(`${WEBSETTING}/${id}`, payload);
};

export const deleteWebSetting = async (id: number) => {
    return await del(`${WEBSETTING}/${id}`);
}

export const getWebSettingList = async (payload: any) => {
    return await post(`${WEBSETTING}/list`, payload);
}
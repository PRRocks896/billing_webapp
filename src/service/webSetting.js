import {
    WEBSETTING
} from "../utils/constant";
import { get, post, put, remove, attachId } from "./webRequest";

export const createWebSetting = async (body) => {
    return await post(WEBSETTING, body);
};

export const getWebSettingById = async (id) => {
    return await get(`${WEBSETTING}/${id}`);
};

export const updateWebSetting = async (payload, id) => {
    return await put(`${WEBSETTING}/${id}`, payload);
};

export const deleteWebSetting = async (id) => {
    return await remove(`${WEBSETTING}/${id}`);
}

export const getWebSettingList = async (payload) => {
    return await post(`${WEBSETTING}/list`, payload);
}
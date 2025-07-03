import {
    LAUNDRYWASHER
} from "../utils/constant";

import{
    post,
    put,
    get,
    remove
} from "./webRequest";

export const getLaundryWasherList = async (body) => {
    return await post(`${LAUNDRYWASHER}/list`, body);
};

export const createLaundryWasher = async (body) => {
    return await post(LAUNDRYWASHER,body);
};

export const deleteLaundryWasher = async (id) => {
    return await remove(`${LAUNDRYWASHER}/${id}`);
};

export const getLaundryWasher = async (id) => {
    return await get(`${LAUNDRYWASHER}/${id}`);
};

export const UpdateLaundryWasher = async (payload, id) => {
    return await put(`${LAUNDRYWASHER}/${id}`, payload);
};

export const getLaundryWasherDropdownList = async (body) => {
    return await post(`${LAUNDRYWASHER}/dropdown`, body);
};

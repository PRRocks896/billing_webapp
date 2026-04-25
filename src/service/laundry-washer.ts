import {
    LAUNDRYWASHER
} from "../utils/constant";

import {
    post,
    put,
    get,
    del
} from "../utils/axios";

export const getLaundryWasherList = async (body: any) => {
    return await post(`${LAUNDRYWASHER}/list`, body);
};

export const createLaundryWasher = async (body: any) => {
    return await post(LAUNDRYWASHER, body);
};

export const deleteLaundryWasher = async (id: number) => {
    return await del(`${LAUNDRYWASHER}/${id}`);
};

export const getLaundryWasher = async (id: number) => {
    return await get(`${LAUNDRYWASHER}/${id}`);
};

export const updateLaundryWasher = async (payload: any, id: number) => {
    return await put(`${LAUNDRYWASHER}/${id}`, payload);
};

export const getLaundryWasherDropdownList = async (body: any) => {
    return await post(`${LAUNDRYWASHER}/dropdown`, body);
};




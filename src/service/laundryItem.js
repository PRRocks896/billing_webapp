import {
    LAUNDRYITEM
} from "../utils/constant";

import{
    post,
    put,
    get,
    remove
} from "./webRequest";

export const getLaundryItemList = async (body) => {
    return await post(`${LAUNDRYITEM}/list`, body);
};

export const createLaundryItem = async (body) => {
    return await post(LAUNDRYITEM,body);
};

export const deleteLaundryItem = async (id) => {
    return await remove(`${LAUNDRYITEM}/${id}`);
};

export const getLaundryItem = async (id) => {
    return await get(`${LAUNDRYITEM}/${id}`);
};

export const UpdateLaundryItem = async (payload, id) => {
    return await put(`${LAUNDRYITEM}/${id}`, payload);
};

export const getLaundryItemDropdownList = async (body) => {
    return await post(`${LAUNDRYITEM}/dropdown`, body);
};




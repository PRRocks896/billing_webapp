import {
    LAUNDRYITEM
} from "../utils/constant";

import {
    post,
    put,
    get,
    del
} from "../utils/axios";

export const getLaundryItemList = async (body: any) => {
    return await post(`${LAUNDRYITEM}/list`, body);
};

export const createLaundryItem = async (body: any) => {
    return await post(LAUNDRYITEM, body);
};

export const deleteLaundryItem = async (id: number) => {
    return await del(`${LAUNDRYITEM}/${id}`);
};

export const getLaundryItem = async (id: number) => {
    return await get(`${LAUNDRYITEM}/${id}`);
};

export const updateLaundryItem = async (payload: any, id: number) => {
    return await put(`${LAUNDRYITEM}/${id}`, payload);
};

export const getLaundryItemDropdownList = async (body: any) => {
    return await post(`${LAUNDRYITEM}/dropdown`, body);
};




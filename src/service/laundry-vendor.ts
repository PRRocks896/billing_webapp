import { LAUNDRYVENDOR } from "../utils/constant";
import { post, put, get, del } from "../utils/axios";

export const getLaundryVendorList = async (body: any) => {
    return await post(`${LAUNDRYVENDOR}/list`, body);
};

export const createLaundryVendor = async (body: any) => {
    return await post(LAUNDRYVENDOR, body);
};

export const deleteLaundryVendor = async (id: number) => {
    return await del(`${LAUNDRYVENDOR}/${id}`);
};

export const getLaundryVendorById = async (id: number) => {
    return await get(`${LAUNDRYVENDOR}/${id}`);
};

export const updateLaundryVendor = async (payload: any, id: number) => {
    return await put(`${LAUNDRYVENDOR}/${id}`, payload);
};

export const fetchLaundryVendorsViaPayload = async (payload: any) => {
    return await post(`${LAUNDRYVENDOR}/find`, payload);
};

export const fetchLaundryVendorViaPayload = async (payload: any) => {
    return await post(`${LAUNDRYVENDOR}/get`, payload);
};

export const getLaundryVendorDropdownList = async (body: any = {}) => {
    return await post(`${LAUNDRYVENDOR}/list`, { ...body, pagination: { page: 1, rows: 1000 } });
};

import { LAUNDARYMANAGEMENT } from "../utils/constant";
import { post, put, get, del, getxlsx } from "../utils/axios";

export const getLaundryManagementList = async (body: any) => {
    return await post(`${LAUNDARYMANAGEMENT}/list`, body);
};

export const bulkCreateLaundaryManagement = async (body: any) => {
    return await post(`${LAUNDARYMANAGEMENT}/bulkcreate`, body);
};

export const deleteLaundaryManagement = async (id: number) => {
    return await del(`${LAUNDARYMANAGEMENT}/${id}`);
};

export const getLaundaryManagementById = async (id: number) => {
    return await get(`${LAUNDARYMANAGEMENT}/${id}`);
};

export const updateLaundaryManagement = async (payload: any, id: number) => {
    return await put(`${LAUNDARYMANAGEMENT}/${id}`, payload);
};

export const fetchLaundryManagementsViaPayload = async (payload: any) => {
    return await post(`${LAUNDARYMANAGEMENT}/find`, payload);
};

export const fetchLaundryManagementViaPayload = async (payload: any) => {
    return await post(`${LAUNDARYMANAGEMENT}/get`, payload);
};

export const fetchReportLaundryManagement = async (payload: any, fileName: string) => {
    return await getxlsx(`${LAUNDARYMANAGEMENT}/export`, payload, fileName, true);
};
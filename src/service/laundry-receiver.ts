import {
    LAUNDRYRECEIVER
} from "../utils/constant"
import {
    post,
    put,
    get,
    del,
    getpdf
} from "../utils/axios";

export const getLaundryReceiverList = async (body: any) => {
    return await post(`${LAUNDRYRECEIVER}/list`, body);
};

export const bulkCreateLaundryReceiver = async (body: any) => {
    return await post(`${LAUNDRYRECEIVER}/bulkcreate`, body);
};

export const deleteLaundryReceiver = async (id: number) => {
    return await del(`${LAUNDRYRECEIVER}/${id}`);
};

export const getLaundryReceiverById = async (id: number) => {
    return await get(`${LAUNDRYRECEIVER}/${id}`);
};

export const updateLaundryReceiver = async (payload: any, id: number) => {
    return await put(`${LAUNDRYRECEIVER}/${id}`, payload);
};

export const updateBulkReceiver = async (payload: any) => {
    return await post(`${LAUNDRYRECEIVER}/bulkupdate`, payload);
}

export const fetchReportLaundryReceiver = async (payload: any, fileName: string) => {
    return await getpdf(`${LAUNDRYRECEIVER}/report`, payload, fileName, true);
}
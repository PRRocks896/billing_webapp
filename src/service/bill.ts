import {
    BILL_LIST_API,
    CREATE_BILL_API,
    UPDATE_BILL_API,
    DELETE_BILL_API,
    GET_SINGLE_BILL_API,
    CREATE_BULK_BILL_API,
} from "../utils/constant";
import { get, post, put, del } from "../utils/axios";

export const searchViaDashboard = async (where: any) => {
    return await post(`${CREATE_BILL_API}/search-via-dashboard`, where);
}

export const getBillListPayload = async (body: any) => {
    return await post(`${CREATE_BILL_API}/find`, body);
}

export const getBillList = async (body: any) => {
    return await post(BILL_LIST_API, body);
};

export const createBill = async (body: any) => {
    return await post(CREATE_BILL_API, body);
};

export const createBulkBill = async (body: any) => {
    return await post(CREATE_BULK_BILL_API, body);
};

export const updateBill = async (payload: any, id: number) => {
    return await put(`${UPDATE_BILL_API}${id}`, payload);
};

export const deleteBill = async (id: number) => {
    return await del(`${DELETE_BILL_API}${id}`);
};

export const getBillById = async (id: number) => {
    return await get(`${GET_SINGLE_BILL_API}/${id}`);
};

export const currectionOfBillNo = async (payload: any) => {
    return await post(`${CREATE_BILL_API}/billno`, payload);
}
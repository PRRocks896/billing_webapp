import {
    EMPLOYEETYPE
} from "../utils/constant";
import { get, post, del, put } from "../utils/axios";

export const getEmployeeTypePayload = async (body: any) => {
    return await post(`${EMPLOYEETYPE}/get`, body);
}

export const getEmployeeTypeList = async (body: any) => {
    const response = await post(`${EMPLOYEETYPE}/list`, body);
    return response;
};

export const createEmployeeType = async (body: any) => {
    const response = await post(EMPLOYEETYPE, body);
    return response;
};

export const getEmployeeTypeById = async (id: number) => {
    const response = await get(`${EMPLOYEETYPE}/${id}`);
    return response;
};

export const updateEmployeeType = async (payload: any, id: number) => {
    const response = await put(`${EMPLOYEETYPE}/${id}`, payload);
    return response;
};

export const deleteEmployeeType = async (id: number) => {
    const response = await del(`${EMPLOYEETYPE}/${id}`);
    return response;
};


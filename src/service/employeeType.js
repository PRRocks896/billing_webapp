import {
    EMPLOYEETYPE
} from "../utils/constant";
import { get, post, remove, put } from "./webRequest";

export const getEmployeeTypePayload = async (body) => {
    return await post(`${EMPLOYEETYPE}/get`, body);
}

export const getEmployeeTypeList = async (body) => {
    const response = await post(`${EMPLOYEETYPE}/list`, body);
    return response;
};

export const createEmployeeType = async (body) => {
    const response = await post(EMPLOYEETYPE, body);
    return response;
};

export const getEmployeeTypeById = async (id) => {
    const response = await get(`${EMPLOYEETYPE}/${id}`);
    return response;
};

export const updateEmployeeType = async (payload, id) => {
    const response = await put(`${EMPLOYEETYPE}/${id}`, payload);
    return response;
};

export const deleteEmployeeType = async (id) => {
    const response = await remove(`${EMPLOYEETYPE}/${id}`);
    return response;
};


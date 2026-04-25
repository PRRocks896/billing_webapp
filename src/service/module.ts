import {
    MODULE_LIST_API,
    CREATE_MODULE_API,
    GET_SINGLE_MODULE_API,
    UPDATE_MODULE_API,
    DELETE_MODULE_API,
} from "../utils/constant";
import { get, post, del, put } from "../utils/axios";

export const getModuleList = async (body: any) => {
    const response = await post(MODULE_LIST_API, body);
    return response;
};

export const createModule = async (body: any) => {
    const response = await post(CREATE_MODULE_API, body);
    return response;
};

export const getModuleById = async (id: number) => {
    const response = await get(`${GET_SINGLE_MODULE_API}/${id}`);
    return response;
};

export const updateModule = async (payload: any, id: number) => {
    const response = await put(`${UPDATE_MODULE_API}/${id}`, payload);
    return response;
};

export const deleteModule = async (id: number) => {
    const response = await del(`${DELETE_MODULE_API}/${id}`);
    return response;
};

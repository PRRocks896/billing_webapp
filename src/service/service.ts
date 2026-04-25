import {
    CREATE_SERVICE_API,
    DELETE_SERVICE_API,
    GET_SINGLE_SERVICE_API,
    SERVICE_LIST_API,
    UPDATE_SERVICE_API,
} from "../utils/constant";
import { post, put, del, get } from "../utils/axios";

export const getServiceList = async (body: any) => {
    return await post(SERVICE_LIST_API, body);
};

export const createService = async (body: any) => {
    return await post(CREATE_SERVICE_API, body);
};

export const deleteService = async (id: number) => {
    return await del(`${DELETE_SERVICE_API}${id}`);
};

export const getServiceById = async (id: number) => {
    return await get(`${GET_SINGLE_SERVICE_API}${id}`);
};

export const updateService = async (payload: any, id: number) => {
    return await put(`${UPDATE_SERVICE_API}${id}`, payload);
};

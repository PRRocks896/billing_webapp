import {
    CREATE_SERVICE_CATEGORY_API,
    DELETE_SERVICE_CATEGORY_API,
    GET_SINGLE_SERVICE_CATEGORY_API,
    SERVICE_CATEGORY_LIST_API,
    UPDATE_SERVICE_CATEGORY_API,
} from "../utils/constant";
import { post, put, del, get } from "../utils/axios";

export const getServiceCategoryList = async (body: any) => {
    return await post(SERVICE_CATEGORY_LIST_API, body);
};

export const createServiceCategory = async (body: any) => {
    return await post(CREATE_SERVICE_CATEGORY_API, body);
};

export const deleteServiceCategory = async (id: number) => {
    return await del(`${DELETE_SERVICE_CATEGORY_API}/${id}`);
};

export const getServiceCategoryById = async (id: number) => {
    return await get(`${GET_SINGLE_SERVICE_CATEGORY_API}/${id}`);
};

export const updateServiceCategory = async (payload: any, id: number) => {
    return await put(`${UPDATE_SERVICE_CATEGORY_API}/${id}`, payload);
};

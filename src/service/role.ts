import {
    ROLE_LIST_API,
    CREATE_ROLE_API,
    GET_SINGLE_ROLE_API,
    UPDATE_ROLE_API,
    DELETE_ROLE_API,
} from "../utils/constant";
import { get, post, del, put } from "../utils/axios";

export const getRoleList = async (body: any) => {
    const response = await post(ROLE_LIST_API, body);
    return response;
};

export const createRole = async (body: any) => {
    const response = await post(CREATE_ROLE_API, body);
    return response;
};

export const getRoleById = async (id: number) => {
    const response = await get(`${GET_SINGLE_ROLE_API}/${id}`);
    return response;
};

export const updateRole = async (payload: any, id: number) => {
    const response = await put(`${UPDATE_ROLE_API}/${id}`, payload);
    return response;
};

export const deleteRole = async (id: number) => {
    const response = await del(`${DELETE_ROLE_API}/${id}`);
    return response;
};

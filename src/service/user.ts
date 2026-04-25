import {
    CREATE_USER_API,
    GET_SINGLE_USER_API,
    USER_LIST_API,
    UPDATE_USER_API,
    DELETE_USER_API,
    CHANGE_PASSWORD_API,
    GET_USER_API
} from "../utils/constant";
import { get, post, del, put } from "../utils/axios";

export const getUserViaPayload = async (payload: any) => {
    return await post(GET_USER_API, payload);
}

export const getBranch = async (payload: any) => {
    return await post(`${CREATE_USER_API}/findall`, payload);
}

export const getUserList = async (body: any) => {
    return await post(USER_LIST_API, body);
};

export const createUser = async (body: any) => {
    return await post(CREATE_USER_API, body);
};

export const getUserById = async (id: number) => {
    return await get(GET_SINGLE_USER_API + id);
};

export const updateUser = async (payload: any, id: number) => {
    return await put(UPDATE_USER_API + id, payload);
};

export const deleteUser = async (id: number) => {
    return await del(DELETE_USER_API + id);
};

export const changePassword = async (payload: any) => {
    return await post(CHANGE_PASSWORD_API, payload);
};

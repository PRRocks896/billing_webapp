import {
    ADVANCE
} from "../utils/constant";
import {
    post,
    put,
    get,
    del
} from "../utils/axios";

export const getAdvanceList = async (body: any) => {
    return await post(`${ADVANCE}/list`, body);
};

export const createAdvance = async (body: any) => {
    return await post(ADVANCE, body);
};

export const deleteAdvance = async (id: number) => {
    return await del(`${ADVANCE}/${id}`);
};

export const getAdvanceById = async (id: number) => {
    return await get(`${ADVANCE}/${id}`);
};

export const updateAdvance = async (payload: any, id: number) => {
    return await put(`${ADVANCE}/${id}`, payload);
};
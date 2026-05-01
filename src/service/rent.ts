import {
    RENT
} from "../utils/constant";
import { get, post, del, put } from "../utils/axios";

export const getRent = async (body: any) => {
    const response = await post(`${RENT}/get`, body);
    return response;
}

export const getRentList = async (body: any) => {
    const response = await post(`${RENT}/list`, body);
    return response;
};

export const createRent = async (body: any) => {
    const response = await post(RENT, body);
    return response;
};

export const getRentById = async (id: number) => {
    const response = await get(`${RENT}/${id}`);
    return response;
};

export const updateRent = async (payload: any, id: number) => {
    const response = await put(`${RENT}/${id}`, payload);
    return response;
};

export const deleteRent = async (id: number) => {
    const response = await del(`${RENT}/${id}`);
    return response;
};


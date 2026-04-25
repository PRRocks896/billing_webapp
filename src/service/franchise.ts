import {
    FRANCHISE
} from "../utils/constant";
import { get, post, del, put } from "../utils/axios";

export const getFranchise = async (body: any) => {
    return await post(`${FRANCHISE}/get`, body);
}

export const getFranchiseList = async (body: any) => {
    return await post(`${FRANCHISE}/list`, body);
};

export const createFranchise = async (body: any) => {
    return await post(FRANCHISE, body);
};

export const getFranchiseById = async (id: number) => {
    return await get(`${FRANCHISE}/${id}`);
};

export const updateFranchise = async (payload: any, id: number) => {
    return await put(`${FRANCHISE}/${id}`, payload);
};

export const deleteFranchise = async (id: number) => {
    return await del(`${FRANCHISE}/${id}`);
};


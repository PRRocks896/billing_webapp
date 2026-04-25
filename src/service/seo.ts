import {
    SEO
} from "../utils/constant";
import { get, post, del, put } from "../utils/axios";

export const getSeo = async (body: any) => {
    return await post(`${SEO}/get`, body);
}

export const getSeoList = async (body: any) => {
    return await post(`${SEO}/list`, body);
};

export const createSeo = async (body: any) => {
    return await post(SEO, body);
};

export const getSeoById = async (id: number) => {
    return await get(`${SEO}/${id}`);
};

export const updateSeo = async (payload: any, id: number) => {
    return await put(`${SEO}/${id}`, payload);
};

export const deleteSeo = async (id: number) => {
    return await del(`${SEO}/${id}`);
};


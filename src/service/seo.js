import {
    SEO
} from "../utils/constant";
import { get, post, remove, put } from "./webRequest";

export const getSeo = async (body) => {
    const response = await post(`${SEO}/get`, body);
    return response;
}

export const getSeoList = async (body) => {
    const response = await post(`${SEO}/list`, body);
    return response;
};

export const createSeo = async (body) => {
    const response = await post(SEO, body);
    return response;
};

export const getSeoById = async (id) => {
    const response = await get(`${SEO}/${id}`);
    return response;
};

export const updateSeo = async (payload, id) => {
    const response = await put(`${SEO}/${id}`, payload);
    return response;
};

export const deleteSeo = async (id) => {
    const response = await remove(`${SEO}/${id}`);
    return response;
};


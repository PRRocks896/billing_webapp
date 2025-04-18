import {
    BLOG
} from "../utils/constant";
import { get, post, remove, put } from "./webRequest";

export const getBlogList = async (body) => {
    const response = await post(`${BLOG}/list`, body);
    return response;
};

export const createBlog = async (body) => {
    const response = await post(BLOG, body);
    return response;
};

export const getBlogById = async (id) => {
    const response = await get(`${BLOG}/${id}`);
    return response;
};

export const updateBlog = async (payload, id) => {
    const response = await put(`${BLOG}/${id}`, payload);
    return response;
};

export const deleteBlog = async (id) => {
    const response = await remove(`${BLOG}/${id}`);
    return response;
};


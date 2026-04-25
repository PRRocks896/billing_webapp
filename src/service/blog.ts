import {
    BLOG
} from "../utils/constant";
import { get, post, del, put } from "../utils/axios";

export const getBlogList = async (body: any) => {
    return await post(`${BLOG}/list`, body);
};

export const createBlog = async (body: any) => {
    return await post(BLOG, body);
};

export const getBlogById = async (id: number) => {
    return await get(`${BLOG}/${id}`);
};

export const updateBlog = async (payload: any, id: number) => {
    return await put(`${BLOG}/${id}`, payload);
};

export const deleteBlog = async (id: number) => {
    return await del(`${BLOG}/${id}`);
};


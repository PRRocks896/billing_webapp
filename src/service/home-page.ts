import { HOMEPAGE } from "../utils/constant";
import { get, post, del, put } from "../utils/axios";

export const getHomePageList = async (body: any) => {
    return await post(`${HOMEPAGE}/list`, body);
};
export const createHomePage = async (body: any) => {
    return await post(HOMEPAGE, body);
};
export const getHomePageById = async (id: number) => {
    return await get(`${HOMEPAGE}/${id}`);
};
export const updateHomePage = async (payload: any, id: number) => {
    return await put(`${HOMEPAGE}/${id}`, payload);
};
export const deleteHomePage = async (id: number) => {
    return await del(`${HOMEPAGE}/${id}`);
};
export const getHomePage = async (payload: any) => {
    return await get(`${HOMEPAGE}/find`);
};
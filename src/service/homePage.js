import { HOMEPAGE } from "../utils/constant";
import { get, post, remove, put } from "./webRequest";

export const getHomePageList = async (body) => {
  return await post(`${HOMEPAGE}/list`, body);
};
export const createHomePage = async (body) => {
  return await post(HOMEPAGE, body);
};
export const getHomePageById = async (id) => {
  return await get(`${HOMEPAGE}/${id}`);
};
export const updateHomePage = async (payload, id) => {
  return await put(`${HOMEPAGE}/${id}`, payload);
};
export const deleteHomePage = async (id) => {
  return await remove(`${HOMEPAGE}/${id}`);
};
export const getHomePage = async (payload) => {
  return await get(`${HOMEPAGE}/find`);
};
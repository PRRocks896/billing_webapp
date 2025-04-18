import {
    ADVANCE
} from "../utils/constant";
import {
    post,
    put,
    get,
    remove
} from "./webRequest";

export const getAdvanceList = async (body) => {
  return await post(`${ADVANCE}/list`, body);
};

export const createAdvance = async (body) => {
  return await post(ADVANCE, body);
};

export const deleteAdvance = async (id) => {
  return await remove(`${ADVANCE}/${id}`);
};

export const getAdvanceById = async (id) => {
  return await get(`${ADVANCE}/${id}`);
};

export const updateAdvance = async (payload, id) => {
  return await put(`${ADVANCE}/${id}`, payload);
};
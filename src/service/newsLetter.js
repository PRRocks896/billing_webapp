import { NewsLetter } from "../utils/constant";
import { get, post, remove, put } from "./webRequest";

export const getNewsLetterList = async (body) => {
  const response = await post(`${NewsLetter}/list`, body);
  return response;
};

export const createNewsLetter = async (body) => {
  const response = await post(NewsLetter, body);
  return response;
};

export const getNewsLetterById = async (id) => {
  const response = await get(`${NewsLetter}/${id}`);
  return response;
};

export const updateNewsLetter = async (payload, id) => {
  const response = await put(`${NewsLetter}/${id}`, payload);
  return response;
};

export const deleteNewsLetter = async (id) => {
  const response = await remove(`${NewsLetter}/${id}`);
  return response;
};

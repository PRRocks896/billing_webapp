import {
  MODULE_LIST_API,
  CREATE_MODULE_API,
  GET_SINGLE_MODULE_API,
  UPDATE_MODULE_API,
  DELETE_MODULE_API,
} from "../utils/constant";
import { attachId, get, post, remove, put } from "./webRequest";

export const getModuleList = async (body) => {
  const response = await post(MODULE_LIST_API, body);
  return response;
};

export const createModule = async (body) => {
  const response = await post(CREATE_MODULE_API, body);
  return response;
};

export const getModuleById = async (id) => {
  const newUrl = await attachId(GET_SINGLE_MODULE_API, id);
  const response = await get(newUrl);
  return response;
};

export const updateModule = async (payload, id) => {
  const newUrl = await attachId(UPDATE_MODULE_API, id);
  const response = await put(newUrl, payload);
  return response;
};

export const deleteModule = async (id) => {
  const newUrl = await attachId(DELETE_MODULE_API, id);
  const response = await remove(newUrl);
  return response;
};

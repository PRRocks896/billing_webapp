import {
  CREATE_SERVICE_API,
  DELETE_SERVICE_API,
  GET_SINGLE_SERVICE_API,
  SEARCH_SERVICE_API,
  SERVICE_LIST_API,
  UPDATE_SERVICE_API,
} from "../utils/constant";
import { attachId, post, put, remove, get } from "./webRequest";

export const getServiceList = async (body) => {
  const response = await post(SERVICE_LIST_API, body);
  return response;
};

export const createService = async (body) => {
  const response = await post(CREATE_SERVICE_API, body);
  return response;
};

export const deleteService = async (id) => {
  const newUrl = await attachId(DELETE_SERVICE_API, id);
  const response = await remove(newUrl);
  return response;
};

export const getServiceById = async (id) => {
  const newUrl = await attachId(GET_SINGLE_SERVICE_API, id);
  const response = await get(newUrl);
  return response;
};

export const updateService = async (payload, id) => {
  const newUrl = await attachId(UPDATE_SERVICE_API, id);
  const response = await put(newUrl, payload);
  return response;
};

export const searchService = async (payload) => {
  const response = await post(SEARCH_SERVICE_API, payload);
  return response;
};

import {
  CREATE_SERVICE_CATEGORY_API,
  DELETE_SERVICE_CATEGORY_API,
  GET_SINGLE_SERVICE_CATEGORY_API,
  SEARCH_SERVICE_CATEGORY_API,
  SERVICE_CATEGORY_LIST_API,
  UPDATE_SERVICE_CATEGORY_API,
} from "../utils/constant";
import { attachId, post, put, remove, get } from "./webRequest";

export const getServiceCategoryList = async (body) => {
  const response = await post(SERVICE_CATEGORY_LIST_API, body);
  return response;
};

export const createServiceCategory = async (body) => {
  const response = await post(CREATE_SERVICE_CATEGORY_API, body);
  return response;
};

export const deleteServiceCategory = async (id) => {
  const newUrl = await attachId(DELETE_SERVICE_CATEGORY_API, id);
  const response = await remove(newUrl);
  return response;
};

export const getServiceCategoryById = async (id) => {
  const newUrl = await attachId(GET_SINGLE_SERVICE_CATEGORY_API, id);
  const response = await get(newUrl);
  return response;
};

export const updateServiceCategory = async (payload, id) => {
  const newUrl = await attachId(UPDATE_SERVICE_CATEGORY_API, id);
  const response = await put(newUrl, payload);
  return response;
};

export const searchServiceCategory = async (payload) => {
  const response = await post(SEARCH_SERVICE_CATEGORY_API, payload);
  return response;
};

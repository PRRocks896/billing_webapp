import {
  CREATE_CITY_API,
  GET_SINGLE_CITY_API,
  CITY_LIST_API,
  UPDATE_CITY_API,
} from "../utils/constant";
import { attachId, get, post, put } from "./webRequest";

export const getCityList = async (body) => {
  const response = await post(CITY_LIST_API, body);
  return response;
};

export const createCity = async (body) => {
  const response = await post(CREATE_CITY_API, body);
  return response;
};

export const getCityById = async (id) => {
  const newUrl = await attachId(GET_SINGLE_CITY_API, id);
  const response = await get(newUrl);
  return response;
};

export const updateCity = async (payload, id) => {
  const newUrl = await attachId(UPDATE_CITY_API, id);
  const response = await put(newUrl, payload);
  return response;
};

import {
  CREATE_CITY_API,
  GET_SINGLE_CITY_API,
  CITY_LIST_API,
  UPDATE_CITY_API,
  DELETE_CITY_API,
  CITY_FIND_API
} from "../utils/constant";
import { attachId, get, post, remove, put } from "./webRequest";

export const getCityByFind = async (body) => {
  return await post(CITY_FIND_API, body);
}

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

export const deleteCity = async (id) => {
  const newUrl = await attachId(DELETE_CITY_API, id);
  const response = await remove(newUrl);
  return response;
};

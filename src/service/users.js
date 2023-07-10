import {
  CREATE_USER_API,
  GET_SINGLE_USER_API,
  USER_LIST_API,
  UPDATE_USER_API,
  DELETE_USER_API,
} from "../utils/constant";
import { attachId, get, post, remove, put } from "./webRequest";

export const getUserList = async (body) => {
  const response = await post(USER_LIST_API, body);
  return response;
};

export const createUser = async (body) => {
  const response = await post(CREATE_USER_API, body);
  return response;
};

export const getUserById = async (id) => {
  const newUrl = await attachId(GET_SINGLE_USER_API, id);
  const response = await get(newUrl);
  return response;
};

export const updateUser = async (payload, id) => {
  const newUrl = await attachId(UPDATE_USER_API, id);
  const response = await put(newUrl, payload);
  return response;
};

export const deleteUser = async (id) => {
  const newUrl = await attachId(DELETE_USER_API, id);
  const response = await remove(newUrl);
  return response;
};

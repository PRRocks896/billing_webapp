import {
  CREATE_ROLE_API,
  GET_SINGLE_ROLE_API,
  ROLE_LIST_API,
  UPDATE_ROLE_API,
  DELETE_ROLE_API,
} from "../utils/constant";
import { attachId, get, post, remove, put } from "./webRequest";

export const getRolesList = async (body) => {
  const response = await post(ROLE_LIST_API, body);
  return response;
};

export const createRole = async (body) => {
  const response = await post(CREATE_ROLE_API, body);
  return response;
};

export const getRoleById = async (id) => {
  const newUrl = await attachId(GET_SINGLE_ROLE_API, id);
  const response = await get(newUrl);
  return response;
};

export const updateRole = async (payload, id) => {
  const newUrl = await attachId(UPDATE_ROLE_API, id);
  const response = await put(newUrl, payload);
  return response;
};

export const deleteRole = async (id) => {
  const newUrl = await attachId(DELETE_ROLE_API, id);
  const response = await remove(newUrl);
  return response;
};

import {
  CREATE_STAFF_API,
  GET_SINGLE_STAFF_API,
  STAFF_LIST_API,
  UPDATE_STAFF_API,
} from "../utils/constant";
import { attachId, get, post, put } from "./webRequest";

export const getStaffList = async (body) => {
  const response = await post(STAFF_LIST_API, body);
  return response;
};

export const createStaff = async (body) => {
  const response = await post(CREATE_STAFF_API, body);
  return response;
};

export const getStaffById = async (id) => {
  const newUrl = await attachId(GET_SINGLE_STAFF_API, id);
  const response = await get(newUrl);
  return response;
};

export const updateStaff = async (payload, id) => {
  const newUrl = await attachId(UPDATE_STAFF_API, id);
  const response = await put(newUrl, payload);
  return response;
};

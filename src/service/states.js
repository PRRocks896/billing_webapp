import {
  CREATE_STATES_API,
  GET_SINGLE_STATES_API,
  STATES_LIST_API,
  UPDATE_STATES_API,
  DELETE_STATES_API,
  SEARCH_STATES_API,
} from "../utils/constant";
import { attachId, get, post, remove, put } from "./webRequest";

export const getStatesList = async (body) => {
  const response = await post(STATES_LIST_API, body);
  return response;
};

export const createStates = async (body) => {
  const response = await post(CREATE_STATES_API, body);
  return response;
};

export const getStatesById = async (id) => {
  const newUrl = await attachId(GET_SINGLE_STATES_API, id);
  const response = await get(newUrl);
  return response;
};

export const updateStates = async (payload, id) => {
  const newUrl = await attachId(UPDATE_STATES_API, id);
  const response = await put(newUrl, payload);
  return response;
};

export const deleteState = async (id) => {
  const newUrl = await attachId(DELETE_STATES_API, id);
  const response = await remove(newUrl);
  return response;
};

export const searchStates = async (body) => {
  const response = await post(SEARCH_STATES_API, body);
  return response;
};

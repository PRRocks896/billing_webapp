import {
  DAILYTASK
} from "../utils/constant";
import {
  post,
  put,
  get,
  remove
} from "./webRequest";

export const getDailyTaskList = async (body) => {
  return await post(`${DAILYTASK}/list`, body)
};

export const createDailyTask = async (body) => {
  const response = await post(DAILYTASK, body);
  return response;
};

export const deleteDailyTask = async (id) => {
  return await remove(`${DAILYTASK}/${id}`);
};

export const getDailyTaskById = async (id) => {
  return await get(`${DAILYTASK}/${id}`);
};

export const updateDailyTask = async (payload, id) => {
  return await put(`${DAILYTASK}/${id}`, payload);
};


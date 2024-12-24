import { ROOM } from "../utils/constant";
import { get, post, remove, put } from "./webRequest";

export const getRoomList = async (body) => {
  const response = await post(`${ROOM}/list`, body);
  return response;
};

export const createRoom = async (body) => {
  const response = await post(ROOM, body);
  return response;
};

export const getRoomById = async (id) => {
  const response = await get(`${ROOM}/${id}`);
  return response;
};

export const updateRoom = async (payload, id) => {
  const response = await put(`${ROOM}/${id}`, payload);
  return response;
};

export const deleteRoom = async (id) => {
  const response = await remove(`${ROOM}/${id}`);
  return response;
};

import { ROOM } from "../utils/constant";
import { get, post, del, put } from "../utils/axios";

export const getRoomList = async (body: any) => {
    const response = await post(`${ROOM}/list`, body);
    return response;
};

export const createRoom = async (body: any) => {
    const response = await post(ROOM, body);
    return response;
};

export const getRoomById = async (id: number) => {
    const response = await get(`${ROOM}/${id}`);
    return response;
};

export const updateRoom = async (payload: any, id: number) => {
    const response = await put(`${ROOM}/${id}`, payload);
    return response;
};

export const deleteRoom = async (id: number) => {
    const response = await del(`${ROOM}/${id}`);
    return response;
};

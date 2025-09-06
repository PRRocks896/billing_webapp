import {
    BIKEDETAILS
} from "../utils/constant";
import {
    post,
    put,
    get,
    remove
} from "./webRequest";

export const getBikeDetailsList = async (body) => {
  return await post(`${BIKEDETAILS}/list`, body);
};

export const createBikeDetails = async (body) => {
  return await post(BIKEDETAILS, body);
};

export const deleteBikeDetails = async (id) => {
  return await remove(`${BIKEDETAILS}/${id}`);
};

export const getBikeDetailsById = async (id) => {
  return await get(`${BIKEDETAILS}/${id}`);
};

export const updateBikeDetails = async (payload, id) => {
  return await put(`${BIKEDETAILS}/${id}`, payload);
};
import {
    STOCK
} from "../utils/constant";
import {
    post,
    put,
    get,
    remove
} from "./webRequest";

export const getStockList = async (body) => {
  return await post(`${STOCK}/list`, body)
};

export const bulkcreateStock = async (body) => {
    return await post(`${STOCK}/bulkcreate`, body);
  };

export const deleteStock = async (id) => {
  return await remove(`${STOCK}/${id}`);
};

export const getStockById = async (id) => {
  return await get(`${STOCK}/${id}`);
};

export const updateStock = async (payload, id) => {
  return await put(`${STOCK}/${id}`, payload);
};
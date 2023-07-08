import {
  CREATE_PAYMENT_TYPE_API,
  GET_SINGLE_PAYMENT_TYPE_API,
  PAYMENT_TYPE_LIST_API,
  UPDATE_PAYMENT_TYPE_API,
  DELETE_PAYMENT_TYPE_API,
} from "../utils/constant";
import { attachId, get, post, remove, put } from "./webRequest";

export const getPaymentTypeList = async (body) => {
  const response = await post(PAYMENT_TYPE_LIST_API, body);
  return response;
};

export const createPaymentType = async (body) => {
  const response = await post(CREATE_PAYMENT_TYPE_API, body);
  return response;
};

export const getPaymentTypeById = async (id) => {
  const newUrl = await attachId(GET_SINGLE_PAYMENT_TYPE_API, id);
  const response = await get(newUrl);
  return response;
};

export const updatePaymentType = async (payload, id) => {
  const newUrl = await attachId(UPDATE_PAYMENT_TYPE_API, id);
  const response = await put(newUrl, payload);
  return response;
};

export const deletePaymentType = async (id) => {
  const newUrl = await attachId(DELETE_PAYMENT_TYPE_API, id);
  const response = await remove(newUrl);
  return response;
};

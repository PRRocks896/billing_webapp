import {
  BILL_LIST_API,
  CREATE_BILL_API,
  UPDATE_BILL_API,
  DELETE_BILL_API,
  GET_SINGLE_BILL_API,
  CREATE_BULK_BILL_API,
} from "../utils/constant";
import { attachId, get, post, put, remove } from "./webRequest";

export const getBillList = async (body) => {
  const response = await post(BILL_LIST_API, body);
  return response;
};

export const createBill = async (body) => {
  const response = await post(CREATE_BILL_API, body);
  return response;
};

export const createBulkBill = async (body) => {
  const response = await post(CREATE_BULK_BILL_API, body);
  return response;
};

export const updateBill = async (payload, id) => {
  const newUrl = await attachId(UPDATE_BILL_API, id);
  const response = await put(newUrl, payload);
  return response;
};

export const deleteBill = async (id) => {
  const newUrl = await attachId(DELETE_BILL_API, id);
  const response = await remove(newUrl);
  return response;
};

export const getBillById = async (id) => {
  const newUrl = await attachId(GET_SINGLE_BILL_API, id);
  const response = await get(newUrl);
  return response;
};

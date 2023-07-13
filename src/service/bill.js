import {
  BILL_LIST_API,
  CREATE_BILL_API,
  UPDATE_BILL_API,
  DELETE_BILL_API,
} from "../utils/constant";
import { attachId, post, remove } from "./webRequest";

export const getBillList = async (bodt) => {
  const response = await post(BILL_LIST_API);
  return response;
};

export const createBill = async (body) => {
  const response = await post(CREATE_BILL_API, body);
  return response;
};

export const editBill = async (id) => {
  const newUrl = await attachId(UPDATE_BILL_API, id);
  const response = await remove(newUrl);
  return response;
};

export const deleteBill = async (id) => {
  const newUrl = await attachId(DELETE_BILL_API, id);
  const response = await remove(newUrl);
  return response;
};

import { CREATE_BILL_API, DELETE_BILL_API } from "../utils/constant";
import { attachId, post, remove } from "./webRequest";

export const createBill = async (body) => {
  const response = await post(CREATE_BILL_API, body);
  return response;
};

export const deleteBill = async (id) => {
  const newUrl = await attachId(DELETE_BILL_API, id);
  const response = await remove(newUrl);
  return response;
};

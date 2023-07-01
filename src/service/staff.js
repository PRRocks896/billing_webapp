import { CREATE_STAFF, STAFF_LIST_API } from "../utils/constant";
import { post } from "./webRequest";

export const getStaffList = async (body) => {
  const response = await post(STAFF_LIST_API, body);
  return response;
};

export const createStaff = async (body) => {
  const response = await post(CREATE_STAFF, body);
  return response;
};

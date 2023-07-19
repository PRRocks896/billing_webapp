import {
  CREATE_BULK_RIGHT_API,
  CREATE_RIGHT_API,
  RIGHT_LIST_API
} from "../utils/constant";
import { post } from "./webRequest";

export const createBulkRight = async (body) => {
  return await post(CREATE_BULK_RIGHT_API, body);
}

export const createRight = async (body) => {
  const response = await post(CREATE_RIGHT_API, body);
  return response;
};

export const getRightList = async (body) => {
  const response = await post(RIGHT_LIST_API, body);
  return response;
}
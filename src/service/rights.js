import { CREATE_RIGHT_API } from "../utils/constant";
import { post } from "./webRequest";

export const createRight = async (body) => {
  const response = await post(CREATE_RIGHT_API, body);
  return response;
};

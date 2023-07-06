import { LOGIN_API } from "../utils/constant";
import { post } from "./webRequest";

export const login = async (body) => {
  const response = await post(LOGIN_API, body);
  return response;
};

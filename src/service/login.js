import { LOGIN_API, VERIFY_OTP } from "../utils/constant";
import { post } from "./webRequest";

export const login = async (body) => {
  const response = await post(LOGIN_API, body);
  return response;
};

export const verifyOTP = async (body) => {
  return await post(VERIFY_OTP, body);
}

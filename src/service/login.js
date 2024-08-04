import { LOGOUT_API, LOGIN_API, LOGIN_API_VIA_PHONE, VERIFY_OTP } from "../utils/constant";
import { post } from "./webRequest";

export const login = async (body) => {
  const response = await post(LOGIN_API, body);
  return response;
};

export const loginViaPhone = async (body) => {
  return await post(LOGIN_API_VIA_PHONE, body);
}

export const verifyOTP = async (body) => {
  return await post(VERIFY_OTP, body);
}

export const logout = async (body) => {
  return await post(LOGOUT_API, body);
}

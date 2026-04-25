import { LOGOUT_API, LOGIN_API, LOGIN_API_VIA_PHONE, VERIFY_OTP, GET_LOGGED_IN_USER_API } from "../utils/constant";
import { post, get } from "../utils/axios";

export const login = async (body: any) => {
    const response = await post(LOGIN_API, body);
    return response;
};

export const loginViaPhone = async (body: any) => {
    return await post(LOGIN_API_VIA_PHONE, body);
}

export const verifyOTP = async (body: any) => {
    return await post(VERIFY_OTP, body);
}

export const logOut = async (body: any) => {
    return await post(LOGOUT_API, body);
}

export const fetchLoggedInUserData = async () => {
    return await get(GET_LOGGED_IN_USER_API);
};
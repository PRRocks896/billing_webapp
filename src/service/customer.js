import {
  CREATE_BULK_CUSTOMER_API,
  CREATE_CUSTOMER_API,
  CUSTOMER_LIST_API,
  DELETE_CUSTOMER_API,
  GET_SINGLE_CUSTOMER_API,
  UPDATE_CUSTOMER_API,
  SENT_MEMBERHSIP_OTP,
  VERIFY_MEMBERSHIP_OTP,
  SEND_MEMBERHSIP_REDEEM_OTP,
  VERIFY_MEMBERSHIP_REDEEM_OTP,
  EXPORT_CUSTOMER
} from "../utils/constant";
import { attachId, post, put, remove, get, getXlsx } from "./webRequest";

export const customerReport = async (payload) => {
  return await getXlsx(EXPORT_CUSTOMER, payload, 'Branch_Wise_Customer_List.xlsx');
}

export const verifyMembershipRedeemOtp = async (payload) => {
  return await post(VERIFY_MEMBERSHIP_REDEEM_OTP, payload);
}

export const sendMembershipRedeemOtp = async (payload) => {
  return await post(SEND_MEMBERHSIP_REDEEM_OTP, payload);
}


export const verifyMembershipOtp = async (payload) => {
  return await post(VERIFY_MEMBERSHIP_OTP, payload);
}

export const sendMembershipOtp = async (payload) => {
  return await post(SENT_MEMBERHSIP_OTP, payload);
}

export const getCustomerList = async (body) => {
  const response = await post(CUSTOMER_LIST_API, body);
  return response;
};

export const createCustomer = async (body) => {
  const response = await post(CREATE_CUSTOMER_API, body);
  return response;
};

export const deleteCustomer = async (id) => {
  const newUrl = await attachId(DELETE_CUSTOMER_API, id);
  const response = await remove(newUrl);
  return response;
};

export const getCustomerById = async (id) => {
  const newUrl = await attachId(GET_SINGLE_CUSTOMER_API, id);
  const response = await get(newUrl);
  return response;
};

export const updateCustomer = async (payload, id) => {
  const newUrl = await attachId(UPDATE_CUSTOMER_API, id);
  const response = await put(newUrl, payload);
  return response;
};

export const createBulkCustomer = async (body) => {
  const response = await post(CREATE_BULK_CUSTOMER_API, body);
  return response;
};

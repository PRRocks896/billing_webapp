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
import { post, put, del, get, getxlsx } from "../utils/axios";

export const customerReport = async (payload: any) => {
    return await getxlsx(EXPORT_CUSTOMER, payload, 'Branch_Wise_Customer_List.xlsx');
}

export const verifyMembershipRedeemOtp = async (payload: any) => {
    return await post(VERIFY_MEMBERSHIP_REDEEM_OTP, payload);
}

export const sendMembershipRedeemOtp = async (payload: any) => {
    return await post(SEND_MEMBERHSIP_REDEEM_OTP, payload);
}


export const verifyMembershipOtp = async (payload: any) => {
    return await post(VERIFY_MEMBERSHIP_OTP, payload);
}

export const sendMembershipOtp = async (payload: any) => {
    return await post(SENT_MEMBERHSIP_OTP, payload);
}

export const getCustomerList = async (body: any) => {
    return await post(CUSTOMER_LIST_API, body);
};

export const getCustomerDropdown = async (body: any) => {
    return await post(`${CREATE_CUSTOMER_API}/dropdown`, body)
}

export const newCustomerCount = async (body: any) => {
    return await post(`${CREATE_CUSTOMER_API}/new-customer`, body)
}

export const createCustomer = async (body: any) => {
    return await post(CREATE_CUSTOMER_API, body);
};

export const deleteCustomer = async (id: number) => {
    return await del(`${DELETE_CUSTOMER_API}/${id}`);
};

export const getCustomerById = async (id: number) => {
    return await get(`${GET_SINGLE_CUSTOMER_API}/${id}`);
};

export const updateCustomer = async (payload: any, id: number) => {
    return await put(`${UPDATE_CUSTOMER_API}/${id}`, payload);
};

export const createBulkCustomer = async (body: any) => {
    return await post(CREATE_BULK_CUSTOMER_API, body);
};

import {
    CREATE_STAFF_API,
    DELETE_STAFF_API,
    GET_SINGLE_STAFF_API,
    STAFF_LIST_API,
    UPDATE_STAFF_API,
} from "../utils/constant";
import { get, post, put, del } from "../utils/axios";

export const staffTransferRequest = async (body: any) => {
    return await post(`${CREATE_STAFF_API}/staff-transfer-request`, body);
}

export const staffTransferVerify = async (body: any) => {
    return await post(`${CREATE_STAFF_API}/staff-transfer-verify`, body);
}

export const getTherapistDropdown = async (body: any) => {
    return await post(`${CREATE_STAFF_API}/therapist-dropdown`, body);
}

export const getAttendanceList = async (body: any) => {
    return await post(`${CREATE_STAFF_API}/therapist-in-out`, body);
}

export const sendOtp = async (body: any) => {
    return await post(`${CREATE_STAFF_API}/send-otp`, body);
}

export const sendStaffOtp = async (body: any) => {
    return await post(`${CREATE_STAFF_API}/mobile-send-otp`, body);
}

export const verifyOtp = async (body: any) => {
    return await post(`${CREATE_STAFF_API}/verify-otp`, body);
}

export const getManager = async (body: any) => {
    return await post(`${CREATE_STAFF_API}/get-manager`, body);
}

export const verifyIfscCode = async (body: any) => {
    return await post(`${CREATE_STAFF_API}/verify-ifsc`, body);
}

export const getStaffList = async (body: any) => {
    return await post(STAFF_LIST_API, body);
};

export const createStaff = async (body: any) => {
    return await post(CREATE_STAFF_API, body);
};

export const deleteStaff = async (id: number) => {
    return await del(`${DELETE_STAFF_API}/${id}`);
};

export const getStaffById = async (id: number) => {
    return await get(`${GET_SINGLE_STAFF_API}/${id}`);
};

export const updateStaff = async (payload: any, id: number) => {
    return await put(`${UPDATE_STAFF_API}/${id}`, payload);
};

export const getStaff = async (payload: any) => {
    return await post(`${CREATE_STAFF_API}/get`, payload);
};

export const findStaff = async (payload: any) => {
    return await post(`${CREATE_STAFF_API}/find`, payload);
}
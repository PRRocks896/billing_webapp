import {
    EMPWELLNESSENQUIRY
} from "../utils/constant";
import {
    post,
    put,
    get,
    del
} from "../utils/axios";

export const getEmpWellnessEnquiryList = async (body: any) => {
    return await post(`${EMPWELLNESSENQUIRY}/list`, body);
};

export const createEmpWellnessEnquiry = async (body: any) => {
    return await post(EMPWELLNESSENQUIRY, body);
};

export const deleteEmpWellnessEnquiry = async (id: number) => {
    return await del(`${EMPWELLNESSENQUIRY}/${id}`);
};

export const getEmpWellnessEnquiryById = async (id: number) => {
    return await get(`${EMPWELLNESSENQUIRY}/${id}`);
};

export const updateEmpWellnessEnquiry = async (payload: any, id: number) => {
    return await put(`${EMPWELLNESSENQUIRY}/${id}`, payload);
};
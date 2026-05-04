import {
    EMPWELLNESSPLAN
} from "../utils/constant";
import {
    post,
    put,
    get,
    del
} from "../utils/axios";

export const getEmpWellnessPlanList = async (body: any) => {
    return await post(`${EMPWELLNESSPLAN}/list`, body);
};

export const createEmpWellnessPlan = async (body: any) => {
    return await post(EMPWELLNESSPLAN, body);
};

export const deleteEmpWellnessPlan = async (id: number) => {
    return await del(`${EMPWELLNESSPLAN}/${id}`);
};

export const getEmpWellnessPlanById = async (id: number) => {
    return await get(`${EMPWELLNESSPLAN}/${id}`);
};

export const updateEmpWellnessPlan = async (payload: any, id: number) => {
    return await put(`${EMPWELLNESSPLAN}/${id}`, payload);
};
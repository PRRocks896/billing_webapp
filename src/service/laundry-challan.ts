import { LAUNDRYCHALLAN } from "../utils/constant";
import { post, put, get, del, getxlsx } from "../utils/axios";

export const getLaundryChallanList = async (body: any) => {
    return await post(`${LAUNDRYCHALLAN}/list`, body);
};

export const createLaundryChallan = async (body: any) => {
    return await post(LAUNDRYCHALLAN, body);
};

export const deleteLaundryChallan = async (id: number) => {
    return await del(`${LAUNDRYCHALLAN}/${id}`);
};

export const getLaundryChallanById = async (id: number) => {
    return await get(`${LAUNDRYCHALLAN}/${id}`);
};

export const updateLaundryChallan = async (payload: any, id: number) => {
    return await put(`${LAUNDRYCHALLAN}/${id}`, payload);
};

export const lookupChallanCode = async (challanCode: string) => {
    return await post(`${LAUNDRYCHALLAN}/lookup`, { challanCode });
};

export const cancelChallan = async (id: number, payload: any = {}) => {
    return await post(`${LAUNDRYCHALLAN}/${id}/cancel`, payload);
};

export const fetchReportLaundryChallan = async (payload: any, fileName: string) => {
    return await getxlsx(`${LAUNDRYCHALLAN}/export`, payload, fileName, true);
};

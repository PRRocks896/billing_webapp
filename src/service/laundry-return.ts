import { LAUNDRYRETURN } from "../utils/constant";
import { post, get } from "../utils/axios";

export const getLaundryReturnList = async (body: any) => {
    return await post(`${LAUNDRYRETURN}/list`, body);
};

export const createLaundryReturn = async (body: any) => {
    return await post(LAUNDRYRETURN, body);
};

export const getLaundryReturnById = async (id: number) => {
    return await get(`${LAUNDRYRETURN}/${id}`);
};

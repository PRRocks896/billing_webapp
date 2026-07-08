import {
    COMPANY,
    COMPANYMAPPING
} from "../utils/constant";
import { get, post, del, put } from "../utils/axios";

export const getCompanyList = async (body: any) => {
    return await post(`${COMPANY}/list`, body);
};

export const getCompany = async (body: any) => {
    return await post(`${COMPANY}/findAll`, body);
}

export const createCompany = async (body: any) => {
    return await post(COMPANY, body);
};

export const getCompanyById = async (id: number) => {
    return await get(`${COMPANY}/${id}`);
};

export const updateCompany = async (payload: any, id: number) => {
    return await put(`${COMPANY}/${id}`, payload);
};

export const deleteCompany = async (id: number) => {
    return await del(`${COMPANY}/${id}`);
};

export const getCompanyMapping = async (body: any) => {
    return await post(`${COMPANYMAPPING}/findall`, body)
}

export const deleteCompanyMapping = async (id: number) => {
    return await del(`${COMPANYMAPPING}/${id}`);
}

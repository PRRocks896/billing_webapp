import {
    MODULESECTION
} from "../utils/constant";
import { get, post, del, put } from "../utils/axios";

export const getModuleSection = async (body: any) => {
    return await post(`${MODULESECTION}/finall`, body);
}

export const getModuleSectionList = async (body: any) => {
    const response = await post(`${MODULESECTION}/list`, body);
    return response;
};

export const createBulkModuleSection = async (body: any) => {
    return await post(`${MODULESECTION}/bulk-create`, body);
}

export const updateBulkModuleSection = async (body: any) => {
    return await put(`${MODULESECTION}/bulk-update`, body);
}

export const createModuleSection = async (body: any) => {
    const response = await post(MODULESECTION, body);
    return response;
};

export const getModuleSectionById = async (id: number) => {
    const response = await get(`${MODULESECTION}/${id}`);
    return response;
};

export const updateModuleSection = async (payload: any, id: number) => {
    const response = await put(`${MODULESECTION}/${id}`, payload);
    return response;
};

export const deleteModuleSection = async (id: number) => {
    const response = await del(`${MODULESECTION}/${id}`);
    return response;
};

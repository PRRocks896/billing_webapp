import {
    SALARY
} from "../utils/constant";
import { get, post, del, put, getxlsx, getpdf } from "../utils/axios";

export const downloadSalary = async (body: any, fileName: string) => {
    return await getxlsx(`${SALARY}/report`, body, fileName, true);
}

export const validateIfscCode = async (payload: any) => {
    const response = await post(`${SALARY}/validate-ifsc-code`, payload);
    return response;
}

export const getSalary = async (body: any) => {
    const response = await post(`${SALARY}/get`, body);
    return response;
}

export const getSalaryList = async (body: any) => {
    const response = await post(`${SALARY}/list`, body);
    return response;
};

export const createSalary = async (body: any) => {
    const response = await post(SALARY, body);
    return response;
};

export const createBulkSalary = async (body: any) => {
    return await post(`${SALARY}/bulk-create`, body);
}

export const getSalaryById = async (id: number) => {
    const response = await get(`${SALARY}/${id}`);
    return response;
};

export const updateSalary = async (payload: any, id: number) => {
    const response = await put(`${SALARY}/${id}`, payload);
    return response;
};

export const deleteSalary = async (id: number) => {
    const response = await del(`${SALARY}/${id}`);
    return response;
};

export const exportCompanyWiseSalary = async (payload: any, fileName: string) => {
    return await getpdf(`${SALARY}/company-salary-report`, payload, fileName, true);
}

export const exportCompanyWiseSalaryPayment = async (payload: any, fileName: string) => {
    return await getxlsx(`${SALARY}/salary-payment-sheet`, payload, fileName, true);
}

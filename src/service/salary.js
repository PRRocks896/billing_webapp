import {
    SALARY
} from "../utils/constant";
import { get, post, remove, put, getXlxsWithFile, getPDF } from "./webRequest";

export const downloadSalary = async (body, fileName) => {
    return await getXlxsWithFile(`${SALARY}/report`, body, fileName);
}

export const validateIfscCode = async (payload) => {
    const response = await post(`${SALARY}/validate-ifsc-code`, payload);
    return response;
}

export const getSalary = async (body) => {
    const response = await post(`${SALARY}/get`, body);
    return response;
}

export const getSalaryList = async (body) => {
    const response = await post(`${SALARY}/list`, body);
    return response;
};

export const createSalary = async (body) => {
    const response = await post(SALARY, body);
    return response;
};

export const createBulkSalary = async (body) => {
    return await post(`${SALARY}/bulk-create`, body);
}

export const getSalaryById = async (id) => {
    const response = await get(`${SALARY}/${id}`);
    return response;
};

export const updateSalary = async (payload, id) => {
    const response = await put(`${SALARY}/${id}`, payload);
    return response;
};

export const deleteSalary = async (id) => {
    const response = await remove(`${SALARY}/${id}`);
    return response;
};

export const exportCompanyWiseSalary = async (payload, fileName) => {
    return await getPDF(`${SALARY}/company-salary-report`, payload, false, fileName);
}

export const exportCompanyWiseSalaryPayment = async (payload, fileName) => {
    return await getXlxsWithFile(`${SALARY}/salary-payment-sheet`, payload, fileName);
}

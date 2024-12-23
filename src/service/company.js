import { COMPANY } from "../utils/constant";
import { get, post, remove, put } from "./webRequest";

export const getCompanyList = async (body) => {
  const response = await post(`${COMPANY}/list`, body);
  return response;
};

export const createCompany = async (body) => {
  const response = await post(COMPANY, body);
  return response;
};

export const getCompanyById = async (id) => {
  const response = await get(`${COMPANY}/${id}`);
  return response;
};

export const updateCompany = async (payload, id) => {
  const response = await put(`${COMPANY}/${id}`, payload);
  return response;
};

export const deleteCompany = async (id) => {
  const response = await remove(`${COMPANY}/${id}`);
  return response;
};

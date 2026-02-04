import { LAUNDARYMANAGEMENT } from "../utils/constant";
import { post, put, get, remove, getPDF } from "./webRequest";

export const getLaundryManagementList = async (body) => {
  return await post(`${LAUNDARYMANAGEMENT}/list`, body);
};

export const bulkCreateLaundaryManagement = async (body) => {
  return await post(`${LAUNDARYMANAGEMENT}/bulkcreate`, body);
};

export const deleteLaundaryManagement = async (id) => {
  return await remove(`${LAUNDARYMANAGEMENT}/${id}`);
};

export const getLaundaryManagementById = async (id) => {
  return await get(`${LAUNDARYMANAGEMENT}/${id}`);
};

export const updateLaundaryManagement = async (payload, id) => {
  return await put(`${LAUNDARYMANAGEMENT}/${id}`, payload);
};

export const fetchLaundryManagementViaPayload = async (payload) => {
  return await post(`${LAUNDARYMANAGEMENT}/find`, payload);
};

export const fetchReportLaundryManagement = async (payload, fileName) => {
  return await getPDF(`${LAUNDARYMANAGEMENT}/item-report`, payload, false, fileName);
};
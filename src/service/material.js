import {
    MATERIAL
} from "../utils/constant";
import {
    post,
    put,
    get,
    remove
} from "./webRequest";

export const getMaterialList = async (body) => {
  return await post(`${MATERIAL}/list`, body);
};

export const createMaterial = async (body) => {
  return await post(MATERIAL, body);
};

export const createMaterialDropdown = async (body) => {
  return await post(`${MATERIAL}/dropdown`, body);
};

export const deleteMaterial = async (id) => {
  return await remove(`${MATERIAL}/${id}`);
};

export const getMaterialById = async (id) => {
  return await get(`${MATERIAL}/${id}`);
};

export const updateMaterial = async (payload, id) => {
  return await put(`${MATERIAL}/${id}`, payload);
};
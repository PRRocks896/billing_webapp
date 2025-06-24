import { 
    LAUNDARYMANAGEMENT 
} from "../utils/constant"
import {
    post,
    put,
    get,
    remove
} from "./webRequest";

export const getLaundryManagementList = async (body) => {
    return await post(`${LAUNDARYMANAGEMENT}/list`, body);
};

export const createLaundaryManagement = async (body) => {
    return await post(LAUNDARYMANAGEMENT, body);
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
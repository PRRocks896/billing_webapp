import { 
    LAUNDRYRECEIVER 
} from "../utils/constant"
import {
    post,
    put,
    get,
    remove
} from "./webRequest";

export const getLaundryReceiverList = async (body) => {
    return await post(`${LAUNDRYRECEIVER}/list`, body);
};

export const bulkCreateLaundryReceiver = async (body) => {
    return await post(`${LAUNDRYRECEIVER}/bulkcreate`, body);
  };
  
  export const deleteLaundryReceiver = async (id) => {
    return await remove(`${LAUNDRYRECEIVER}/${id}`);
  };
  
  export const getLaundryReceiverById = async (id) => {
    return await get(`${LAUNDRYRECEIVER}/${id}`);
  };
  
  export const updateLaundryReceiver = async (payload, id) => {
    return await put(`${LAUNDRYRECEIVER}/${id}`, payload);
  };

  export const updateBulkReceiver = async (payload) => {
    return await post(`${LAUNDRYRECEIVER}/bulkupdate`, payload);
  }
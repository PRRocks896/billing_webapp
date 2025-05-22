import {
  CREATE_BARCODE_API,
  GET_SINGLE_BARCODE_API,
  UPDATE_BARCODE_API,
  DELETE_BARCODE_API,
  BARCODE_FIND_API
} from "../utils/constant";
import { attachId, get, post, put, remove } from "./webRequest";


export const getBarcodeByFind = async (body) => {
  return await post(BARCODE_FIND_API, body);
};


export const getBarcodeList = async (body) => {
  const response = await post(body);
  return response;
};


export const createBarcode = async (body) => {
  const response = await post(CREATE_BARCODE_API, body); 
  return response;
};


export const getBarcodeById = async (id) => {
  const newUrl = await attachId(GET_SINGLE_BARCODE_API, id);
  const response = await get(newUrl);
  return response;
};


export const updateBarcode = async (id, payload) => {
  const newUrl = await attachId(UPDATE_BARCODE_API, id);
  const response = await put(newUrl, payload);
  return response;
};


export const deleteBarcode = async (id) => {
  const newUrl = await attachId(DELETE_BARCODE_API, id);
  const response = await remove(newUrl);
  return response;
};

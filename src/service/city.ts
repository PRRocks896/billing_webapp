import {
    CREATE_CITY_API,
    GET_SINGLE_CITY_API,
    CITY_LIST_API,
    UPDATE_CITY_API,
    DELETE_CITY_API,
    CITY_FIND_API,
    CITYMAPPING
} from "../utils/constant";
import { get, post, del, put } from "../utils/axios";

export const getCityByFind = async (body: any) => {
    return await post(CITY_FIND_API, body);
}

export const getCityList = async (body: any) => {
    return await post(CITY_LIST_API, body);
};

export const createCity = async (body: any) => {
    return await post(CREATE_CITY_API, body);
};

export const getCityById = async (id: number) => {
    return await get(GET_SINGLE_CITY_API + id);
};

export const updateCity = async (payload: any, id: number) => {
    return await put(UPDATE_CITY_API + id, payload);
};

export const deleteCity = async (id: number) => {
    return await del(DELETE_CITY_API + id);
};

export const getCityMapping = async (body: any) => {
    return await post(`${CITYMAPPING}/findall`, body)
}

export const deleteCityMapping = async (id: number) => {
    return await del(`${CITYMAPPING}/${id}`);
}


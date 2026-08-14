import {
    CREATE_STATES_API,
    GET_SINGLE_STATES_API,
    STATES_LIST_API,
    UPDATE_STATES_API,
    DELETE_STATES_API,
} from "../utils/constant";
import { get, post, del, put } from "../utils/axios";

export const getStatesList = async (body: any) => {
    return await post(STATES_LIST_API, body);
};

export const createStates = async (body: any) => {
    return await post(CREATE_STATES_API, body);
};

export const getStateListPayload = async (body: any) => {
    return await post(`${CREATE_STATES_API}/find`, body);
}

export const getStatesById = async (id: number) => {
    return await get(GET_SINGLE_STATES_API + id);
};

export const updateStates = async (payload: any, id: number) => {
    return await put(UPDATE_STATES_API + id, payload);
};

export const deleteState = async (id: number) => {
    return await del(DELETE_STATES_API + id);
};

import {
    CREATE_BULK_RIGHT_API,
    CREATE_RIGHT_API,
    RIGHT_LIST_API
} from "utils/constant";

import { post } from "utils/axios";


export const createBulkRight = async (body: any) => {
    return await post(CREATE_BULK_RIGHT_API, body);
}

export const createRight = async (body: any) => {
    const response = await post(CREATE_RIGHT_API, body);
    return response;
};

export const getRightList = async (body: any) => {
    const response = await post(RIGHT_LIST_API, body);
    return response;
}
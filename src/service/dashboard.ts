import {
    FETCH_DASHBOARD_DETAILS_API,
    CREATE_BILL_API
} from "utils/constant";

import { get, post } from "utils/axios";

export const fetchDashboardDetails = async (params: any) => {
    return await get(FETCH_DASHBOARD_DETAILS_API, params);
}

export const fetchBranchWiseIncome = async (body: any) => {
    return await post(`${FETCH_DASHBOARD_DETAILS_API}/income-round`, body);
}

export const repeatCustomer = async (body: any) => {
    return await post(`${CREATE_BILL_API}/repeat-customer`, body);
}
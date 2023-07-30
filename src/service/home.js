import { FETCH_DASHBOARD_DETAILS_API } from "../utils/constant";
import { get } from "./webRequest";

export const fetchDashboardDetails = async (params) => {
  const response = await get(FETCH_DASHBOARD_DETAILS_API, params);
  return response;
};

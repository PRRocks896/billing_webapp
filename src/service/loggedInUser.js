import { GET_LOGGED_IN_USER_API } from "../utils/constant";
import { get } from "./webRequest";

export const fetchLoggedInUserData = async () => {
  const response = await get(GET_LOGGED_IN_USER_API);
  return response;
};

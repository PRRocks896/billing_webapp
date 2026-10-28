import { CREATE_ATTENDANCE_API } from "../utils/constant";
import { post } from "../utils/axios";

export const createAttendance = async (body: any) => {
    return await post(CREATE_ATTENDANCE_API, body);
};

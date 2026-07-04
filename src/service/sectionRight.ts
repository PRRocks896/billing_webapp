import { SECTIONRIGHT } from "utils/constant";
import { post, put } from "utils/axios";

/** Fetch all sectionRights matching a where clause (no pagination) */
export const getAllSectionRights = async (body: any) => {
    return await post(`${SECTIONRIGHT}/finall`, body);
};

/** Paginated list */
export const getSectionRightList = async (body: any) => {
    return await post(`${SECTIONRIGHT}/list`, body);
};

/** Upsert bulk section rights */
export const createBulkSectionRight = async (body: any) => {
    return await post(`${SECTIONRIGHT}/bulk-create`, body);
};
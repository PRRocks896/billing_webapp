import {
    EXPENSE
} from "../utils/constant";
import { post } from "./webRequest";

export const hardDeleteExpense = async (id) => {
    return await post(`${EXPENSE}/hard-delete/${id}`, {});
}
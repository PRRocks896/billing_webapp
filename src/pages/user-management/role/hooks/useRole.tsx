import { use } from "react";
import RoleContext from "../context/roleContext";

export default function useRole() {
    const context = use(RoleContext);

    if (!context) throw new Error('context must be use inside provider');

    return context;
}
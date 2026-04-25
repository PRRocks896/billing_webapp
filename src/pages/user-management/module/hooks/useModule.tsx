import { use } from "react";
import ModuleContext from "../context/moduleContext";

export default function useModule() {
    const context = use(ModuleContext);

    if (!context) throw new Error('context must be use inside provider');

    return context;
}
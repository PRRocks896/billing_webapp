import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import {
    listPayload
} from "../utils/helper";
import {
    getStaffList,
    getManager
} from "../service/staff";
import {
    useDateChangeChecker
} from "./useDateChangeChecker";

const useManagerName = () => {
    const loggedInUser = useSelector((state) => state.loggedInUser);
    const isDateChanged = useDateChangeChecker();
    const [showModal, setShowModal] = useState(false);
    const [managerOption, setManagerOption] = useState([]);

    const handleClose = () => {
        setShowModal(false);
    }

    const fetchManager = async (searchText = '') => {
        const whereCondition = {
            isActive: true,
            isDeleted: false
        };
        const response = await getManager(
            searchText.length > 0 ?
                {...whereCondition, searchText} : 
                {...whereCondition, searchText, createdBy: loggedInUser.id}
        );
        // const response = await getStaffList(listPayload(0, ['admin', 'super admin'].includes(loggedInUser?.px_role?.name?.toLowerCase()) ? {...whereCondition, searchText: "MANAGER"} : {...whereCondition, searchText: "MANAGER", createdBy: loggedInUser.id}, 100000));
        if(response && response.success) {
            setManagerOption(response.data);
        }
    }

    const handleSelectManager = (selectedManager) => {
        // if(selectedManager && typeof selectedManager === "object") {
        //     localStorage.setItem("managerId", selectedManager.id);
        //     localStorage.setItem("managerName", selectedManager.name);
        //     localStorage.setItem("serverDate", moment(new Date()).format("YYYY-MM-DD"));
        //     setShowModal(false);
        // }
    }

    useEffect(() => {
        // if(isDateChanged) {
        //     setShowModal(true);
        //     localStorage.removeItem("managerId");
        //     localStorage.removeItem("managerName");
        //     localStorage.removeItem("serverDate");
        // }
        // fetchManager();
    }, [isDateChanged]);

    return {
        showModal,
        managerOption,
        handleClose,
        setShowModal,
        fetchManager,
        handleSelectManager
    }
}

export default useManagerName;
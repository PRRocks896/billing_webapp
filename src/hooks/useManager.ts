import { useEffect, useState } from "react";
import { useDateChangeChecker } from "./useDateChangeChecker";
import { getManager } from "service/staff";
import moment from "moment";
import { UserProfile } from "types/user-profile";

type IProps = {
    user: UserProfile | null | undefined,
    isAdmin: boolean
}

const UseManager = ({ user, isAdmin }: IProps) => {
    const isDateChanged = useDateChangeChecker();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [managerOption, setManagerOption] = useState<any[]>([]);

    const handleClose = () => {
        setShowModal(false);
    }

    const fetchManager = async () => {
        const whereCondition = {
            isActive: true,
            isDeleted: false
        };
        const response: any = await getManager(
            isAdmin ?
                { ...whereCondition } :
                { ...whereCondition, createdBy: user?.id }
        );
        if (response && response.success && Array.isArray(response.data) && response.data.length > 0) {
            localStorage.setItem("managerId", isAdmin ? response.data[0].id : response.data.map((item: any) => item.id).join(","));
            localStorage.setItem("managerName", isAdmin ? response.data[0].nickName : response.data.map((item: any) => item.nickName).join(","));
            localStorage.setItem("serverDate", moment(new Date()).format("YYYY-MM-DD"));
            setManagerOption(response.data);
        }
    }

    const handleSelectManager = (selectedManager: any) => {
        if (selectedManager && selectedManager.length > 0) {
            localStorage.setItem("managerId", isAdmin ? selectedManager[0].id : selectedManager.map((item: any) => item.id).join(","));
            localStorage.setItem("managerName", isAdmin ? selectedManager[0].nickName : selectedManager.map((item: any) => item.nickName).join(","));
            localStorage.setItem("serverDate", moment(new Date()).format("YYYY-MM-DD"));
        }
    }

    useEffect(() => {
        if (isDateChanged) {
            localStorage.removeItem("managerId");
            localStorage.removeItem("managerName");
            localStorage.removeItem("serverDate");
        }
        fetchManager();
        // eslint-disable-next-line
    }, [isDateChanged, isAdmin]);

    return {
        showModal,
        managerOption,
        handleClose,
        setShowModal,
        fetchManager,
        handleSelectManager
    }
}

export default UseManager;
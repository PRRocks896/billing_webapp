import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';

import { listPayload, showToast } from "../../../utils/helper";
import { startLoading, stopLoading } from "../../../redux/loader";
import { dropdownUserList } from "../../../service/users";
import { fetchReportLaundryManagement } from "../../../service/LaundaryManagement";
import { fetchReportLaundryReceiver } from "../../../service/laundryReceiver";

const useLaundryReport = () => {
    const dispatch = useDispatch();
    const loggedInUser = useSelector((state) => state.loggedInUser);

    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [selectedUser, setSelectedUser] = useState(null);

    const [yearReceiver, setYearReceiver] = useState(new Date().getFullYear());
    const [monthReceiver, setMonthReceiver] = useState(new Date().getMonth() + 1);
    const [selectedUserReceiver, setSelectedUserReceiver] = useState(null);

    const [userList, setUserList] = useState([]);

    const fetchUserList = async () => {
        try {
            dispatch(startLoading());
            let whereCondition = {
                isActive: true,
                isDeleted: false,
            };
            const { success, message, data } = await dropdownUserList(whereCondition);
            if (success) {
                setUserList(data.filter((item) => !['admin', 'super admin'].includes(item?.px_role?.name.toLowerCase())));
            } else {
                showToast("error", message);
            }
        } catch (error) {
            showToast("error", error?.message);
        } finally {
            dispatch(stopLoading());
        }
    }

    const handleFetchReportLaundryManagement = async () => {
        try {
            dispatch(startLoading());
            let whereCondition = {
                isActive: true,
                isDeleted: false,
                month: month,
                year: year,
                userID: selectedUser
            };
            await fetchReportLaundryManagement(whereCondition, `Laundry_Management_Report_${userList.find((item) => item.id === selectedUser)?.lastName}_${month}_${year}.pdf`);
        } catch (error) {
            showToast("error", error?.message);
        } finally {
            dispatch(stopLoading());
        }
    }

    const handleFetchReportLaundryReceiver = async () => {
        try {
            dispatch(startLoading());
            let whereCondition = {
                isActive: true,
                isDeleted: false,
                month: monthReceiver,
                year: yearReceiver,
                userID: selectedUserReceiver
            };
            await fetchReportLaundryReceiver(whereCondition, `Laundry_Receiver_Report_${userList.find((item) => item.id === selectedUserReceiver)?.lastName}_${monthReceiver}_${yearReceiver}.pdf`);
        } catch (error) {
            showToast("error", error?.message);
        } finally {
            dispatch(stopLoading());
        }
    }


    useEffect(() => {
        fetchUserList();
    }, []);

    return {
        year,
        month,
        yearReceiver,
        monthReceiver,
        selectedUser,
        selectedUserReceiver,
        userList,
        setYear,
        setMonth,
        setYearReceiver,
        setMonthReceiver,
        setSelectedUser,
        setSelectedUserReceiver,
        handleFetchReportLaundryManagement,
        handleFetchReportLaundryReceiver
    }

}

export default useLaundryReport
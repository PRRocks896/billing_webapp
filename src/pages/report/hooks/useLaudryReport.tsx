import { useEffect, useState } from "react";

import { getBranch } from "service/user";
import { fetchReportLaundryManagement } from "service/laundry-management";
import { fetchReportLaundryReceiver } from "service/laundry-receiver";
import useAuth from "hooks/useAuth";
import { openSnackbar } from "api/snackbar";

const UseLaundryReport = () => {
    const { user, startLoading, stopLoading } = useAuth();

    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [selectedUser, setSelectedUser] = useState<number | null>(null);

    const [yearReceiver, setYearReceiver] = useState<number>(new Date().getFullYear());
    const [monthReceiver, setMonthReceiver] = useState<number>(new Date().getMonth() + 1);
    const [selectedUserReceiver, setSelectedUserReceiver] = useState<number | null>(null);

    const [userList, setUserList] = useState<any[]>([]);

    const fetchUserList = async () => {
        try {
            startLoading();
            let whereCondition = {
                isActive: true,
                isDeleted: false,
            };
            const { success, message, data }: any = await getBranch(whereCondition);
            if (success) {
                setUserList(data.filter((item: any) => !['admin', 'super admin'].includes(item?.px_role?.name.toLowerCase())));
            } else {
                openSnackbar({
                    open: true,
                    message: message || "Failed to update record",
                    variant: 'alert',
                    severity: 'error',
                    alert: { color: 'error' }
                });
            }
        } catch (error: any) {
            openSnackbar({
                open: true,
                message: error?.message || 'Something went wrong during submission',
                variant: 'alert',
                severity: 'error',
                alert: { color: 'error' }
            });
        } finally {
            stopLoading();
        }
    }

    const handleFetchReportLaundryManagement = async () => {
        try {
            startLoading();
            let whereCondition = {
                isActive: true,
                isDeleted: false,
                month: month,
                year: year,
                userID: selectedUser
            };
            await fetchReportLaundryManagement(whereCondition, `Laundry_Management_Report_${userList.find((item) => item.id === selectedUser)?.lastName}_${month}_${year}.xlsx`);
        } catch (error: any) {
            openSnackbar({
                open: true,
                message: error?.message || 'Something went wrong during submission',
                variant: 'alert',
                severity: 'error',
                alert: { color: 'error' }
            });
        } finally {
            stopLoading();
        }
    }

    const handleFetchReportLaundryReceiver = async () => {
        try {
            startLoading();
            let whereCondition = {
                isActive: true,
                isDeleted: false,
                month: monthReceiver,
                year: yearReceiver,
                userID: selectedUserReceiver
            };
            await fetchReportLaundryReceiver(whereCondition, `Laundry_Receiver_Report_${userList.find((item) => item.id === selectedUserReceiver)?.lastName}_${monthReceiver}_${yearReceiver}.pdf`);
        } catch (error: any) {
            openSnackbar({
                open: true,
                message: error?.message || 'Something went wrong during submission',
                variant: 'alert',
                severity: 'error',
                alert: { color: 'error' }
            });
        } finally {
            stopLoading();
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

export default UseLaundryReport;
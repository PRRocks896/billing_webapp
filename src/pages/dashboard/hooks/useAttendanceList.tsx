import { useEffect, useState } from "react";

import { getAttendanceList } from "service/staff";
import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";

const UseAttendanceList = () => {
    const { isAdmin, user, startLoading, stopLoading } = useAuth();
    const [staffList, setStaffList] = useState<any[]>([]);

    const fetchAttendanceList = async () => {
        try {
            startLoading();
            let body: any = {
                isActive: true,
                isDeleted: false,
            };
            if (!isAdmin) {
                body = {
                    ...body,
                    createdBy: user?.id,
                };
            }
            const { success, message, data }: any = await getAttendanceList(body);
            if (!success) {
                openSnackbar({
                    open: true,
                    message: message,
                    variant: 'alert',
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                });
                return;
            }
            if (data) {
                setStaffList(data);
            }
        } catch (error: any) {
            openSnackbar({
                open: true,
                message: error?.message || error?.messageCode || (error as Error).message || 'Something went wrong',
                variant: 'alert',
                severity: 'error',
                alert: {
                    color: 'error'
                }
            })
        } finally {
            stopLoading();
        }
    }

    useEffect(() => {
        fetchAttendanceList();
    }, []);

    return {
        staffList,
        fetchAttendanceList
    }
}

export default UseAttendanceList;
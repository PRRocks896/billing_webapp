import { useEffect, useState } from "react";

import { getAttendanceList } from "service/staff";
import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";

const UseAttendanceList = (companyID?: number | null) => {
    const { isAdmin, user, startLoading, stopLoading } = useAuth();
    const [staffList, setStaffList] = useState<any[]>([]);

    const fetchAttendanceList = async () => {
        try {
            startLoading();
            let body: any = {
                isActive: true,
                isDeleted: false,
            };

            if (companyID) {
                body = {
                    ...body,
                    companyID: companyID,
                };
            }

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
    }, [companyID]);

    return {
        staffList,
        fetchAttendanceList
    }
}

export default UseAttendanceList;
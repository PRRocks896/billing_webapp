import { useCallback, useEffect, useState } from "react";

import { exportCompanyWiseSalary } from "service/salary";
import { getCompanyList } from "service/company";
import moment from "moment";
import useAuth from "hooks/useAuth";
import { openSnackbar } from "api/snackbar";
import { listPayload } from "utils/helper";

const UseCompanyStaffSalaryReport = () => {
    const { startLoading, stopLoading } = useAuth();
    const [month, setMonth] = useState((moment().month() + 1));
    const [year, setYear] = useState(moment().format('yyyy'));
    const [companyList, setCompanyList] = useState<any[]>([]);
    const [selectedCompany, setSelectedCompany] = useState(null);

    const fetchCompany = async () => {
        try {
            startLoading();
            const body = listPayload(0, { isActive: true, isDeleted: false }, 1000);
            const { success, message, data }: any = await getCompanyList(body);
            if (success) {
                const payload = data?.rows;
                setCompanyList(payload);
            } else {
                openSnackbar({
                    open: true,
                    message: message || "Failed to fetch company list",
                    variant: 'alert',
                    severity: 'error',
                    alert: { color: 'error' }
                });
                setCompanyList([]);
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

    const getReport = async () => {
        try {
            startLoading();
            if (year && year.length !== 4) {
                openSnackbar({
                    open: true,
                    message: 'Please Enter Correct Year',
                    variant: 'alert',
                    severity: 'error',
                    alert: { color: 'error' }
                });
                return;
            }
            if (!selectedCompany) {
                openSnackbar({
                    open: true,
                    message: 'Please Select Company',
                    variant: 'alert',
                    severity: 'error',
                    alert: { color: 'error' }
                });
                return;
            }
            await exportCompanyWiseSalary({
                year: year,
                month: month,
                companyID: selectedCompany
            }, `${companyList.find((item: any) => item.id === selectedCompany)?.companyName}_${year}_${month}.pdf`.toLowerCase());
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
        fetchCompany();
    }, []);

    return {
        year,
        month,
        companyList,
        setYear,
        setMonth,
        getReport,
        setSelectedCompany
    }
}

export default UseCompanyStaffSalaryReport;
import { useEffect, useState } from "react";
import moment from "moment";

import { getCompanyList } from "service/company";
import { getUserList } from "service/user";
import { getPaymentBankDropdownList } from "service/paymentBank";
import { exportCompanyWiseSalaryPayment } from "service/salary";

import useAuth from "hooks/useAuth"
import { listPayload } from "utils/helper";
import { openSnackbar } from "api/snackbar";

const UseCompanyStaffPaymentReport = () => {
    const { startLoading, stopLoading } = useAuth();

    const [month, setMonth] = useState((moment().month() + 1));
    const [year, setYear] = useState(moment().format('yyyy'));
    const [companyList, setCompanyList] = useState<any[]>([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [userList, setUserList] = useState([]);
    const [selectedUser, setSelectedUser] = useState<any[] | null>(null);
    const [paymentBankList, setPaymentBankList] = useState([]);
    const [selectedPaymentBank, setSelectedPaymentBank] = useState(null);

    const fetchUserList = async (companyId = "") => {
        try {
            startLoading();
            let whereCondition: any = {
                isActive: true,
                isDeleted: false,
            };
            if (companyId) {
                whereCondition = {
                    ...whereCondition,
                    companyID: companyId,
                }
            }

            const payload = listPayload(0, whereCondition, 100000);
            const { success, message, data }: any = await getUserList(payload);
            if (success) {
                const items = data?.rows?.filter((row: any) => row && row.px_role && row.px_role.name && !['admin', 'super admin'].includes(row.px_role.name.toLowerCase()))?.map((row: any) => ({
                    value: row.id,
                    label: row.lastName,
                }));
                setUserList(items);
                // setUserList([{value: null, label: 'All'}].concat(items));
            } else {
                openSnackbar({
                    open: true,
                    message: message || "Failed to fetch user list",
                    variant: 'alert',
                    severity: 'error',
                    alert: { color: 'error' }
                });
                setUserList([]);
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
            if (!month) {
                openSnackbar({
                    open: true,
                    message: 'Please Select Month',
                    variant: 'alert',
                    severity: 'error',
                    alert: { color: 'error' }
                });
                return;
            }
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
            if (!selectedPaymentBank) {
                openSnackbar({
                    open: true,
                    message: 'Please Selet Payment Bank',
                    variant: 'alert',
                    severity: 'error',
                    alert: { color: 'error' }
                });
                return;
            }
            const branches = selectedUser?.filter((item: any) => item.value).map((item: any) => item?.value)
            await exportCompanyWiseSalaryPayment({
                year: year,
                month: month,
                companyID: selectedCompany,
                paymentBankID: selectedPaymentBank,
                branchId: branches
            }, `${companyList.find((item: any) => item.id === selectedCompany)?.companyName}_${year}_${month}_payment_sheet.xlsx`.toLowerCase());
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
        (async () => {
            try {
                startLoading();
                const where = {
                    isActive: true,
                    isDeleted: false
                }
                const body = listPayload(0, where, 1000);
                const [
                    companyResponse,
                    paymentBankResponse
                ]: any = await Promise.all([
                    getCompanyList(body),
                    getPaymentBankDropdownList(where)
                ]);
                if (companyResponse.success) {
                    const payload = companyResponse?.data?.rows;
                    setCompanyList(payload);
                } else {
                    setCompanyList([]);
                }
                if (paymentBankResponse.success) {
                    setPaymentBankList(paymentBankResponse.data);
                } else {
                    setPaymentBankList([]);
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
        })();
    }, []);

    return {
        year,
        month,
        userList,
        companyList,
        paymentBankList,
        setYear,
        setMonth,
        getReport,
        fetchUserList,
        setSelectedUser,
        setSelectedCompany,
        setSelectedPaymentBank
    }

}

export default UseCompanyStaffPaymentReport;
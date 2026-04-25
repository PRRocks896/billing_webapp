import { useEffect, useState, useMemo, useCallback } from "react";
import moment from "moment";

import {
    getAuditorStaffDetailReport,
    getReportList,
    getGstReportList,
    getManagerList,
    getStaffSalaryReport,
    getAttendanceStaffReport,
    getManagerInsentiveReport,
    getAuditorReport
} from "service/report";
import { getCompanyList } from "service/company";
import { getPaymentTypeList } from "service/payment-type";
import { getUserList } from "service/user";
import { getStaffList } from "service/staff";
import useAuth from "hooks/useAuth";
import { generateSlug, listPayload } from "utils/helper";
import { openSnackbar } from "api/snackbar";

// --- Constants ---
const SERVICE_LIST = [
    { value: 'bill', label: 'Bill' },
    { value: 'membership', label: 'Membership' },
    { value: 'membership-redeem', label: 'Membership Redeem' },
    { value: 'daily-report', label: 'Daily Report' },
    { value: 'renew-plan', label: 'Renew Plan' },
];

const DEFAULT_DATE_RANGE: [Date, Date] = [new Date(), new Date()];

// --- Types ---
interface Option {
    value: any;
    label: string;
    nickName?: string;
}

const useStaffReport = () => {
    const { user, startLoading, stopLoading } = useAuth();

    // --- State ---
    const [pdfData, setPdfData] = useState<any>(null);

    // Filter States
    const [dateRange, setDateRange] = useState<[Date, Date]>(DEFAULT_DATE_RANGE);
    const [gstDateRange, setGstDateRange] = useState<[Date, Date]>(DEFAULT_DATE_RANGE);
    const [managerDateRange, setManagerDateRange] = useState<[Date, Date]>(DEFAULT_DATE_RANGE);
    const [auditorDateRange, setAuditorDateRange] = useState<[Date, Date]>(DEFAULT_DATE_RANGE);

    // Selection States
    const [company, setCompany] = useState<any[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<Option | null>(null);
    const [paymentList, setPaymentList] = useState<Option[]>([]);
    const [selectedPayment, setSelectedPayment] = useState<any[]>([]);
    const [selectedGstPayment, setSelectedGstPayment] = useState<any[]>([]);
    const [managerList, setManagerList] = useState<any[]>([]);
    const [selectedManager, setSelectedManager] = useState<any[]>([]);
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [userList, setUserList] = useState<Option[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);

    // Attendance States
    const [attUserList, setAttUserList] = useState<Option[]>([]);
    const [selectedAttUser, setSelectedAttUser] = useState<any>(null);
    const [staffList, setStaffList] = useState<Option[]>([]);
    const [selectedStaff, setSelectedStaff] = useState<any>(null);
    const [attYear, setAttYear] = useState<number>(new Date().getFullYear());
    const [attMonth, setAttMonth] = useState<number>(new Date().getMonth() + 1);

    // Incentive States
    const [selectedInsentiveManager, setSelectedInsentiveManager] = useState<any>(null);
    const [insentiveManagerYear, setInsentiveManagerYear] = useState<number>(new Date().getFullYear());
    const [insentiveManagerMonth, setInsentiveManagerMonth] = useState<number>(new Date().getMonth() + 1);
    const [salesType, setSalesType] = useState<number>(0);
    const [weekDays, setWeekDays] = useState<any>(null);
    const [weekDaysPercentage, setWeekDaysPercentage] = useState<any>(null);
    const [weekEnd, setWeekEnd] = useState<any>(null);
    const [weekEndPercentage, setWeekEndPercentage] = useState<any>(null);

    // Auditor States
    const [auditorSelectedCompany, setAuditorSelectedCompany] = useState<Option | null>(null);
    const [selectedAuditorPayment, setSelectedAuditorPayment] = useState<any[]>([]);

    // Auditor Staff States
    const [auditorStaffSelectedYear, setAuditorStaffSelectedYear] = useState<number>(new Date().getFullYear());
    const [auditorStaffSelectedMonth, setAuditorStaffSelectedMonth] = useState<number>(new Date().getMonth() + 1);
    const [auditorStaffSelectedCompany, setAuditorStaffSelectedCompany] = useState<any>(null);
    const [auditorStaffSelectedBranch, setAuditorStaffSelectedBranch] = useState<any[]>([]);

    // --- Memoized Helpers ---
    const companyOptions = useMemo(() => {
        return company.map((item) => ({ value: item.id, label: item.companyName }));
    }, [company]);

    // --- Request Wrapper ---
    const wrapRequest = useCallback(async (requestFn: () => Promise<any>, errorMsg = "Something went wrong") => {
        try {
            startLoading();
            return await requestFn();
        } catch (error: any) {
            openSnackbar({
                open: true,
                message: error?.message || errorMsg,
                variant: 'alert',
                severity: 'error',
                alert: { color: 'error' }
            });
            return null;
        } finally {
            stopLoading();
        }
    }, [startLoading, stopLoading]);

    // --- Fetch Lists ---
    const fetchUserList = useCallback(async (companyId = "") => {
        await wrapRequest(async () => {
            const whereCondition = {
                isActive: true,
                isDeleted: false,
                ...(companyId && { companyID: companyId }),
            };
            const payload = listPayload(0, whereCondition, 100000);
            const { success, message, data }: any = await getUserList(payload);
            if (success) {
                const items = data?.rows?.map((row: any) => ({
                    value: row.id,
                    label: row.lastName,
                }));
                setUserList([{ value: null, label: 'All' }, ...items]);
            } else {
                throw new Error(message || "Failed to fetch user list");
            }
        }, "Failed to fetch user list");
    }, [wrapRequest]);

    const fetchAttUserList = useCallback(async () => {
        await wrapRequest(async () => {
            const payload = listPayload(0, { isActive: true, isDeleted: false }, 100000);
            const { success, message, data }: any = await getUserList(payload);
            if (success) {
                const items = data?.rows
                    ?.filter((row: any) => row.roleID !== 1)
                    ?.map((row: any) => ({ value: row.id, label: row.lastName }));
                setAttUserList(items);
            } else {
                throw new Error(message || "Failed to fetch user list");
            }
        });
    }, [wrapRequest]);

    const fetchBranch = useCallback(async () => {
        await wrapRequest(async () => {
            const body = listPayload(0, { isActive: true }, 1000);
            const { success, data }: any = await getCompanyList(body);
            if (success) {
                setCompany(data?.rows || []);
            } else {
                setCompany([]);
            }
        });
    }, [wrapRequest]);

    const fetchPaymentType = useCallback(async () => {
        await wrapRequest(async () => {
            const payload = listPayload(0, { isActive: true, isDeleted: false }, 100000);
            const { success, message, data }: any = await getPaymentTypeList(payload);
            if (success) {
                const items = data?.rows?.map((row: any) => ({ value: row.id, label: row.name }));
                setPaymentList([{ value: null, label: 'All' }, ...items]);
            } else {
                throw new Error(message || "Failed to fetch payment type");
            }
        });
    }, [wrapRequest]);

    const fetchManager = useCallback(async () => {
        await wrapRequest(async () => {
            const whereCondition = { isActive: true, isDeleted: false, searchText: "MANAGER" };
            const { success, message, data }: any = await getStaffList(listPayload(0, whereCondition, 100000));
            if (success) {
                setManagerList(data?.rows || []);
            } else {
                throw new Error(message || "Failed to fetch manager list");
            }
        });
    }, [wrapRequest]);

    const fetchStaffList = useCallback(async (userId = null) => {
        await wrapRequest(async () => {
            const whereCondition = {
                isActive: true,
                isDeleted: false,
                userID: userId || selectedAttUser || null,
            };
            const payload = listPayload(0, whereCondition, 100000);
            const { success, message, data }: any = await getStaffList(payload);
            if (success) {
                const items = data?.rows?.map((row: any) => ({
                    value: row.id,
                    label: row.name,
                    nickName: row.nickName
                }));
                setStaffList(items);
            } else {
                throw new Error(message || "Failed to fetch staff list");
            }
        });
    }, [wrapRequest, selectedAttUser]);

    // --- Report Fetchers ---
    const fetchManagerReportData = useCallback(async () => {
        await wrapRequest(async () => {
            setPdfData(null);
            const startDate = moment(managerDateRange[0]).format('yyyy-MM-DD');
            const endDate = moment(managerDateRange[1]).format('yyyy-MM-DD');
            const fileName = `Bill Software Manager's ${selectedService} report ${moment(startDate).format('DD-MM-yyyy')}-${moment(endDate).format('DD-MM-yyyy')}.xlsx`.toUpperCase();
            
            const body = { managerName: selectedManager, startDate, endDate };
            await getManagerList(body, selectedService!, fileName);
        });
    }, [wrapRequest, managerDateRange, selectedManager, selectedService]);

    const fetchGstReportData = useCallback(async () => {
        await wrapRequest(async () => {
            setPdfData(null);
            const startDate = moment(gstDateRange[0]).format('yyyy-MM-DD');
            const endDate = moment(gstDateRange[1]).format('yyyy-MM-DD');
            const fileName = `Bill Software all branch GST report ${moment(startDate).format('DD-MM-yyyy')}_${moment(endDate).format('DD-MM-yyyy')}.xlsx`.toUpperCase();

            const body = { paymentID: selectedGstPayment, startDate, endDate };
            const response = await getGstReportList(body, fileName);
            setPdfData(response);
        });
    }, [wrapRequest, gstDateRange, selectedGstPayment]);

    const fetchAttendanceReportData = useCallback(async () => {
        await wrapRequest(async () => {
            setPdfData(null);
            const body = {
                branchID: selectedUser || null,
                companyID: selectedCompany?.value,
                year,
                month,
            };
            const fileName = generateSlug(`${selectedCompany?.label}_salary_report_${year}_${month}.xlsx`.toLowerCase());
            const response = await getStaffSalaryReport(body, fileName);
            setPdfData(response);
        });
    }, [wrapRequest, selectedUser, selectedCompany, year, month]);

    const fetchInsentiveManagerReportData = useCallback(async () => {
        await wrapRequest(async () => {
            setPdfData(null);
            const manager = managerList.find((m) => m.id === selectedInsentiveManager);
            if (!manager) return;

            let body: any = {
                manegerID: selectedInsentiveManager,
                year: insentiveManagerYear,
                month: insentiveManagerMonth,
            };

            if (salesType === 0) {
                body = { ...body, amount1: weekDays, percentage1: weekDaysPercentage, amount2: weekEnd, percentage2: weekEndPercentage };
            } else {
                body = { ...body, weekDays, weekDaysPercentage, weekEnd, weekEndPercentage };
            }

            const fileName = generateSlug(`${manager.nickName}_(${manager.name})_insentive_report_${insentiveManagerYear}_${insentiveManagerMonth}.xlsx`.toLowerCase());
            await getManagerInsentiveReport(body, fileName);
        });
    }, [wrapRequest, managerList, selectedInsentiveManager, insentiveManagerYear, insentiveManagerMonth, salesType, weekDays, weekDaysPercentage, weekEnd, weekEndPercentage]);

    const fetchReportDate = useCallback(async () => {
        await wrapRequest(async () => {
            setPdfData(null);
            const body = {
                companyID: selectedCompany?.value,
                paymentID: selectedPayment,
                startDate: moment(dateRange[0]).format('yyyy-MM-DD'),
                endDate: moment(dateRange[1]).format('yyyy-MM-DD'),
            };
            const response = await getReportList(body);
            setPdfData(response);
        });
    }, [wrapRequest, selectedCompany, selectedPayment, dateRange]);

    const fetchStaffAttendanceReportData = useCallback(async () => {
        await wrapRequest(async () => {
            setPdfData(null);
            const branch = attUserList.find((item) => item.value === selectedAttUser);
            const staff = staffList.find((item) => item.value === selectedStaff);
            const payload = {
                branchID: selectedAttUser || null,
                staffID: selectedStaff || null,
                year: attYear,
                month: attMonth,
            };
            const fileName = generateSlug(`attendance_report_${branch?.label}_${staff?.label}_${attYear}_${attMonth}.pdf`.toLowerCase());
            const { success, data }: any = await getAttendanceStaffReport(payload, fileName);
            if (success) setPdfData(data);
        });
    }, [wrapRequest, attUserList, selectedAttUser, staffList, selectedStaff, attYear, attMonth]);

    const fetchAuditorStaffReportData = useCallback(async () => {
        await wrapRequest(async () => {
            const branches = auditorStaffSelectedBranch.filter((item) => item.value).map((item) => item.value);
            const companyLabel = companyOptions.find((item) => item.value === auditorStaffSelectedCompany)?.label || "company";
            const fileName = generateSlug(`${companyLabel}_auditor_staff_detail_report.xlsx`.toLowerCase());
            
            const payload: any = {
                companyID: auditorStaffSelectedCompany,
                year: auditorStaffSelectedYear,
                month: auditorStaffSelectedMonth,
                ...(branches.length > 0 && { branchID: branches })
            };
            await getAuditorStaffDetailReport(payload, fileName);
        });
    }, [wrapRequest, auditorStaffSelectedBranch, auditorStaffSelectedCompany, auditorStaffSelectedYear, auditorStaffSelectedMonth, companyOptions]);

    const fetchAuditorReportData = useCallback(async () => {
        await wrapRequest(async () => {
            setPdfData(null);
            const payload = {
                paymentID: selectedAuditorPayment,
                companyID: auditorSelectedCompany?.value,
                startDate: moment(auditorDateRange[0]).format('yyyy-MM-DD'),
                endDate: moment(auditorDateRange[1]).format('yyyy-MM-DD')
            };
            const fileName = generateSlug(`${auditorSelectedCompany?.label}_report_${moment(auditorDateRange[0]).format('yyyy-MM-DD')}_to_${moment(auditorDateRange[1]).format('yyyy-MM-DD')}.xlsx`.toLowerCase());
            const response: any = await getAuditorReport(payload, fileName);
            if (response?.success) setPdfData(response.data);
        });
    }, [wrapRequest, selectedAuditorPayment, auditorSelectedCompany, auditorDateRange]);

    // --- Event Handlers ---
    const handleAuditorDateChange = useCallback((value: any) => setAuditorDateRange(value), []);
    const handleManagerDateChange = useCallback((value: any) => setManagerDateRange(value), []);
    const handleGstDateChange = useCallback((value: any) => setGstDateRange(value), []);
    const handleDateChange = useCallback((value: any) => setDateRange(value), []);
    const handleBranchChange = useCallback((newValue: any) => setSelectedCompany(newValue), []);
    const handlePaymentChange = useCallback((newValue: any) => setSelectedPayment(newValue), []);
    const handleGstPaymentChange = useCallback((newValue: any) => setSelectedGstPayment(newValue), []);
    const handleManagerChange = useCallback((newValue: any) => setSelectedManager(newValue), []);

    // --- Effects ---
    useEffect(() => {
        fetchBranch();
        fetchPaymentType();
        fetchManager();
        fetchAttUserList();
    }, [user, fetchBranch, fetchPaymentType, fetchManager, fetchAttUserList]);

    return {
        attUserList,
        selectedAttUser,
        setSelectedAttUser,
        fetchStaffList,
        attMonth,
        setAttMonth,
        attYear,
        setAttYear,
        selectedStaff,
        setSelectedStaff,
        staffList,
        year,
        month,
        userList,
        selectedUser,
        setSelectedUser,
        pdfData,
        dateRange,
        gstDateRange,
        managerDateRange,
        auditoDateRange: auditorDateRange, // Keeping key name for backward compatibility
        auditorSelectedCompany,
        setAuditorSelectedCompany,
        selectedAuditorPayment,
        setSelectedAuditorPayment,
        handleAuditorDateChange,
        fetchAuditorReportData,
        managerList,
        paymentList,
        selectedCompany,
        companyOptions,
        serviceList: SERVICE_LIST,
        selectedService,
        isAdmin: true,
        selectedInsentiveManager,
        setSelectedInsentiveManager,
        insentiveManagerYear,
        setInsentiveManagerYear,
        insentiveManagerMonth,
        setInsentiveManagerMonth,
        setYear,
        setMonth,
        fetchUserList,
        fetchReportDate,
        handleDateChange,
        handleBranchChange,
        handlePaymentChange,
        fetchGstReportData,
        handleGstDateChange,
        handleGstPaymentChange,
        fetchManagerReportData,
        handleManagerDateChange,
        handleManagerChange,
        setSelectedService,
        fetchAttendanceReportData,
        fetchStaffAttendanceReportData,
        fetchInsentiveManagerReportData,
        setSalesType,
        salesType,
        weekDays,
        weekDaysPercentage,
        weekEnd,
        weekEndPercentage,
        setWeekDays,
        setWeekDaysPercentage,
        setweekEnd: setWeekEnd,
        setWeekEndPercentage,
        auditorStaffSelectedBranch,
        auditorStaffSelectedCompany,
        setAuditorStaffSelectedMonth,
        setAuditorStaffSelectedYear,
        setAuditorStaffSelectedBranch,
        setAuditorStaffSelectedCompany,
        fetchAuditorStaffReportData
    };
};

export default useStaffReport;
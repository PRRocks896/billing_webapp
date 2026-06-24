import { useEffect, useState } from "react";
import moment from "moment";

import { createSalary, validateIfscCode } from "service/salary";
import { getBranch } from "service/user";
import { getCompanyList } from "service/company";
import { getSalaryBranchWiseReport } from "service/report";
import useAuth from "hooks/useAuth";
import { useLocation } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { listPayload, showTwoDecimal } from "utils/helper";
import { openSnackbar } from "api/snackbar";

export type SalaryFormType = {
    staff: {
        staffID: number | null,
        accountHolderName: string,
        accountNumber: string,
        employeeType: string,
        ifscCode: string,
        lateDeduction: string,
        leave: string,
        advance: number | null,
        leaveCut: number | null,
        payableSalary: number | null,
        salary: string,
        staffId: string,
        staffName: string,
        tax: string,
        weekOff: string,
        workingDays: number,
        expense: string,
        totalDays: number,
        subSalary: number | null,
        isLeft: boolean,
        isPaid: boolean,
        takenAdvance: any,
    }[]
}

const defaultValues: SalaryFormType = {
    staff: [
        // {
        //     staffID: null,
        //     accountHolderName: "",
        //     accountNumber: "",
        //     employeeType: "",
        //     ifscCode: "",
        //     lateDeduction: "",
        //     leave: "",
        //     advance: null,
        //     leaveCut: null,
        //     payableSalary: 0,
        //     salary: "",
        //     staffId: "",
        //     staffName: "",
        //     tax: "",
        //     weekOff: "",
        //     workingDays: 0,
        //     expense: "0",
        //     totalDays: 0,
        //     subSalary: 0,
        //     isLeft: false,
        //     isPaid: false,
        //     takenAdvance: null
        // }
    ]
}

const UseSalary = () => {
    const { pathname } = useLocation();
    const { user, isAdmin, startLoading, stopLoading, accessRights } = useAuth();
    const rights = accessRights(pathname);

    const [month, setMonth] = useState((moment().month() + 1));
    const [year, setYear] = useState(moment().format('yyyy'));
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);

    const [branchList, setBranchList] = useState<any[]>([]);
    const [companyList, setCompanyList] = useState<any[]>([]);
    const [staffList, setStaffList] = useState<any[]>([]);

    const {
        control,
        formState: { isSubmitting },
        reset,
        setValue,
        getValues,
        handleSubmit
    } = useForm<SalaryFormType>({
        defaultValues,
        mode: "onBlur"
    });

    const {
        fields,
        append,
        remove
    } = useFieldArray({
        name: 'staff',
        control: control
    });

    const resetForm = () => {
        reset({
            staff: []
        });
    }

    const handleRemove = (index: number) => {
        remove(index);
        const updatedStaffList = [...staffList];
        updatedStaffList.splice(index, 1);
        setStaffList(updatedStaffList);
    }

    const searchList = async () => {
        try {
            startLoading();
            if (year && year.length !== 4) {
                openSnackbar({
                    open: true,
                    message: "Please Enter Correct Year",
                    variant: 'alert',
                    severity: 'error',
                    alert: { color: 'error' }
                });
                return;
            }
            if (selectedBranch === null) {
                openSnackbar({
                    open: true,
                    message: "Please Select Branch",
                    variant: 'alert',
                    severity: 'error',
                    alert: { color: 'error' }
                });
                return;
            }
            const { success, message, data }: any = await getSalaryBranchWiseReport({
                year: year,
                month: month,
                branchId: selectedBranch
            });
            if (!success) {
                openSnackbar({
                    open: true,
                    message: message || "Failed to fetch salary list",
                    variant: 'alert',
                    severity: 'error',
                    alert: { color: 'error' }
                });
                setStaffList([]);
                return;
            }
            if (data && Array.isArray(data) && data.length > 0) {
                setStaffList(data);
                data.forEach((item, index) => {
                    append({
                        ...item,
                        index: index,
                        expense: '0',
                        advance: '0',
                        isLeft: false,
                        isPaid: false
                    })
                })
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

    const fetchBatch = async () => {
        try {
            startLoading();
            const where = {
                isActive: true,
                isDeleted: false,
                companyID: selectedCompany
            }
            const { success, message, data }: any = await getBranch(where);

            if (success && data && Array.isArray(data) && data.length > 0) {
                const payload = data.filter((item: any) => {
                    if (item && item.px_role && item.px_role.name && !['admin', 'super admin'].includes(item.px_role.name.toLowerCase())) {
                        return item;
                    }
                });
                setBranchList(payload);
            } else {
                openSnackbar({
                    open: true,
                    message: message || "Failed to fetch branch list",
                    variant: 'alert',
                    severity: 'error',
                    alert: { color: 'error' }
                });
                setBranchList([]);
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

    const handleValidateIfscCode = async (value: string) => {
        try {
            startLoading();
            const { success }: any = await validateIfscCode({
                ifscCode: value
            });
            if (!success) {
                return 'Invalid IFSC Code';
            }
            return true;
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

    const onSubmit = async (data: SalaryFormType) => {
        try {
            startLoading();
            let payload = data.staff?.map((item) => ({
                ...item,
                year: year,
                month: month,
                createdBy: user?.id,
            }));
            const { success, message }: any = await createSalary(payload);
            if (!success) {
                openSnackbar({
                    open: true,
                    message: message || "Failed to create salary",
                    variant: 'alert',
                    severity: 'error',
                    alert: { color: 'error' }
                });
                return;
            }
            openSnackbar({
                open: true,
                message: message || "Salary created successfully",
                variant: 'alert',
                severity: 'success',
                alert: { color: 'success' }
            });
            setMonth(moment().month() + 1);
            setYear(moment().format('yyyy'));
            setSelectedBranch(null);
            setSelectedCompany(null);
            reset();
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

    const handleCheckAdvanceMoreThenSalary = (advanceValue: string, index: number) => {
        const selectedStaff = staffList.find((staff) => staff.staffId === getValues(`staff.${index}.staffId`));
        if (selectedStaff && selectedStaff.subSalary) {
            const expense = parseFloat(getValues(`staff.${index}.expense`)) || 0;
            const advance = parseFloat(advanceValue) || 0;
            const availableSalary = selectedStaff.subSalary - expense;

            if (advance > availableSalary) {
                const errorMsg = `Max advance: ₹${availableSalary.toFixed(2)}`;
                return errorMsg;
            }
        }
        return true;
    }

    const handleLeaveCalculation = (index: number) => {
        const selectedStaffRecord = staffList.find((staff) => staff.staffId === getValues(`staff.${index}.staffId`));
        const editableStaffRecord = getValues(`staff.${index}`);
        const totalLeave = parseInt(editableStaffRecord.leave || '0'); //+ parseInt(editableStaffRecord.weekOff || '0');
        let workingDays = editableStaffRecord.totalDays - totalLeave;
        setValue(`staff.${index}.workingDays`, workingDays);
        const perDaySalary = parseFloat(selectedStaffRecord.salary) / editableStaffRecord.totalDays;
        setValue(`staff.${index}.leaveCut`, showTwoDecimal(perDaySalary * totalLeave));
        const subSalary = (parseFloat(selectedStaffRecord.salary) - (perDaySalary * totalLeave));
        setValue(`staff.${index}.subSalary`, showTwoDecimal(subSalary));
        setStaffList(staffList.map((staff) => {
            if (staff.staffID === selectedStaffRecord.staffID) {
                return {
                    ...staff,
                    subSalary: showTwoDecimal(subSalary)
                }
            } else {
                return staff;
            }
        }));
    }

    const handleCalculation = (index: number) => {
        const selectedStaff = staffList.find((staff) => staff.staffID === getValues(`staff.${index}.staffID`));
        if (selectedStaff) {
            // if (selectedStaff && selectedStaff.subSalary) {
            const editableStaffRecord = getValues(`staff.${index}`);
            const totalLeave = parseInt(editableStaffRecord.leave || '0'); //+ parseInt(editableStaffRecord.weekOff || '0');
            let workingDays = editableStaffRecord.totalDays - (totalLeave + parseInt(editableStaffRecord.weekOff || '0'));
            setValue(`staff.${index}.workingDays`, workingDays);
            const perDaySalary = parseFloat(selectedStaff.salary) / editableStaffRecord.totalDays;
            setValue(`staff.${index}.leaveCut`, showTwoDecimal(perDaySalary * totalLeave));
            const subSalary = (parseFloat(selectedStaff.salary) - (perDaySalary * totalLeave));
            setValue(`staff.${index}.subSalary`, showTwoDecimal(subSalary));

            const expense = parseFloat(getValues(`staff.${index}.expense`)) || 0;
            const advance = showTwoDecimal(getValues(`staff.${index}.advance`) || 0);
            const total = subSalary - expense - advance;
            setValue(`staff.${index}.subSalary`, showTwoDecimal(total));
            handlePayableSalary(index);
        }
    }

    const handlePayableSalary = (index: number) => {
        const subSalary = getValues(`staff.${index}.subSalary`) || 0;
        const tax = parseFloat(getValues(`staff.${index}.tax`)) || 0;
        const payableSalary = subSalary - tax;
        setValue(`staff.${index}.payableSalary`, showTwoDecimal(payableSalary));
    }

    useEffect(() => {
        if (selectedCompany) {
            fetchBatch();
        }
    }, [selectedCompany]);

    useEffect(() => {
        if (isAdmin) {
            (async () => {
                try {
                    startLoading();
                    const where = {
                        isActive: true,
                        isDeleted: false
                    }
                    const body = listPayload(0, where, 1000);
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
            })();
        }
    }, [isAdmin]);

    return {
        year,
        month,
        fields,
        rights,
        control,
        isAdmin,
        branchList,
        companyList,
        isSubmitting,
        selectedBranch,
        selectedCompany,
        setYear,
        onSubmit,
        setMonth,
        getValues,
        resetForm,
        searchList,
        handleSubmit,
        handleRemove,
        handleCalculation,
        setSelectedBranch,
        setSelectedCompany,
        handleValidateIfscCode,
        handleLeaveCalculation,
        handleCheckAdvanceMoreThenSalary,
    }
}

export default UseSalary;
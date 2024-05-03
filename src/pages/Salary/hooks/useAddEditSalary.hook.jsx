import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import { listPayload, showToast } from "../../../utils/helper";

import {
    createSalary,
    updateSalary,
    getSalaryById
} from "../../../service/salary";
import {
    getStaffList
} from "../../../service/staff";
import { startLoading, stopLoading } from "../../../redux/loader";


export const useAddEditSalary = (tag) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const loggedInUser = useSelector((state) => state.loggedInUser);

    const [staffList, setStaffList] = useState([]);
    const { setValue, control, watch, getValues, handleSubmit } = useForm({
        defaultValues: {
            staffID: "",
            month: moment().month(),
            year: moment().format('yyyy'),
            workingDays: "",
            weekOff: "",
            advance: null,
            expenseCut: null,
            staffStatus: "Working",
            accountHolderName: "",
            accountNumber: "",
            reEnterAccountNumber: "",
            ifscCode: ""
        },
        mode: "onBlur",
    });

    const selectedStaff = useMemo(() => {
        const staff = staffList.find((item) => item.id === getValues('staffID'));
        if(staff) {
            return staff;
        }
        return null;
        // eslint-disable-next-line
    }, [watch('staffID'), staffList]);

    const totalLeave = useMemo(() => {
        return (moment(new Date()).subtract(1, 'M').daysInMonth()) - (parseInt(getValues('workingDays') || 0) + parseInt(getValues('weekOff') || 0));
        // eslint-disable-next-line
    }, [watch('workingDays'), watch('weekOff')]);

    const totalLeaveAmount = useMemo(() => {
        const staff = selectedStaff;
        const totalDays = moment(new Date()).subtract(1, 'M').daysInMonth();
        if(staff) {
            const perDaySalary = parseInt(staff.salary) / totalDays;
            return Math.round(totalLeave * perDaySalary);
        }
        return 0;
        // eslint-disable-next-line
    }, [totalLeave, selectedStaff]);

    const totalpayableAmount = useMemo(() => {
        const staff = selectedStaff;
        const expenseCut = getValues('expenseCut') || 0;
        const advance = getValues('advance') || 0;
        const totalDays = moment(new Date()).subtract(1, 'M').daysInMonth();
        if(staff) {
            const perDaySalary = parseInt(staff.salary) / totalDays;
            const totalPayableDays = totalDays - totalLeave;
            return (Math.round(totalPayableDays * perDaySalary) - advance - expenseCut);
        }
        return 0;
        // eslint-disable-next-line
    }, [totalLeave, selectedStaff, watch('expenseCut'), watch('advance')]);

    const fetchEditSalaryData = useCallback(async () => {
        try {
            if (id) {
                dispatch(startLoading());
                const {success, message, data} = await getSalaryById(id);
                if (success) {
                    setValue('staffID', data.staffID);
                    setValue('month', data.month);
                    setValue("year", data.year);
                    setValue("workingDays", data.workingDays);
                    setValue("weekOff", data.weekOff);
                    setValue("advance", data.advance);
                    setValue("expenseCut", data.expenseCut);
                    setValue("staffStatus", data.staffStatus);
                    setValue("accountHolderName", data.accountHolderName);
                    setValue("ifscCode", data.ifscCode);
                    setValue("accountNumber", data.accountNumber);
                    setValue("reEnterAccountNumber", data.accountNumber);
                } else {
                    showToast(message, false);
                }
            }
        } catch (error) {
          showToast(error?.message, false);
        } finally {
          dispatch(stopLoading());
        }
        // eslint-disable-next-line
    }, [id]);

    const onSubmit = async (data) => {
        try {
            dispatch(startLoading());
            const selectedStaff = staffList.find((item) => item.id === data.staffID);
            if(selectedStaff) {
                if(totalpayableAmount > selectedStaff.salary) {
                    showToast(`Salary Should not be Greater then ${selectedStaff.salary}/-`, false);
                    return;
                }
            }
            const response = tag === "add"
                ? await createSalary({ ...data, createdBy: loggedInUser.id })
                : await updateSalary({ ...data, updatedBy: loggedInUser.id }, id);

            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                navigate("/salary");
            } else {
                showToast(response?.messageCode, false);
            }
        } catch (error) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    };

    useEffect(() => {
        (async () => {
            const whereCondition = {
                isActive: true,
                isDeleted: false
            };
            const { success, message, data } = await getStaffList(listPayload(0, ['super admin', 'admin'].includes(loggedInUser?.px_role?.name?.toLowerCase()) ? whereCondition : {...whereCondition, createdBy: loggedInUser.id}, 100000));
            if(success) {
                setStaffList(data.rows);
            } else {
                setStaffList([]);
                showToast(message, false);
            }
        })();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        tag === "edit" && fetchEditSalaryData();
      }, [tag, fetchEditSalaryData]);

    const cancelHandler = () => {
        navigate("/salary");
    };
    return {
        control,
        staffList,
        totalLeave,
        totalLeaveAmount,
        totalpayableAmount,
        setValue,
        onSubmit,
        getValues,
        handleSubmit,
        cancelHandler,
    }
}
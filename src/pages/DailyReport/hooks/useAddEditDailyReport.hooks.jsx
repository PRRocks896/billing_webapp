import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as moment from "moment";

import { listPayload, showToast } from "../../../utils/helper";

import {
    createDailyReport,
    updateDailyReport,
    getDailyReportById
} from "../../../service/dailyReport";
import {
    getUserList
} from "../../../service/users";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useAddEditDailyReportHook = (tag) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const loggedInUser = useSelector((state) => state.loggedInUser);

    const [branchList, setBranchList] = useState([]);
    
    const { control, handleSubmit, setValue, getValues, watch } = useForm({
        defaultValues: {
            userID: loggedInUser.id,
            dailyReportDate: moment(new Date()).format('yyyy-MM-DD'),
            managerName: '',
            totalStaffPresent: '',
            totalCustomer: '',
            totalMemberGuest: '',
            openBalance: '',
            cashSale: '',
            cardSale: '',
            upiSale: '',
            dealsAppSale: '',
            totalSales: '',
            tipsCard: '',
            totalCard: '',
            totalCash: '',
            nextDayCash: '',
            salonCustomerCash: '0',
            totalExpenses: '',
            grandCash: '',
            fiveHundred: '',
            twoHundred: '',
            oneHundred: '',
            fifty: '',
            cashInCover: '',
            expense: [{
                index: 0,
                description: '',
                amount: ''
            }]
        },
        mode: "onBlur",
    });

    const { fields, append, remove} = useFieldArray({
        name: "expense",
        control: control,
    });

    const isAdmin = useMemo(() => {
        if(loggedInUser && loggedInUser.px_role && loggedInUser.px_role.name === 'Admin') {
            return true;
        }
        return false;
    }, [loggedInUser]);

    const handleAddField = () => {
        const index = getValues('expense').length;
        append({
            index: index,
            description: '',
            amount: ''
        })
    }

    const handleRemoveField = (index) => {
        remove(index);
        handleTotalExpense();
    }

    const onSubmit = async (data) => {
        try {
            dispatch(startLoading());
            const response = tag === "add"
                ? await createDailyReport({ ...data, createdBy: loggedInUser.id })
                : await updateDailyReport({ ...data, updatedBy: loggedInUser.id }, id);

            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                navigate("/daily-report");
            } else {
                showToast(response?.messageCode, false);
            }
        } catch (error) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    };

    const fetchEditDailyReport = useCallback(async () => {
        try {
            if (id) {
                dispatch(startLoading());
                const response = await getDailyReportById(id);

                if (response?.statusCode === 200) {
                    console.log(response);
                    // setValue("planName", response.data.planName);
                    // setValue("hours", response.data.hours);
                    // setValue("price", response.data.price);
                } else {
                    showToast(response?.message, false);
                }
            }
        } catch (error) {
          showToast(error?.message, false);
        } finally {
          dispatch(stopLoading());
        }
    // eslint-disable-next-line
    }, [id, setValue, dispatch]);

    const cancelHandler = () => {
        navigate("/daily-report");
    };

    const fetchList = async () => {
        try {
            dispatch(startLoading());
            const whereCondition = {
                isActive: true,
                isDeleted: false
            };
            const payload = listPayload(0, whereCondition, 100000);
            const { success, message, data } = await getUserList(payload)
            if(success) {
                setBranchList(data?.rows);
            } else {
                showToast(message, false);
            }
        } catch(err) {
            showToast(err?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    }

    const totalCashSalePlusOpeningBalance = useMemo(() => {
        return (parseFloat(getValues("cashSale")) || 0) + (parseFloat(getValues("openBalance")) || 0)
    // eslint-disable-next-line
    }, [watch('cashSale'), watch('openBalance')])

    const handleTotalExpense = useCallback(() => {
        let totalExpense = 0 ;
        getValues("expense").forEach((res) => { 
            totalExpense += (parseFloat(res.amount) || 0)
        });
        // const sum = (totalCashSalePlusOpeningBalance - (totalExpense + (parseFloat(getValues("nextDayCash")) || 0) + (parseFloat(getValues("totalCard")) || 0)) || 0);
        setValue("totalExpenses", totalExpense);
        setValue("totalCash", totalCashSalePlusOpeningBalance);
        // eslint-disable-next-line
    }, [totalCashSalePlusOpeningBalance])

    useEffect(() => {
        const sum = (500 * parseFloat(getValues('fiveHundred') || 0)) +
                    (200 * parseFloat(getValues('twoHundred') || 0)) +
                    (100 * parseFloat(getValues('oneHundred') || 0)) +
                    (50 * parseFloat(getValues('fifty') || 0));
        setValue('cashInCover', sum);
        // eslint-disable-next-line
    }, [watch('fiveHundred'), watch('twoHundred'), watch('oneHundred'), watch('fifty')])

    useEffect(() => {
        const sum = (parseFloat(getValues("cashSale")) || 0) + 
                    (parseFloat(getValues("cardSale")) || 0) + 
                    (parseFloat(getValues("upiSale")) || 0) +
                    (parseFloat(getValues("dealsAppSale")) || 0)
        setValue("totalSales", sum);
        // eslint-disable-next-line
    }, [watch('cashSale'), watch('cardSale'), watch('upiSale'), watch('dealsAppSale')])

    useEffect(() => {
        const total = (parseFloat(getValues("totalCash")) || 0) -
                      (parseFloat(getValues("totalExpenses")) || 0) - 
                      (parseFloat(getValues("nextDayCash")) || 0);
        setValue('grandCash', total);
        // eslint-disable-next-line
    }, [watch('totalCash'), watch('totalExpenses'), watch('nextDayCash')]);

    useEffect(() => {
        const totalCard = parseFloat(getValues("tipsCard") || 0) - ((parseFloat(getValues("tipsCard") || 0) * 25) / 100);
        setValue("totalCard", totalCard);
        // eslint-disable-next-line
    }, [watch('tipsCard')]);

    useEffect(() => {
        if(isAdmin) {
            fetchList();
        }
        // eslint-disable-next-line
    }, [isAdmin]);

    useEffect(() => {
        tag === "edit" && fetchEditDailyReport();
    }, [tag, fetchEditDailyReport]);

    return {
        fields,
        isAdmin,
        control,
        branchList,
        totalCashSalePlusOpeningBalance,
        onSubmit,
        handleSubmit,
        cancelHandler,
        handleAddField,
        handleRemoveField,
        handleTotalExpense,
    }
}
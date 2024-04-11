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
    getDailyReportById,
    getDailyReportByPayload
} from "../../../service/dailyReport";
import {
    hardDeleteExpense
} from "../../../service/expense";
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
    const [previousDateReport, setPreviousDateReport] = useState(null);
    const [isOpeningBalanceDisable, setIsOpeningBalanceDisable] = useState(false);
    
    const { control, handleSubmit, setValue, getValues, watch, reset, formState: {dirtyFields, isSubmitting} } = useForm({
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
                exponseID: null,
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
            exponseID: null,
            description: '',
            amount: ''
        })
    }

    const handleRemoveField = (index) => {
        remove(index);
        handleTotalExpense();
        const find = getValues('expense')[index];
        if(find) {
            hardDeleteExpense(find?.exponseID).then((res) => {
                if(!res.success) {
                    showToast(res.message, true);
                }
            }).catch((err) => {
                showToast(err?.message, false);
            });
        }
    }

    const onSubmit = async (data) => {
        try {
            dispatch(startLoading());
            if(data.cashInCover !== data.grandCash) {
                return showToast('Grand Total and Cash in Cover is not Matched. Please Check')
            }
            const updatedExpese = [];
            if(tag === "edit") {
                if(dirtyFields.expense && dirtyFields.expense.map((item) => {
                    if(item.amount || item.description) {
                        return true;
                    }
                    return false;
                }).includes(true)) {
                    data.expense?.forEach((item) => {
                        updatedExpese.push({
                            id: item.exponseID || null,
                            dailyReportID: id,
                            description: item.description,
                            amount: item.amount,
                            createdBy: loggedInUser.id,
                            updatedBy: loggedInUser.id
                        })
                    });
                    delete data.expense;
                }
            }
            
            const response = tag === "add"
                ? await createDailyReport({ ...data, createdBy: loggedInUser.id })
                : await updateDailyReport({ ...data, expense: updatedExpese, updatedBy: loggedInUser.id }, id);

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
                    const { data } = response;
                    reset({
                        userID: data.userId,
                        dailyReportDate: moment(new Date(data.dailyReportDate)).format('yyyy-MM-DD'),
                        managerName: data.managerName,
                        totalStaffPresent: data.totalStaffPresent,
                        totalCustomer: data.totalCustomer,
                        totalMemberGuest: data.totalMemberGuest,
                        openBalance: data.openBalance,
                        cashSale: data.cashSale,
                        cardSale: data.cardSale,
                        upiSale: data.upiSale,
                        dealsAppSale: data.dealsAppSale,
                        totalSales: data.totalSales,
                        tipsCard: data.tipsCard,
                        totalCard: data.totalCard,
                        totalCash: data.totalCash,
                        nextDayCash: data.nextDayCash,
                        salonCustomerCash: data.salonCustomerCash,
                        totalExpenses: data.totalExpenses,
                        grandCash: data.grandCash,
                        fiveHundred: data.fiveHundred,
                        twoHundred: data.twoHundred,
                        oneHundred: data.oneHundred,
                        fifty: data.fifty,
                        cashInCover: data.cashInCover,
                        expense: data.expense?.map((item, index) => {
                            return {
                                index: index,
                                exponseID: item.id,
                                description: item.description,
                                amount: item.amount
                            }
                        })
                    });
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

    const fetchPreviousDateEntry = async () => {
        const { success, data} = await getDailyReportByPayload({
            isActive: true,
            isDeleted: false,
            userID: loggedInUser.id,
            dailyReportDate: moment(new Date(getValues('dailyReportDate'))).subtract(1, 'day').format('yyyy-MM-DD')
        });
        if(success) {
            setPreviousDateReport(data);
            setIsOpeningBalanceDisable(true);
            setValue('openBalance', data.nextDayCash);
        } else {
            setPreviousDateReport(null);
            showToast(`Please Add Report for ${moment(new Date(getValues('dailyReportDate'))).subtract(1, 'day').format('DD/MM/yyyy')} Date`)
            setIsOpeningBalanceDisable(false);
            setValue('openBalance', '');
        }
    }

    const cancelHandler = () => {
        if(isAdmin) {
            navigate("/daily-report");
        } else {
            navigate('/');
        }
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
                      ((parseFloat(getValues("totalCard")) || 0) +
                      (parseFloat(getValues("totalExpenses")) || 0) + 
                      (parseFloat(getValues("nextDayCash")) || 0));
        setValue('grandCash', total);
        // eslint-disable-next-line
    }, [watch('tipsCard'), watch('totalCash'), watch('totalExpenses'), watch('nextDayCash')]);

    useEffect(() => {
        const totalCard = parseFloat(getValues("tipsCard") || 0) - ((parseFloat(getValues("tipsCard") || 0) * 25) / 100);
        setValue("totalCard", totalCard);
        // eslint-disable-next-line
    }, [watch('tipsCard')]);

    // useEffect(() => {
    //     fetchPreviousDateEntry();
    //     // eslint-disable-next-line
    // }, [watch('dailyReportDate')]);

    useEffect(() => {
        if(isAdmin) {
            fetchList();
        } else {
            fetchPreviousDateEntry();
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
        isSubmitting,
        previousDateReport,
        isOpeningBalanceDisable,
        totalCashSalePlusOpeningBalance,
        onSubmit,
        handleSubmit,
        cancelHandler,
        handleAddField,
        handleRemoveField,
        handleTotalExpense,
    }
}
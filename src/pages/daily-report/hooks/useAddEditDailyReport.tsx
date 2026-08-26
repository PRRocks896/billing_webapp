import { useLocation, useNavigate, useParams } from "react-router-dom";

import useAuth from "hooks/useAuth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { openSnackbar } from "api/snackbar";
import {
    createDailyReport,
    updateDailyReport,
    getDailyReportById,
    getDailyReportByPayload,
    getLastRecordDetailReport
} from "service/dailyReport";
import { getBranch } from "service/user";
import moment from "moment";

export type DailyReportFormValue = {
    userID: number | null;
    dailyReportDate: Date | string;
    managerName: string;
    managerId: string;
    totalStaffPresent: number;
    totalCustomer: number;
    totalMemberGuest: number;
    openBalance: string;
    cashSale: string;
    cardSale: string;
    upiSale: string;
    dealsAppSale: string;
    totalSales: string;
    tipsCard: string;
    totalCard: string;
    totalCash: string;
    nextDayCash: string;
    salonCustomerCash: string;
    totalExpenses: string;
    grandCash: string;
    fiveHundred: number;
    twoHundred: number;
    oneHundred: number;
    fifty: number;
    cashInCover: string;
    expense: {
        index: number;
        exponseID: number | null;
        description: string;
        amount: string;
    }[];
}

const defaultValues: DailyReportFormValue = {
    userID: null,
    dailyReportDate: moment(new Date()).format('yyyy-MM-DD'),
    managerName: localStorage.getItem("managerName") ?? "",
    managerId: localStorage.getItem("managerId") ?? "",
    totalStaffPresent: 0,
    totalCustomer: 0,
    totalMemberGuest: 0,
    openBalance: '',
    cashSale: '',
    cardSale: '',
    upiSale: '',
    dealsAppSale: '',
    totalSales: '',
    tipsCard: '0',
    totalCard: '',
    totalCash: '',
    nextDayCash: '',
    salonCustomerCash: '0',
    totalExpenses: '0',
    grandCash: '',
    fiveHundred: 0,
    twoHundred: 0,
    oneHundred: 0,
    fifty: 0,
    cashInCover: '',
    expense: [
        {
            index: 0,
            exponseID: null,
            description: '',
            amount: '',
        }
    ]
}

const UseAddEditDailyReport = () => {
    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { pathname } = useLocation();
    const { user, isAdmin, fetchLoginUser, accessRights, startLoading, stopLoading } = useAuth();
    const rights = accessRights(pathname);

    const [editManagerId, setEditManagerId] = useState<number[] | null>(null);
    const [branchList, setBranchList] = useState<any[]>([]);
    const [previousDateReport, setPreviousDateReport] = useState<any>(null);
    const [isOpeningBalanceDisable, setIsOpeningBalanceDisable] = useState<boolean>(false);

    const {
        control,
        formState: { isSubmitting },
        handleSubmit,
        setValue,
        getValues,
        reset,
        watch
    } = useForm<DailyReportFormValue>({
        defaultValues: {
            ...defaultValues,
            // userID: user?.id,
            managerName: localStorage.getItem("managerName") ?? ""
        },
        mode: 'onChange',
    });

    const { fields, append, remove } = useFieldArray({
        name: 'expense',
        control: control
    });

    const handleAddExpense = () => {
        append({
            index: fields.length,
            exponseID: null,
            description: '',
            amount: '',
        });
    };

    const handleRemoveExpense = (index: number) => {
        remove(index);
    };

    const handleBack = () => {
        if (isAdmin) {
            navigate('/daily-report');
        } else {
            navigate('/');
        }
    }

    const fetchBranch = async () => {
        try {
            startLoading();
            const body = { isActive: true, isDeleted: false };
            const { success, message, data }: any = await getBranch(body);
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
            if (data && data && Array.isArray(data) && data.length > 0) {
                setBranchList(data.filter((item: any) => {
                    if (item && item.px_role && item.px_role.name && !['admin', 'super admin'].includes(item.px_role.name.toLowerCase())) {
                        return item;
                    }
                }))
            } else {
                setBranchList([]);
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
    };

    const fetchPreviousDateEntry = async () => {
        // try {
        //     startLoading();
        //     const { success, message, data }: any = await getDailyReportByPayload({
        //         isActive: true,
        //         isDeleted: false,
        //         userID: isAdmin ? getValues('userID') : user?.id,
        //         dailyReportDate: moment(new Date(getValues('dailyReportDate'))).format('yyyy-MM-DD')
        //     });
        //     if (success) {
        //         setPreviousDateReport(data);
        //         setIsOpeningBalanceDisable(true);
        //         setValue('openBalance', data.nextDayCash);
        //     } else {
        //         setPreviousDateReport(null);
        //         setIsOpeningBalanceDisable(false);
        //         setValue('openBalance', '');
        //         openSnackbar({
        //             open: true,
        //             message: message,
        //             variant: 'alert',
        //             severity: 'error',
        //             alert: {
        //                 color: 'error'
        //             }
        //         })
        //     }
        // } catch (error: any) {
        //     openSnackbar({
        //         open: true,
        //         message: error?.message || error?.messageCode || (error as Error).message || 'Something went wrong',
        //         variant: 'alert',
        //         severity: 'error',
        //         alert: {
        //             color: 'error'
        //         }
        //     })
        // } finally {
        //     stopLoading();
        // }
        try {
            startLoading();
            const { success, data, message }: any = await getLastRecordDetailReport({ userID: isAdmin ? getValues('userID') : user?.id });

            if (!success) {
                openSnackbar({
                    open: true,
                    message: message || 'Something went wrong',
                    variant: 'alert',
                    severity: 'error',
                    alert: { color: 'error' }
                });
            }
            if (data && data.managerList && Array.isArray(data.managerList) && data.managerList.length) {
                setValue('managerId', data.managerList.map((v: any) => v.id).join(","));
                setValue('managerName', data.managerList.map((v: any) => v.nickName).join(","));
            } else {
                setValue('managerId', localStorage.getItem('managerId') || '');
                setValue('managerName', localStorage.getItem('managerName') || '');
            }
            if (data && data.dailyReportDate) {
                const currentDate = moment(data.dailyReportDate).add(1, 'days').format('YYYY-MM-DD');
                setValue('dailyReportDate', currentDate);
            }
        } catch (error: any) {
            openSnackbar({
                open: true,
                message: error?.message || (error as Error).message || 'Something went wrong',
                variant: 'alert',
                severity: 'error',
                alert: { color: 'error' }
            });
        } finally {
            stopLoading();
        }
    }

    const fetchEditDailyReport = useCallback(async () => {
        try {
            startLoading();
            const { success, data }: any = await getDailyReportById(Number(id));
            if (!success) {
                openSnackbar({
                    open: true,
                    message: data?.message || 'Something went wrong',
                    variant: 'alert',
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                });
                return;
            }
            if (data) {
                const { managerName } = data;
                setEditManagerId(Array.isArray(managerName) ? managerName.map((manager) => manager?.id) : managerName?.id);
                reset({
                    userID: data.userID,
                    dailyReportDate: moment(new Date(data.dailyReportDate)).format('yyyy-MM-DD'),
                    managerName: Array.isArray(managerName) ? managerName.map((manager) => manager?.nickName).join(',') : managerName?.nickName, //data.managerName,
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
                    expense: data.expense?.map((item: any, index: number) => {
                        return {
                            index: index,
                            exponseID: item.id,
                            description: item.description,
                            amount: item.amount
                        }
                    })
                });
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
    }, [id, reset]);

    const onSubmit = async (data: DailyReportFormValue) => {
        try {
            startLoading();

            // Check grand total and cash in cover
            if (safeParse(data.cashInCover) !== safeParse(data.grandCash)) {
                openSnackbar({
                    open: true,
                    message: 'Grand Total and Cash in Cover is not Matched. Please Check',
                    variant: 'alert',
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                });
                return;
            }

            // --- Type Correction Step ---
            // Prepare the payload by converting all numeric string fields back to numbers
            const payload: any = {
                ...data,
                userID: isAdmin ? data.userID : user?.id,
                // Attendance Counts
                totalStaffPresent: Number(data.totalStaffPresent || 0),
                totalCustomer: Number(data.totalCustomer || 0),
                totalMemberGuest: Number(data.totalMemberGuest || 0),

                // Currency & Sales Fields
                openBalance: safeParse(data.openBalance),
                cashSale: safeParse(data.cashSale),
                cardSale: safeParse(data.cardSale),
                upiSale: safeParse(data.upiSale),
                dealsAppSale: safeParse(data.dealsAppSale),
                totalSales: safeParse(data.totalSales),
                tipsCard: safeParse(data.tipsCard),
                totalCard: safeParse(data.totalCard),
                totalCash: safeParse(data.totalCash),
                nextDayCash: safeParse(data.nextDayCash),
                salonCustomerCash: safeParse(data.salonCustomerCash),
                totalExpenses: safeParse(data.totalExpenses),
                grandCash: safeParse(data.grandCash),
                cashInCover: safeParse(data.cashInCover),

                // Denominations
                fiveHundred: Number(data.fiveHundred || 0),
                twoHundred: Number(data.twoHundred || 0),
                oneHundred: Number(data.oneHundred || 0),
                fifty: Number(data.fifty || 0),

                // Date formatting
                dailyReportDate: new Date(data.dailyReportDate),

                // Expense Array Mapping with Type Conversion
                expense: data.expense
                    .filter(item => item.description.trim() !== '' && item.amount !== '')
                    .map(item => {
                        if (mode === 'edit') {
                            return {
                                id: item.exponseID,
                                dailyReportID: safeParse(id),
                                description: item.description,
                                amount: safeParse(item.amount),
                                updatedBy: user?.id
                            }
                        }
                        return {
                            id: null,
                            description: item.description,
                            amount: safeParse(item.amount),
                            createdBy: user?.id,
                        }
                    })
            };

            delete payload['managerId'];

            const { success, message }: any = id
                ? await updateDailyReport({ ...payload, updatedBy: user?.id, managerName: editManagerId?.join(',') }, Number(id))
                : await createDailyReport({ ...payload, createdBy: user?.id, managerName: isAdmin ? data.managerId : localStorage.getItem('managerId') });

            if (!success) {
                openSnackbar({
                    open: true,
                    message: message || 'Something went wrong',
                    variant: 'alert',
                    severity: 'error',
                    alert: { color: 'error' }
                });
                return;
            }
            openSnackbar({
                open: true,
                message: message || `Daily Report ${id ? 'Updated' : 'Added'} Successfully`,
                variant: 'alert',
                severity: 'success',
                alert: { color: 'success' }
            });
            fetchLoginUser();
            fetchPreviousDateEntry();
            navigate(isAdmin ? '/daily-report' : '/dashboard');

        } catch (error: any) {
            openSnackbar({
                open: true,
                message: error?.message || (error as Error).message || 'Something went wrong',
                variant: 'alert',
                severity: 'error',
                alert: { color: 'error' }
            });
        } finally {
            stopLoading();
        }
    }

    // ─── Help for Safe Number Parsing ──────────────────────────────────────────
    const safeParse = (val: any) => {
        if (val === undefined || val === null || val === '') return 0;
        const parsed = parseFloat(val);
        return isNaN(parsed) ? 0 : parsed;
    };

    // ─── Watch all relevant inputs for reactive calculations ────────────────────
    // useWatch is more reliable for triggering effects on deep array changes
    const watchedSales = useWatch({ control, name: ['cashSale', 'cardSale', 'upiSale', 'dealsAppSale', 'openBalance'] });
    const watchedExpenses = useWatch({ control, name: 'expense' });
    const watchedSummary = useWatch({ control, name: ['tipsCard', 'nextDayCash'] });
    const watchedNotesList = useWatch({ control, name: ['fiveHundred', 'twoHundred', 'oneHundred', 'fifty'] });

    useEffect(() => {
        const [cashSale, cardSale, upiSale, dealsAppSale, openBalance] = watchedSales;
        const [tipsCard, nextDayCash] = watchedSummary;
        const [fiveHundred, twoHundred, oneHundred, fifty] = watchedNotesList;

        // 1. Calculate Total Sales (Sum of all payment methods)
        const totalSales =
            safeParse(cashSale) +
            safeParse(cardSale) +
            safeParse(upiSale) +
            safeParse(dealsAppSale);
        setValue("totalSales", totalSales.toFixed(2));

        // 2. Calculate Available Cash (Opening Balance + Cash Sales)
        const availableCash =
            safeParse(openBalance) +
            safeParse(cashSale);
        setValue("totalCash", availableCash.toFixed(2));

        // 3. Calculate Expense Total (Deep sum of the expense array)
        const totalExpenseAmount = (watchedExpenses || []).reduce(
            (acc: number, curr: any) => acc + safeParse(curr?.amount),
            0
        );
        setValue("totalExpenses", totalExpenseAmount.toFixed(2));

        // 4. Calculate Therapist Share (25% of card tips)
        const therapistShare = safeParse(tipsCard) - ((safeParse(tipsCard) * 25) / 100);
        setValue("totalCard", therapistShare.toFixed(2));

        // 5. Calculate Final Grand Cash (Available Cash - All Payouts/Expenses/Next Day)
        const grandCash =
            availableCash -
            (therapistShare + totalExpenseAmount + safeParse(nextDayCash));
        setValue("grandCash", grandCash.toFixed(2));

        // 6. Calculate Denomination Total (Cash in Cover)
        const denominationTotal =
            (500 * safeParse(fiveHundred)) +
            (200 * safeParse(twoHundred)) +
            (100 * safeParse(oneHundred)) +
            (50 * safeParse(fifty));
        setValue("cashInCover", denominationTotal.toFixed(2));

    }, [
        watchedSales,
        watchedExpenses,
        watchedSummary,
        watchedNotesList,
        setValue
    ]);

    useEffect(() => {
        if (isAdmin) {
            fetchBranch();
        }
    }, [isAdmin]);

    useEffect(() => {
        if ((isAdmin && getValues('userID')) || (!isAdmin && user && user.id)) {
            // (async () => {
            //     try {
            //         startLoading();
            //         const { success, data, message }: any = await getLastRecordDetailReport({ userID: isAdmin ? getValues('userID') : user?.id });

            //         if (!success) {
            //             openSnackbar({
            //                 open: true,
            //                 message: message || 'Something went wrong',
            //                 variant: 'alert',
            //                 severity: 'error',
            //                 alert: { color: 'error' }
            //             });
            //         }
            //         if (data && data.managerList && Array.isArray(data.managerList) && data.managerList.length) {
            //             setValue('managerId', data.managerList.map((v: any) => v.id).join(","));
            //             setValue('managerName', data.managerList.map((v: any) => v.nickName).join(","));
            //         } else {
            //             setValue('managerId', localStorage.getItem('managerId') || '');
            //             setValue('managerName', localStorage.getItem('managerName') || '');
            //         }
            //         if (data && data.dailyReportDate) {
            //             const currentDate = moment(data.dailyReportDate).add(1, 'days').format('YYYY-MM-DD');
            //             setValue('dailyReportDate', currentDate);
            //         }
            //     } catch (error: any) {
            //         openSnackbar({
            //             open: true,
            //             message: error?.message || (error as Error).message || 'Something went wrong',
            //             variant: 'alert',
            //             severity: 'error',
            //             alert: { color: 'error' }
            //         });
            //     } finally {
            //         stopLoading();
            //     }
            // })();
            fetchPreviousDateEntry();
        }
    }, [isAdmin, user, watch('userID')]);

    useEffect(() => {
        if (mode === 'edit' && id) {
            fetchEditDailyReport();
        }
    }, [mode, id]);

    const title: string = useMemo(() => {
        if (mode && mode === 'edit' && id) {
            return 'Edit Daily Report';
        }
        return 'Add Daily Report';
    }, [mode, id]);

    return {
        mode,
        title,
        fields,
        control,
        isAdmin,
        branchList,
        isSubmitting,
        previousDateReport,
        isOpeningBalanceDisable,
        onSubmit,
        handleBack,
        handleSubmit,
        handleAddExpense,
        handleRemoveExpense,
        fetchPreviousDateEntry,
    }
}

export default UseAddEditDailyReport;
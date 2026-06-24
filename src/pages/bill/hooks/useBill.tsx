import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { openSnackbar } from "api/snackbar";
import { PrintBill } from "components/printBill";
import useAuth from "hooks/useAuth";
import { Edit, Trash, Printer } from "iconsax-reactjs";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { data, useLocation, useNavigate } from "react-router-dom";
import { currectionOfBillNo, deleteBill, getBillById, getBillList } from "service/bill";
import { getBranch } from "service/user";
import { getCompanyList } from "service/company";
import { Bill, Branch } from "types/common";
import { HeadCell, ArrangementOrder } from "types/table";
import { ROWS } from "utils/constant";

const UseBill = () => {

    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { user, isAdmin, accessRights, startLoading, stopLoading } = useAuth();
    const rights = accessRights(pathname);

    const [list, setList] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [rows, setRows] = useState<number>(ROWS);
    const [companyList, setCompanyList] = useState<any[]>([]);
    const [userList, setUserList] = useState<any[]>([]);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number>(-1);
    const [searchText, setSearchText] = useState<string>("");
    const [order, setOrder] = useState<ArrangementOrder>('desc');
    const [orderBy, setOrderBy] = useState<string>('createdAt');

    const {
        control,
        getValues,
        watch,
        reset,
    } = useForm({
        defaultValues: {
            date: null,
            selectedUser: null,
        },
        mode: 'onChange'
    });

    const billNoMappingForm = useForm({
        defaultValues: {
            startDate: new Date(),
            endDate: new Date(),
            cashNo: null,
            upiNo: null,
            companyID: null
        }
    });

    const resetFormValue = () => {
        reset({
            date: null,
            selectedUser: null
        })
    }

    const handleAdd = () => navigate("/bill/add");

    const handleEdit = (id: number) => navigate(`/bill/edit/${id}`);

    const handleDelete = (id: number) => {
        setSelectedId(id);
        setIsVisible(true);
    };

    const closeConfirmModal = () => {
        setIsVisible(false);
    };

    const onSubmit = async (data: any) => {
        try {
            startLoading();
            const { success, message }: any = await currectionOfBillNo({
                ...data,
                startDate: moment(data.startDate).format('yyyy-MM-DD'),
                endDate: moment(data.endDate).format('yyyy-MM-DD')
            });
            openSnackbar({
                open: true,
                message: message,
                variant: 'alert',
                severity: success ? 'success' : 'error',
                alert: {
                    color: success ? 'success' : 'error'
                }
            });
            if (success) {
                billNoMappingForm.reset();
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

    const fetchBranch = async () => {
        try {
            startLoading();
            const whereCondition = {
                isActive: true,
                isDeleted: false,
            };
            const { success, message, data }: any = await getBranch(whereCondition);
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
                setUserList(data.filter((item: any) => {
                    if (item && item.px_role && item.px_role.name && !['admin', 'super admin'].includes(item.px_role.name.toLowerCase())) {
                        return item;
                    }
                }))
            } else {
                setUserList([]);
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

    const fetchCompany = async () => {
        try {
            startLoading();
            const whereCondition = {
                where: {
                    isActive: true,
                    isDeleted: false,
                },
                pagination: {
                    page: 1,
                    rows: 10000,
                    sortBy: "createdAt",
                    descending: true,
                },
            };
            const { success, message, data }: any = await getCompanyList(whereCondition);
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
            if (data && data.rows && Array.isArray(data.rows) && data.rows.length > 0) {
                setCompanyList(data.rows)
            } else {
                setCompanyList([]);
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

    const fetch = useCallback(async () => {
        try {
            startLoading();
            let payload: {
                where: any,
                pagination: any
            } = {
                where: {
                    searchText,
                    isDeleted: false,
                },
                pagination: {
                    page: (page + 1),
                    rows: rows,
                    sortBy: orderBy,
                    descending: order === 'desc',
                },
            };
            if (isAdmin) {
                const selectedUser = getValues('selectedUser');
                if (selectedUser && selectedUser !== null) {
                    payload = {
                        where: {
                            ...payload.where,
                            userID: selectedUser,
                        },
                        pagination: payload.pagination
                    }
                }
                const date = getValues('date');
                if (date && date !== null) {
                    payload = {
                        where: {
                            ...payload.where,
                            createdAt: moment(date).format('yyyy-MM-DD'),
                        },
                        pagination: payload.pagination
                    }
                }
            } else {
                payload = {
                    where: {
                        ...payload.where,
                        userID: user?.id,
                        createdAt: moment(new Date()).format('yyyy-MM-DD')
                    },
                    pagination: payload.pagination
                }
            }

            const { success, message, data }: any = await getBillList(payload);
            if (success) {
                setList(data.rows);
                setTotalCount(data.count);
            } else {
                setList([]);
                setTotalCount(0);
                openSnackbar({
                    open: true,
                    message: message || 'Something went wrong',
                    variant: 'alert',
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                })
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
    }, [page, rows, searchText, user, watch('date'), watch('selectedUser'), order, orderBy]);

    const handleRequestSort = (event: any, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const onDeleteHandler = async () => {
        try {
            startLoading();
            const { success, message }: any = await deleteBill(selectedId);
            if (success) {
                fetch();
                openSnackbar({
                    open: true,
                    message: message || 'Record Deleted Successfully',
                    variant: 'alert',
                    severity: 'primary',
                    alert: {
                        color: 'success'
                    }
                })
            } else {
                openSnackbar({
                    open: true,
                    message: message || 'Something went wrong',
                    variant: 'alert',
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                })
            }
        } catch (error: any) {
            openSnackbar({
                open: true,
                message: error?.message || error?.messageCode || (error as Error).message || 'Something went wrong',
                variant: 'alert',
                alert: {
                    color: 'error'
                }
            })
        } finally {
            stopLoading();
            setIsVisible(false);
        }
    }

    const searchHandler = (searchText: string) => {
        setPage(0);
        setSearchText(searchText);
    };

    const handlePrint = async (id: number) => {
        try {
            startLoading();
            const response: any = await getBillById(id);
            if (response.success && response.data) {
                const body = response.data;

                const branchData: Branch = {
                    title: body?.px_user?.billTitle,
                    address: body?.px_user?.address,
                    phone1: body?.px_user?.phoneNumber,
                    phone2: body?.px_user?.phoneNumber2,
                    reviewUrl: body?.px_user?.reviewUrl
                }
                const billData: Bill = {
                    date: new Date(body.createdAt),
                    customer: body?.px_customer?.name,
                    staff: body?.px_staff?.nickName || body?.px_staff?.name || '',
                    roomNo: body?.px_room?.roomName,
                    cgstPercentage: body?.px_user?.px_company?.CGST,
                    sgstPercentage: body?.px_user?.px_company?.SGST,
                    grandTotal: body?.grandTotal,
                    gstNo: body?.px_user?.gstNo,
                    isShowGst: body?.px_user?.isShowGst,
                    tableData: body?.detail?.map((detail: any) => {
                        return {
                            hsnCode: detail.hsnCode,
                            item: detail.service?.name || detail?.membershipPlan?.planName,
                            quantity: detail.quantity,
                            total: detail.total,
                            subTotal: detail.total,
                            cgst: body?.cgst,
                            sgst: body?.sgst,
                            payment: body?.px_payment_type?.name,
                            paymentId: body?.px_payment_type?.id,
                            cardNo: body.cardNo,
                            billNo: body.billNo,
                            grandTotal: body?.grandTotal
                        }
                    })
                };
                const printWindow = window.open("", "_blank", "popup=yes,menubar=no,toolbap=no");
                if (printWindow && printWindow.document) {
                    printWindow.document.write(PrintBill(billData, branchData, body.detail[0]?.membershipPlan ? false : true));
                    printWindow.document.close();
                    printWindow.onload = () => {
                        printWindow.print();
                        printWindow.close();
                    };
                }
            } else {
                openSnackbar({
                    open: true,
                    message: response.message,
                    variant: 'alert',
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                })
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
        if (isAdmin && user && user.companyID) {
            fetchBranch();
            fetchCompany();
        }
    }, [isAdmin, user]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetch();
        }, 500);
        return () => clearTimeout(timeout);
    }, [page, rows, searchText, user, watch('date'), watch('selectedUser'), order, orderBy]);

    const Column: HeadCell[] = useMemo(() => {
        let columns: any[] = [
            {
                id: 'billNo',
                label: 'Bill No',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
            },
            {
                id: 'createdAt',
                label: 'Date',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row: any) => {
                    return (
                        <Box>
                            {moment(row.createdAt).format('yyyy-MM-DD hh:mm A')}
                        </Box>
                    )
                }
            },
            {
                id: 'customerName',
                label: 'Customer Name',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row: any) => {
                    return (
                        <Box>
                            {row?.px_customer?.name}
                        </Box>
                    )
                }
            },
            {
                id: 'staff',
                label: 'Staff',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row: any) => {
                    return (
                        <Box>
                            {row?.px_staff?.nickName}
                        </Box>
                    )
                }
            },
            {
                id: 'paymentType',
                label: 'Payment Via',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row: any) => {
                    return (
                        <Box>
                            {row?.px_payment_type?.name}
                        </Box>
                    )
                }
            },
            {
                id: 'grandTotal',
                label: 'Grand Total',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
            }
        ];
        if (isAdmin) {
            columns.splice(1, 0, {
                id: 'branchName',
                label: 'Branch Name',
                align: 'left',
                numeric: false,
                disablePadding: false,
                sortable: false,
                renderCell: (row: any) => {
                    return (
                        <Box>
                            {`${row?.px_user?.firstName} - ${row?.px_user?.lastName}`}
                        </Box>
                    )
                }
            });
            columns.push({
                id: 'actions',
                label: 'Actions',
                align: 'right',
                numeric: false,
                disablePadding: false,
                renderCell: (row: any) => {
                    return (
                        <Box>
                            {rights.edit &&
                                <IconButton onClick={() => handleEdit(row.id)}>
                                    <Edit />
                                </IconButton>
                            }
                            {rights.delete &&
                                <IconButton onClick={() => handleDelete(row.id)}>
                                    <Trash />
                                </IconButton>
                            }
                            <IconButton onClick={() => handlePrint(row.id)}>
                                <Printer />
                            </IconButton>
                        </Box>
                    )
                }
            });
        }
        return columns;
    }, [rights, isAdmin]);

    return {
        list,
        page,
        rows,
        rights,
        Column,
        control,
        isAdmin,
        userList,
        isVisible,
        totalCount,
        order,
        orderBy,
        companyList,
        billNoMappingForm,
        handleRequestSort,
        setOrder,
        setOrderBy,
        setPage,
        setRows,
        onSubmit,
        handleAdd,
        searchHandler,
        resetFormValue,
        onDeleteHandler,
        closeConfirmModal
    }
}

export default UseBill;
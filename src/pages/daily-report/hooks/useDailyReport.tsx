import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getBranch } from "service/user";
import { getDailyReportList, deleteDailyReport, updateDailyReport, downloadDailyReport } from "service/dailyReport";
import { ROWS } from "utils/constant";
import { HeadCell } from "types/table";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { Edit, Trash, NoteText } from "iconsax-reactjs";
import Switch from "@mui/material/Switch";
import moment from "moment";

const UseDailyReport = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { user, isAdmin, accessRights, startLoading, stopLoading } = useAuth();
    const rights = accessRights(pathname);
    const [searchText, setSearchText] = useState<string>("");
    const [list, setList] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [rows, setRows] = useState<number>(ROWS);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number>(-1);
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');
    const [orderBy, setOrderBy] = useState<string>('createdAt');

    const [dateRange, setDateRange] = useState(moment(new Date()).format('yyyy-MM-DD'));
    const [branchList, setBranchList] = useState<any[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<any>(null);

    const handleAdd = () => navigate("/daily-report/add");

    const handleEdit = (id: number) => navigate(`/daily-report/edit/${id}`);

    const handleDelete = (id: number) => {
        setSelectedId(id);
        setIsVisible(true);
    };

    const closeConfirmModal = () => {
        setIsVisible(false);
    };

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

    const downloadReport = async () => {
        try {
            if (selectedBranch === null) {
                openSnackbar({
                    open: true,
                    message: 'Please Select Branch',
                    variant: 'alert',
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                });
                return;
            }
            startLoading();
            const body = {
                userID: selectedBranch.id,
                startDate: moment(dateRange).format('yyyy-MM-DD'),
                endDate: moment(dateRange).format('yyyy-MM-DD')
            };
            await downloadDailyReport(body, `Green_Day_Spa_${selectedBranch?.lastName}_${moment(dateRange).format('DD_MM_yyyy')}.pdf`);
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
        let payload: any = {
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
        if (!isAdmin) {
            payload.where.createdBy = user?.id;
        }
        startLoading();
        try {
            const { success, message, data }: any = await getDailyReportList(payload);
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
    }, [page, rows, searchText, order, orderBy]);

    const handleRequestSort = (event: any, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const onStatusChange = async (id: number, newStatus: boolean, field: string) => {
        try {
            const body: any = {
                [field]: newStatus,
                updatedBy: user?.id,
            };
            startLoading();
            const { success, message }: any = await updateDailyReport(body, id);
            openSnackbar({
                open: true,
                message: message || 'Something went wrong',
                variant: 'alert',
                severity: success ? 'success' : 'error',
                alert: {
                    color: success ? 'success' : 'error'
                }
            })
            if (success) {
                fetch();
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

    const onDeleteHandler = async () => {
        try {
            startLoading();
            const { success, message }: any = await deleteDailyReport(selectedId);
            openSnackbar({
                open: true,
                message: message || success ? 'Record Deleted Successfully' : 'Something went wrong',
                variant: 'alert',
                severity: success ? 'success' : 'error',
                alert: {
                    color: success ? 'success' : 'error'
                }
            })
            if (success) {
                fetch();
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
            setIsVisible(false);
        }
    }

    const searchHandler = (text: string) => {
        setSearchText(text);
        setPage(0);
    };

    useEffect(() => {
        if (isAdmin) {
            fetchBranch();
        }
    }, [isAdmin]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetch();
        }, 500);
        return () => clearTimeout(timeout);
    }, [page, rows, searchText, order, orderBy]);

    const Column: HeadCell[] = useMemo(() => {
        let col: any[] = [
            {
                id: 'dailyReportDate',
                label: 'Date',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row: any) => {
                    return <span>{moment(row.dailyReportDate).format('DD/MM/YYYY')}</span>
                }
            },
            {
                id: 'totalStaffPresent',
                label: 'Staff Present',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
            },
            {
                id: 'totalCustomer',
                label: 'Customer',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
            },
            {
                id: 'totalExpenses',
                label: 'Expense',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
            },
            {
                id: 'isActive',
                label: 'Status',
                align: 'left',
                numeric: false,
                disablePadding: false,
                renderCell: (row: any) => {
                    return (
                        <Box>
                            <Switch
                                checked={row.isActive}
                                onChange={() => onStatusChange(row.id, !row.isActive, 'isActive')}
                            />
                        </Box>
                    );
                },
            },
            {
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
                        </Box>
                    )
                }
            },
        ];
        if (isAdmin) {
            col.splice(1, 0, {
                id: 'branchName',
                label: 'Branch Name',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row: any) => {
                    return <span>{row.px_user?.lastName}</span>
                }
            });
        }
        return col;
    }, [rights, isAdmin])

    return {
        list,
        page,
        rows,
        rights,
        Column,
        isAdmin,
        isVisible,
        totalCount,
        dateRange,
        branchList,
        selectedBranch,
        setSelectedBranch,
        setDateRange,
        setPage,
        setRows,
        order,
        orderBy,
        handleRequestSort,
        handleAdd,
        searchHandler,
        onDeleteHandler,
        closeConfirmModal,
        downloadReport
    }
}

export default UseDailyReport;
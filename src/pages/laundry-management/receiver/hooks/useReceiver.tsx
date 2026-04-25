import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import useAuth from "hooks/useAuth";

import { ROWS } from "utils/constant";
import { deleteLaundryReceiver, getLaundryReceiverList, updateLaundryReceiver } from "service/laundry-receiver";
import { openSnackbar } from "api/snackbar";
import { HeadCell, ArrangementOrder } from "types/table";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { Edit, Trash } from "iconsax-reactjs";

const UseReceiver = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { user, accessRights, startLoading, stopLoading } = useAuth();
    const rights = accessRights(pathname);
    const [searchText, setSearchText] = useState<string>("");
    const [list, setList] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [rows, setRows] = useState<number>(ROWS);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number>(-1);
    const [order, setOrder] = useState<ArrangementOrder>('desc');
    const [orderBy, setOrderBy] = useState<string>('createdAt');

    const handleAdd = () => navigate("/laundry-management/laundry-receiver/add");

    const handleEdit = (id: number) => navigate(`/laundry-management/laundry-receiver/edit/${id}`);

    const handleDelete = (id: number) => {
        setSelectedId(id);
        setIsVisible(true);
    }

    const closeConfirmModal = () => {
        setIsVisible(false);
    };

    const fetch = useCallback(async () => {
        const payload = {
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
        try {
            startLoading();
            const { success, message, data }: any = await getLaundryReceiverList(payload);
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

    const onDeleteHandler = async () => {
        try {
            startLoading();
            const { success, message }: any = await deleteLaundryReceiver(selectedId);
            if (success) {
                fetch();
                openSnackbar({
                    open: true,
                    message: message || 'Record Deleted Successfully',
                    variant: 'alert',
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
                severity: 'error',
                alert: {
                    color: 'error'
                }
            })
        } finally {
            setIsVisible(false);
            stopLoading();
        }
    }

    const searchHandler = (searchText: string) => {
        setPage(0);
        setSearchText(searchText);
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetch();
        }, 500);
        return () => clearTimeout(timeout);
    }, [page, rows, searchText, order, orderBy]);

    const Column: HeadCell[] = useMemo(() => {
        return [
            {
                id: 'receiveDate',
                label: 'Receive Date',
                numeric: false,
                disablePadding: false,
                isSortable: true,
            },
            {
                id: 'givenDate',
                label: 'Given Date',
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row: any) => {
                    return (row?.px_laundry_management?.givenDate)
                }
            },
            {
                id: 'washerName',
                label: 'Washer Name',
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row: any) => {
                    return (row?.px_laundry_management?.px_laundry_washer?.name)
                }
            },
            {
                id: 'givenQty',
                label: "Given Qty",
                numeric: true,
                disablePadding: false,
                isSortable: true,
                renderCell: (row: any) => {
                    return (row?.px_laundry_management?.givenQty)
                }
            },
            {
                id: 'receiveQty',
                label: "Receive Qty",
                numeric: true,
                disablePadding: false,
                isSortable: true
            },
            {
                id: 'manager',
                label: 'Manager',
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row: any) => {
                    return row.managerData && Array.isArray(row.managerData) && row.managerData[0]?.nickName || '-'
                }
            },
            {
                id: 'action',
                label: 'Action',
                align: 'left' as const,
                numeric: true,
                disablePadding: false,
                renderCell: (row) => {
                    return (
                        <Box>
                            {/* {row.receiveDate === null &&
                                <IconButton
                                    aria-label="edit"
                                    onClick={() => handleEdit(row?.id)}
                                >
                                    
                                </IconButton>
                            } */}
                            {rights.edit &&
                                <IconButton
                                    aria-label="edit"
                                    onClick={() => handleEdit(row?.id)}
                                >
                                    <Edit size={18} />
                                </IconButton>}
                            {rights.delete &&
                                <IconButton
                                    aria-label="delete"
                                    onClick={() => handleDelete(row?.id)}
                                >
                                    <Trash size={18} />
                                </IconButton>}
                        </Box>
                    )
                }
            }
        ];
    }, [rights]);

    return {
        list,
        page,
        rows,
        rights,
        Column,
        isVisible,
        totalCount,
        setPage,
        setRows,
        order,
        setOrder,
        orderBy,
        setOrderBy,
        handleRequestSort,
        handleAdd,
        searchHandler,
        onDeleteHandler,
        closeConfirmModal
    }
}

export default UseReceiver;
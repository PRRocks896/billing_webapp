import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import useAuth from "hooks/useAuth";

import { ROWS } from "utils/constant";
import { deleteLaundaryStock, createLaundryStock, getLaundryStockList } from "service/laundry-stock";
import { openSnackbar } from "api/snackbar";
import { HeadCell, ArrangementOrder } from "types/table";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { Edit, Trash } from "iconsax-reactjs";
import Button from "@mui/material/Button";

const UseStock = () => {
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
    const [order, setOrder] = useState<ArrangementOrder>('desc');
    const [orderBy, setOrderBy] = useState<string>('createdAt');

    const [isRemoveQtyVisible, setIsRemoveQtyVisible] = useState<boolean>(false);

    const handleAdd = () => navigate("/laundry-management/laundry-stock/add");

    const handleEdit = (id: number) => navigate(`/laundry-management/laundry-stock/edit/${id}`);

    const toggleRemoveQtyModal = (id?: number) => {
        if (id) {
            setSelectedId(id);
        }
        setIsRemoveQtyVisible(!isRemoveQtyVisible);
    };

    const handleDelete = (id: number) => {
        setSelectedId(id);
        setIsVisible(true);
    }

    const closeConfirmModal = () => {
        setIsVisible(false);
    };

    const fetch = useCallback(async () => {
        const payload: any = {
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
            payload.where.userID = user?.id;
        }
        try {
            startLoading();
            const { success, message, data }: any = await getLaundryStockList(payload);
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
    }, [page, rows, searchText, user, isAdmin, order, orderBy]);

    const handleRequestSort = (event: any, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const deleteConfirm = async () => {
        try {
            startLoading();
            const { success, message }: any = await deleteLaundaryStock(selectedId);
            if (success) {
                openSnackbar({
                    open: true,
                    message: message || 'Record deleted successfully',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    }
                })
                setIsVisible(false);
                fetch();
            }
            else {
                openSnackbar({
                    open: true,
                    message: message || 'Something went wrong',
                    variant: 'alert',
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
        }
    };

    const onDeleteHandler = async () => {
        try {
            startLoading();
            const { success, message }: any = await deleteLaundaryStock(selectedId);
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
        let columns: any[] = [
            {
                id: 'laundryItemID',
                label: 'Item',
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row: any) => row?.px_laundry_item?.itemName
            },
            {
                id: 'qty',
                label: 'Qty',
                numeric: true,
                disablePadding: false,
                isSortable: true,
                renderCell: (row: any) => row?.qty
            },
            {
                id: 'remove',
                label: 'Action',
                numeric: false,
                isSortable: false,
                renderCell: (row: any) => {
                    return (
                        <Box>
                            <Button variant="contained" color="error" onClick={() => toggleRemoveQtyModal(row.id)}>
                                Remove Item Qty
                            </Button>
                        </Box>
                    )
                }
            }
            // {
            //     id: 'actions',
            //     label: 'Actions',
            //     numeric: false,
            //     disablePadding: false,
            //     isSortable: false,
            //     renderCell: (row: any) => {
            //         return (
            //             <Box>
            //                 {/* {rights.edit &&
            //                     <IconButton onClick={() => handleEdit(row.id)}>
            //                         <Edit />
            //                     </IconButton>
            //                 } */}
            //                 {(isAdmin) &&
            //                     <IconButton onClick={() => handleDelete(row.id)}>
            //                         <Trash />
            //                     </IconButton>
            //                 }
            //             </Box>
            //         )
            //     }
            // }
        ];

        if (isAdmin) {
            columns.splice(0, 0, {
                id: 'userID',
                label: 'Branch Name',
                align: 'left',
                numeric: false,
                disablePadding: false,
                sortable: true,
                renderCell: (row: any) => row?.px_user?.lastName
            })
            columns.splice(3, 0, {
                id: 'actions',
                label: 'Actions',
                numeric: false,
                disablePadding: false,
                isSortable: false,
                renderCell: (row: any) => {
                    return (
                        <Box>
                            {/* {rights.edit &&
                                <IconButton onClick={() => handleEdit(row.id)}>
                                    <Edit />
                                </IconButton>
                            } */}
                            {(isAdmin) &&
                                <IconButton onClick={() => handleDelete(row.id)}>
                                    <Trash />
                                </IconButton>
                            }
                        </Box>
                    )
                }
            })
        }
        return columns;
    }, [rights, isAdmin]);

    const selectedRow = useMemo(() => {
        return list.find((item: any) => item.id === selectedId) || null;
    }, [list, selectedId]);

    const handleRemoveQty = async (qty: any) => {
        try {
            startLoading();
            if (qty <= 0) {
                openSnackbar({
                    open: true,
                    message: 'Invalid quantity',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    }
                })
                return;
            }
            if (qty > selectedRow?.qty) {
                openSnackbar({
                    open: true,
                    message: 'Invalid quantity',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    }
                })
                return;
            }
            const { success, message, data }: any = await createLaundryStock({
                laundryItemID: selectedRow?.laundryItemID,
                userID: selectedRow?.userID,
                qty: qty,
                type: 'REMOVE'
            });
            openSnackbar({
                open: true,
                message: success ? (message || 'Quantity removed successfully') : (message || 'Something went wrong'),
                variant: 'alert',
                severity: success ? 'success' : 'error',
                alert: {
                    color: success ? 'success' : 'error'
                }
            });
            if (success) {
                fetch();
            }
        } catch (error) {
            openSnackbar({
                open: true,
                message: 'Invalid quantity',
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

    return {
        list,
        page,
        rows,
        rights,
        Column,
        selectedRow,
        isRemoveQtyVisible,
        isVisible,
        totalCount,
        setPage,
        setRows,
        order,
        setOrder,
        orderBy,
        setOrderBy,
        handleAdd,
        searchHandler,
        handleRemoveQty,
        onDeleteHandler,
        handleRequestSort,
        closeConfirmModal,
        toggleRemoveQtyModal,
        setIsRemoveQtyVisible
    }
};

export default UseStock;
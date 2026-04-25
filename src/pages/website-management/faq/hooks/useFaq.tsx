import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ROWS } from "utils/constant";
import {
    updateFaq,
    deleteFaq,
    getFaqList
} from "service/faq";
import { openSnackbar } from "api/snackbar";
import { HeadCell, ArrangementOrder } from "types/table";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
import { Edit, Trash } from "iconsax-reactjs";
import useAuth from "hooks/useAuth";

const UseFaq = () => {
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

    const handleAdd = () => navigate("/website-management/faq/add");

    const handleEdit = (id: number) => navigate(`/website-management/faq/edit/${id}`);

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
            const { success, message, data }: any = await getFaqList(payload);
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

    const onStatusChange = async (id: number, newStatus: boolean) => {
        try {
            startLoading();
            const body: any = {
                isActive: newStatus,
                updatedBy: user?.id,
            };
            const { success, message }: any = await updateFaq(body, id);
            if (success) {
                fetch();
                openSnackbar({
                    open: true,
                    message: message || 'Record Changed Successfully',
                    variant: 'alert',
                    severity: 'success',
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
            stopLoading();
        }
    }

    const onDeleteHandler = async () => {
        try {
            startLoading();
            const { success, message }: any = await deleteFaq(selectedId);
            if (success) {
                fetch();
                openSnackbar({
                    open: true,
                    message: message || 'Record Deleted Successfully',
                    variant: 'alert',
                    severity: 'success',
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
                id: "title",
                label: "Title",
                align: "left",
                numeric: false,
                disablePadding: false,
                isSortable: true,
            },
            {
                id: 'description',
                label: "Description",
                align: "left",
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row) => {
                    return (
                        <Box>
                            <p dangerouslySetInnerHTML={{ __html: row?.description.substring(0, 250) + '...' }} />
                        </Box>
                    )
                }
            },
            {
                id: 'isActive',
                label: 'Status',
                align: 'left',
                numeric: false,
                disablePadding: false,
                renderCell: (row) => {
                    return (
                        <Box>
                            <Switch
                                checked={row?.isActive}
                                onChange={(e) => onStatusChange(row?.id, e.target.checked)}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </Box>
                    )
                }
            },
            {
                id: 'action',
                label: 'Action',
                align: 'left',
                numeric: false,
                disablePadding: false,
                renderCell: (row) => {
                    return (
                        <Box>
                            <IconButton
                                aria-label="edit"
                                onClick={() => handleEdit(row?.id)}
                                disabled={!rights.edit}
                            >
                                <Edit size={18} />
                            </IconButton>
                            <IconButton
                                aria-label="delete"
                                onClick={() => handleDelete(row?.id)}
                                disabled={!rights.delete}
                            >
                                <Trash size={18} />
                            </IconButton>
                        </Box>
                    )
                }
            }
        ]
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

export default UseFaq;
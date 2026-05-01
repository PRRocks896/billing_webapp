import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import { Edit, Trash } from "iconsax-reactjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteRent, getRentList, updateRent } from "service/rent";
import { HeadCell, ArrangementOrder } from "types/table";
import { ROWS } from "utils/constant";

const UseRent = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { user, accessRights } = useAuth();
    const rights = accessRights(pathname);

    const [list, setList] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [rows, setRows] = useState<number>(ROWS);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number>(-1);
    const [searchText, setSearchText] = useState<string>("");
    const [order, setOrder] = useState<ArrangementOrder>('desc');
    const [orderBy, setOrderBy] = useState<string>('createdAt');

    const handleAdd = () => navigate("/rent-management/rent/add");

    const handleEdit = (id: number) => navigate(`/rent-management/rent/edit/${id}`);

    const handleDelete = (id: number) => {
        setSelectedId(id);
        setIsVisible(true);
    };

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
            const { success, message, data }: any = await getRentList(payload);
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
        }
    }, [page, rows, searchText, order, orderBy]);

    const handleRequestSort = (event: any, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const onStatusChange = async (id: number, data: any) => {
        try {
            const body: any = {
                ...data,
                updatedBy: user?.id,
            };
            const { success, message }: any = await updateRent(body, id);
            if (success) {
                fetch();
                openSnackbar({
                    open: true,
                    message: message || 'Record Changed Successfully',
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
                alert: {
                    color: 'error'
                }
            })
        }
    }

    const onDeleteHandler = async () => {
        try {
            const { success, message }: any = await deleteRent(selectedId);
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
                alert: {
                    color: 'error'
                }
            })
        } finally {
            setIsVisible(false);
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
                id: 'planName',
                label: 'Plan Name',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
            },
            {
                id: 'price',
                label: 'Price',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
            },
            {
                id: 'hours',
                label: 'Hours',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
            },
            {
                id: 'hsnCode',
                label: 'HSN Code',
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
                renderCell: (row) => {
                    return (
                        <Box>
                            <Switch
                                checked={row.isActive}
                                onChange={() => onStatusChange(row.id, { isActive: !row.isActive })}
                            />
                        </Box>
                    );
                },
            },
            {
                id: 'isWebDisplay',
                label: 'Web Display',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row) => {
                    return (
                        <Box>
                            <Switch
                                checked={row.isWebDisplay}
                                onChange={() => onStatusChange(row.id, { isWebDisplay: !row.isWebDisplay })}
                            />
                        </Box>
                    )
                }
            },
            {
                id: 'actions',
                label: 'Actions',
                align: 'right',
                numeric: false,
                disablePadding: false,
                renderCell: (row) => {
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
    }, [rights]);

    return {
        list,
        page,
        rows,
        order,
        rights,
        Column,
        orderBy,
        isVisible,
        totalCount,
        setPage,
        setRows,
        setOrder,
        setOrderBy,
        handleRequestSort,
        handleAdd,
        searchHandler,
        onDeleteHandler,
        closeConfirmModal
    }
}

export default UseRent;
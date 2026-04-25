import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { Edit, Trash } from "iconsax-reactjs";
import Switch from "@mui/material/Switch";

import { ROWS } from "utils/constant";
import { HeadCell, ArrangementOrder } from "types/table";
import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import { getUserList, createUser, deleteUser, getUserById, updateUser } from "service/user";

const UseBranch = () => {

    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { user, accessRights, startLoading, stopLoading } = useAuth();
    const rights = accessRights(pathname);
    let debounceTimeout: NodeJS.Timeout;

    const [list, setList] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [rows, setRows] = useState<number>(ROWS);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number>(-1);
    const [searchText, setSearchText] = useState<string>("");
    const [order, setOrder] = useState<ArrangementOrder>('desc');
    const [orderBy, setOrderBy] = useState<string>('createdAt');

    const handleAdd = () => navigate("/branch/add");

    const handleEdit = (id: number) => navigate(`/branch/edit/${id}`);

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
            startLoading();
            const { success, message, data }: any = await getUserList(payload);
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

    const onStatusChange = async (id: number, data: any) => {
        try {
            startLoading();
            const body: any = {
                ...data,
                updatedBy: user?.id,
            };
            const { success, message }: any = await updateUser(body, id);
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
        } finally {
            stopLoading();
        }
    }

    const onDeleteHandler = async () => {
        try {
            startLoading();
            const { success, message }: any = await deleteUser(selectedId);
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
            stopLoading();
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
                id: 'name',
                label: 'Name',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row) => {
                    return (
                        <Box>
                            {row.firstName + " " + row.lastName}
                        </Box>
                    )
                }
            },
            {
                id: 'userName',
                label: 'Username',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true
            },
            {
                id: 'branchName',
                label: 'Branch',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true
            },
            {
                id: 'email',
                label: 'Email',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true
            },
            {
                id: 'phoneNumber',
                label: 'Phone',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true
            },
            {
                id: 'otp',
                label: 'OTP',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row) => {
                    return (
                        <Box>
                            {row.otp || 'N/A'}
                        </Box>
                    )
                }
            },
            {
                id: 'isWebLogin',
                label: 'Web Login',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row) => {
                    return (
                        <Box>
                            <Switch
                                checked={row.isWebLogin}
                                onChange={() => onStatusChange(row.id, { isWebLogin: !row.isWebLogin })}
                            />
                        </Box>
                    )
                }
            },
            {
                id: 'isAppLogin',
                label: 'App Login',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row) => {
                    return (
                        <Box>
                            <Switch
                                checked={row.isAppLogin}
                                onChange={() => onStatusChange(row.id, { isAppLogin: !row.isAppLogin })}
                            />
                        </Box>
                    )
                }
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
                id: 'isActive',
                label: 'Status',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
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
    }, [rights])

    return {
        list,
        page,
        rows,
        rights,
        Column,
        isVisible,
        totalCount,
        order,
        orderBy,
        handleRequestSort,
        setPage,
        setRows,
        handleAdd,
        searchHandler,
        onDeleteHandler,
        closeConfirmModal
    };
};

export default UseBranch;
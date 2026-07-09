import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import useAuth from "hooks/useAuth";
import { ROWS } from "utils/constant";
import { deleteStaff, getStaffList, updateStaff, findStaff } from "service/staff";
import { getBranch } from "service/user";
import { openSnackbar } from "api/snackbar";
import { HeadCell, ArrangementOrder } from "types/table";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import { Chip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Edit, Trash, Eye } from "iconsax-reactjs";

const UseStaff = () => {

    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { isAdmin, user, accessRights, startLoading, stopLoading } = useAuth();
    const rights = accessRights(pathname);

    const [list, setList] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [rows, setRows] = useState<number>(ROWS);
    const [staffCount, setStaffCount] = useState<any>({
        activeStaff: 0,
        inActiveStaff: 0,
        blockedStaff: 0,
        totalStaff: 0
    })
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number>(-1);
    const [searchText, setSearchText] = useState<string>("");
    const [order, setOrder] = useState<ArrangementOrder>('desc');
    const [orderBy, setOrderBy] = useState<string>('createdAt');

    const handleAdd = () => navigate("/staff/add");

    const handleEdit = (id: number) => navigate(`/staff/edit/${id}`);

    const handleView = (id: number) => navigate(`/staff/view/${id}`);

    const handleRekyc = (id: number) => navigate(`/staff/rekyc/${id}`)

    const handleDelete = (id: number) => {
        setSelectedId(id);
        setIsVisible(true);
    };

    const closeConfirmModal = () => {
        setIsVisible(false);
    };

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
            payload.where.userID = user?.id;
        }

        try {
            startLoading();
            const { success, message, data }: any = await getStaffList(payload);
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
    }, [page, rows, searchText, order, orderBy, isAdmin]);

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
            const { success, message }: any = await updateStaff(body, id);
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
            const { success, message }: any = await deleteStaff(selectedId);
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
        if (!isAdmin) return;
        (async () => {
            try {
                startLoading();
                const [
                    activeStaffRes,
                    inActiveStaffRes,
                    blockedStaffRes,
                    totalStaffRes
                ] = await Promise.all([
                    findStaff({ isActive: true, isDeleted: false }),
                    findStaff({ isActive: false, isDeleted: false }),
                    findStaff({ isblackList: true }),
                    findStaff({})
                ])

                setStaffCount({
                    activeStaff: activeStaffRes?.data?.length || 0,
                    inActiveStaff: inActiveStaffRes?.data?.length || 0,
                    blockedStaff: blockedStaffRes?.data?.length || 0,
                    totalStaff: totalStaffRes?.data?.length || 0
                })
            } catch (error: any) {
                console.error(error)
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
        })()
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
                id: 'name',
                label: 'Name',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
            },
            {
                id: 'nickName',
                label: 'Nick Name',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
            },
            // {
            //     id: 'phoneNumber',
            //     label: 'Phone Number',
            //     align: 'left',
            //     numeric: false,
            //     disablePadding: false,
            //     isSortable: true,
            // },
            {
                id: 'employeeTypeID',
                label: 'Employee Type',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row: any) => {
                    return (
                        <Box>
                            {row?.px_employee_type?.name}
                        </Box>
                    )
                }
            },
            {
                id: 'userID',
                label: 'Branch Name',
                align: 'left',
                numeric: false,
                disablePadding: false,
                renderCell: (row: any) => {
                    return (
                        <Box>
                            {row?.px_user?.lastName}
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
                renderCell: (row: any) => {
                    if (!isAdmin) {
                        return <Chip
                            variant="filled"
                            size="medium"
                            label={row.isActive ? 'Active' : 'Inactive'}
                            color={row.isActive ? 'success' : 'error'}
                        />
                    }
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
                id: 'isKyc',
                label: 'KYC Status',
                align: 'left',
                numeric: false,
                disablePadding: false,
                renderCell: (row: any) => {
                    const title = row.isKyc ? 'KYC Done' : 'KYC Pending';
                    if (isAdmin || rights.delete) {
                        return <Chip
                            variant="filled"
                            size="medium"
                            clickable={row.isKyc ? false : true}
                            label={title}
                            color={row.isKyc ? 'success' : 'error'}
                            onClick={() => !row.isKyc ? handleRekyc(row.id) : null}
                        />
                    } else {
                        return <Chip
                            variant="filled"
                            size="medium"
                            label={title}
                            color={row.isKyc ? 'success' : 'error'}
                        />;
                    }
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
                            {rights.view && isAdmin &&
                                <IconButton onClick={() => handleView(row.id)}>
                                    <Eye />
                                </IconButton>
                            }
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
                id: 'phoneNumber',
                label: 'Phone Number',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
            });
            col.splice(6, 0,
                {
                    id: 'isDisabled',
                    label: 'Disabled',
                    align: 'left',
                    numeric: false,
                    disablePadding: false,
                    renderCell: (row: any) => {
                        if (!isAdmin) {
                            return <Chip
                                variant="filled"
                                size="medium"
                                label={row.isDisabled ? 'Disabled' : 'Not Disabled'}
                                color={row.isDisabled ? 'error' : 'success'}
                            />
                        }
                        return (
                            <Box>
                                <Switch
                                    checked={row.isDisabled}
                                    onChange={() => onStatusChange(row.id, { isDisabled: !row.isDisabled })}
                                />
                            </Box>
                        );
                    },
                }
            )
            col.splice(7, 0,
                {
                    id: 'isLoginPermission',
                    label: 'Login Permission',
                    align: 'left',
                    numeric: false,
                    disablePadding: false,
                    renderCell: (row: any) => {
                        if (!isAdmin) {
                            return <Chip
                                variant="filled"
                                size="medium"
                                label={row.isLoginPermission ? 'Allowed' : 'Not Allowed'}
                                color={row.isLoginPermission ? 'success' : 'error'}
                            />
                        }
                        return (
                            <Box>
                                <Switch
                                    checked={row.isLoginPermission}
                                    onChange={() => onStatusChange(row.id, { isLoginPermission: !row.isLoginPermission })}
                                />
                            </Box>
                        );
                    },
                },
            )
            col.splice(8, 0,
                {
                    id: 'isblackList',
                    label: 'Blocked',
                    align: 'left',
                    numeric: false,
                    disablePadding: false,
                    renderCell: (row: any) => {
                        if (!isAdmin) {
                            return <Chip
                                variant="filled"
                                size="medium"
                                label={row.isblackList ? 'Blocked' : 'Not Blocked'}
                                color={row.isblackList ? 'error' : 'success'}
                            />
                        }
                        return (
                            <Box>
                                <Switch
                                    checked={row.isblackList}
                                    onChange={() => onStatusChange(row.id, { isblackList: !row.isblackList })}
                                />
                            </Box>
                        );
                    },
                }
            )
        }
        return col;
    }, [rights, isAdmin])

    return {
        isAdmin,
        list,
        page,
        rows,
        rights,
        Column,
        staffCount,
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

export default UseStaff;
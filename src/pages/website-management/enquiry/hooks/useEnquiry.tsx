import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ROWS } from "utils/constant";
import {
    updateEnquiry,
    deleteEnquiry,
    getEnquiryList
} from "service/enquiry";
import { openSnackbar } from "api/snackbar";
import { HeadCell, ArrangementOrder } from "types/table";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
import { Edit, Trash } from "iconsax-reactjs";
import useAuth from "hooks/useAuth";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const UseEnquiry = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { isAdmin, user, accessRights, startLoading, stopLoading } = useAuth();
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

    const handleAdd = () => navigate("/website-management/enquiry/add");

    const handleEdit = (id: number) => navigate(`/website-management/enquiry/edit/${id}`);

    const handleDelete = (id: number) => {
        setSelectedId(id);
        setIsVisible(true);
    }

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
            payload.where.userId = user?.id;
        }
        try {
            startLoading();
            const { success, message, data }: any = await getEnquiryList(payload);
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
    }, [page, rows, searchText, isAdmin, order, orderBy]);

    const handleRequestSort = (event: any, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const onStatusChange = async (id: number, newStatus: string) => {
        try {
            startLoading();
            const body: any = {
                status: newStatus,
                updatedBy: user?.id,
            };
            const { success, message }: any = await updateEnquiry(body, id);
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
            const { success, message }: any = await deleteEnquiry(selectedId);
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
                id: "name",
                label: "Name",
                align: "left",
                numeric: false,
                disablePadding: false,
                isSortable: true,
            },
            {
                id: 'email',
                label: "Email",
                align: "left",
                numeric: false,
                disablePadding: false,
                isSortable: true,
            },
            {
                id: 'phoneNumber',
                label: 'Phone Number',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
            },
            {
                id: 'description',
                label: 'Description',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
            },
            {
                id: 'user',
                label: 'User',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row) => {
                    return (
                        <Box>
                            {row?.px_user?.lastName || 'N/A'}
                        </Box>
                    )
                }
            },
            {
                id: 'status',
                label: "Status",
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row) => {
                    if (!rights.edit) {
                        return row?.status;
                    }
                    return (
                        <Box>
                            <Select
                                value={row?.status}
                                onChange={(e) => onStatusChange(row?.id, e.target.value)}
                                size="small"
                                variant="filled"
                                sx={{
                                    height: 32,
                                    minWidth: 120,
                                    backgroundColor: row?.status === 'Raised' ? 'error.lighter' : row?.status === 'Attended' ? 'warning.lighter' : row?.status === 'Success' ? 'success.lighter' : 'error.lighter',
                                    color: row?.status === 'Raised' ? 'error.main' : row?.status === 'Attended' ? 'warning.main' : row?.status === 'Success' ? 'success.main' : 'error.main',
                                    '& .MuiSelect-select': {
                                        padding: '4px 12px',
                                        fontSize: '0.875rem',
                                    },
                                    '& .MuiSvgIcon-root': {
                                        width: 16,
                                        height: 16,
                                    },
                                }}
                            >
                                <MenuItem value="Raised">Raised</MenuItem>
                                <MenuItem value="Attended">Attended</MenuItem>
                                <MenuItem value="Success">Converted</MenuItem>
                                <MenuItem value="Pending">Not Interested</MenuItem>
                            </Select>
                        </Box>
                    )
                }
            }
            // {
            //     id: 'isActive',
            //     label: 'Status',
            //     align: 'left',
            //     numeric: false,
            //     disablePadding: false,
            //     renderCell: (row) => {
            //         return (
            //             <Box>
            //                 <Switch
            //                     checked={row?.isActive}
            //                     onChange={(e) => onStatusChange(row?.id, e.target.checked)}
            //                     inputProps={{ 'aria-label': 'controlled' }}
            //                 />
            //             </Box>
            //         )
            //     }
            // },
            // {
            //     id: 'action',
            //     label: 'Action',
            //     align: 'left',
            //     numeric: false,
            //     disablePadding: false,
            //     renderCell: (row) => {
            //         return (
            //             <Box>
            //                 <IconButton
            //                     aria-label="edit"
            //                     onClick={() => handleEdit(row?.id)}
            //                     disabled={!rights.edit}
            //                 >
            //                     <Edit size={18} />
            //                 </IconButton>
            //                 <IconButton
            //                     aria-label="delete"
            //                     onClick={() => handleDelete(row?.id)}
            //                     disabled={!rights.delete}
            //                 >
            //                     <Trash size={18} />
            //                 </IconButton>
            //             </Box>
            //         )
            //     }
            // }
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
};

export default UseEnquiry;
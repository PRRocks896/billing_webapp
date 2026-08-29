import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import useAuth from "hooks/useAuth";

import { ROWS } from "utils/constant";
import { getLaundryChallanList, updateLaundryChallan, cancelChallan } from "service/laundry-challan";
import { openSnackbar } from "api/snackbar";
import { HeadCell, ArrangementOrder } from "types/table";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import { Edit, CloseCircle } from "iconsax-reactjs";

const UseChallan = () => {
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

    const handleAdd = () => navigate("/laundry-management/laundry-challan/add");

    const handleEdit = (id: number) => navigate(`/laundry-management/laundry-challan/edit/${id}`);

    const handleCancelClick = (id: number) => {
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
            const { success, message, data }: any = await getLaundryChallanList(payload);
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

    const onCancelHandler = async () => {
        try {
            startLoading();
            const { success, message }: any = await cancelChallan(selectedId, { cancelledBy: user?.id });
            if (success) {
                fetch();
                openSnackbar({
                    open: true,
                    message: message || 'Challan Cancelled Successfully',
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
                id: "challanCode",
                label: "Challan No.",
                align: "left",
                numeric: false,
                disablePadding: false,
                isSortable: true,
            },
            {
                id: "manager",
                label: "Manager Name",
                align: "left",
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row) => row?.managerData?.map((i: any) => i.nickName).join(', ') || '-'
            },
            {
                id: "vendorId",
                label: "Vendor Name",
                align: "left",
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row) => row?.px_vendor?.name || '-'
            },
            {
                id: 'totalItems',
                label: "Total Items",
                align: "left",
                numeric: false,
                disablePadding: false,
                isSortable: true
            },
            {
                id: 'totalAmount',
                label: "Amount",
                align: "left",
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row) => `₹${row?.items?.reduce((acc: number, item: any) => acc + (item?.price || 0), 0).toLocaleString('en-IN')}/-` || '-'
            },
            {
                id: 'status',
                label: 'Status',
                align: 'left',
                numeric: false,
                disablePadding: false,
                renderCell: (row) => {
                    let color: any = "primary";
                    if (row?.status === 'RECEIVED') color = "success";
                    if (row?.status === 'CANCELLED') color = "error";
                    if (row?.status === 'PARTIALLY_RECEIVED') color = "warning";

                    return (
                        <Chip label={row?.status?.replace('_', ' ')} color={color} size="small" variant="light" />
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
                            {/* Only allow edit if status is SENT */}
                            <IconButton
                                aria-label="edit"
                                onClick={() => handleEdit(row?.id)}
                                disabled={!rights.edit || row?.status !== 'SENT'}
                            >
                                <Edit size={18} />
                            </IconButton>
                            <IconButton
                                aria-label="cancel"
                                color="error"
                                onClick={() => handleCancelClick(row?.id)}
                                disabled={!rights.delete || row?.status !== 'SENT'}
                            >
                                <CloseCircle size={18} />
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
        onCancelHandler,
        closeConfirmModal
    }
}

export default UseChallan;

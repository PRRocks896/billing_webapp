import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import useAuth from "hooks/useAuth";

import { ROWS } from "utils/constant";
import { getLaundryReturnList } from "service/laundry-return";
import { openSnackbar } from "api/snackbar";
import { HeadCell, ArrangementOrder } from "types/table";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { Eye } from "iconsax-reactjs";

const UseReturn = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { user, accessRights, startLoading, stopLoading } = useAuth();
    const rights = accessRights(pathname);
    const [searchText, setSearchText] = useState<string>("");
    const [list, setList] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [rows, setRows] = useState<number>(ROWS);
    const [order, setOrder] = useState<ArrangementOrder>('desc');
    const [orderBy, setOrderBy] = useState<string>('createdAt');

    const handleAdd = () => navigate("/laundry-management/laundry-return/add");

    const handleView = (id: number) => navigate(`/laundry-management/laundry-return/view/${id}`);

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
            const { success, message, data }: any = await getLaundryReturnList(payload);
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
                id: "returnDate",
                label: "Return Date",
                align: "left",
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row) => new Date(row?.returnDate).toLocaleDateString()
            },
            {
                id: "challanCode",
                label: "Challan Code",
                align: "left",
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row) => row?.challan?.challanCode || '-'
            },
            {
                id: "vendorId",
                label: "Vendor Name",
                align: "left",
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row) => row?.challan?.vendor?.name || '-'
            },
            {
                id: 'totalReceivedQty',
                label: "Received",
                align: "left",
                numeric: false,
                disablePadding: false,
                isSortable: true
            },
            {
                id: 'totalDamagedQty',
                label: "Damaged",
                align: "left",
                numeric: false,
                disablePadding: false,
                isSortable: true
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
                                aria-label="view"
                                onClick={() => handleView(row?.id)}
                            >
                                <Eye size={18} />
                            </IconButton>
                        </Box>
                    )
                }
            }
        ]
    }, []);

    return {
        list,
        page,
        rows,
        rights,
        Column,
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
    }
}

export default UseReturn;

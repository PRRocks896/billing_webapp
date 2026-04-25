import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ROWS } from "utils/constant";
import {
    updateContactUs,
    deleteContactUs,
    getContactUsList
} from "service/contact";
import { openSnackbar } from "api/snackbar";
import { HeadCell, ArrangementOrder } from "types/table";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
import { Edit, Trash } from "iconsax-reactjs";
import useAuth from "hooks/useAuth";
import moment from "moment";

const UseContactUs = () => {
    const { pathname } = useLocation();
    const { isAdmin, user, accessRights, startLoading, stopLoading } = useAuth();
    const rights = accessRights(pathname);

    const [searchText, setSearchText] = useState<string>("");
    const [list, setList] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [rows, setRows] = useState<number>(ROWS);
    const [order, setOrder] = useState<ArrangementOrder>('desc');
    const [orderBy, setOrderBy] = useState<string>('createdAt');

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
            const { success, message, data }: any = await getContactUsList(payload);
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
    }, [page, rows, searchText, order, orderBy, isAdmin]);

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
                id: "fullName",
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
                render: (value: any) => {
                    return value?.email || "N/A"
                }
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
                renderCell: (value: any) => {
                    return value?.description || "N/A"
                }
            },
            {
                id: 'serviceID',
                label: 'Service',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (value: any) => {
                    return value?.px_service?.displayName || "N/A"
                }
            },
            {
                id: 'userID',
                label: 'Branch',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (value: any) => {
                    return value?.px_user?.lastName || "N/A"
                }
            },
            {
                id: 'cityID',
                label: 'City',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (value: any) => {
                    return value?.px_citie?.name || "N/A"
                }
            },
            {
                id: 'createdAt',
                label: 'Created At',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (value: any) => {
                    return moment(value?.createdAt).format("DD-MM-YYYY hh:mm A") || "N/A"
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
        totalCount,
        order,
        orderBy,
        handleRequestSort,
        setPage,
        setRows,
        searchHandler
    }
}

export default UseContactUs
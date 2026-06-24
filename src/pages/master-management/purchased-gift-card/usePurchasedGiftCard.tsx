

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import { Edit, Trash } from "iconsax-reactjs";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getPurchaseGiftCardList } from "service/purchaseGiftCard";
import { HeadCell, ArrangementOrder } from "types/table";
import { ROWS } from "utils/constant";

const UsePurchasedGiftCard = () => {

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
            const { success, message, data }: any = await getPurchaseGiftCardList(payload);
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
                id: 'deliveryDate',
                label: 'Delivery Date',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row) => {
                    return <Box>{moment(row.deliveryDate).format("DD-MMM-YYYY")}</Box>
                }
            },
            {
                id: 'recipientName',
                label: 'Recipient Name',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true
            },
            {
                id: 'recipientPhoneNumber',
                label: 'Recipient Phone No.',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true
            },
            {
                id: 'recipientEmail',
                label: 'Recipient Email',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true
            },
            {
                id: 'codeNumber',
                label: 'Code Number',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true
            },
            {
                id: 'senderName',
                label: 'Sender Name',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true
            },
            {
                id: 'amount',
                label: 'Amount',
                align: 'right',
                numeric: true,
                disablePadding: false,
                isSortable: true,
                renderCell: (row) => {
                    return <Box>{(row.amount || '0').toLocaleString("en-IN", { style: "currency", currency: "INR" })}</Box>
                }
            },
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
            //                     checked={row.isActive}
            //                     onChange={() => onStatusChange(row.id, { isActive: !row.isActive })}
            //                 />
            //             </Box>
            //         );
            //     },
            // },
            // {
            //     id: 'actions',
            //     label: 'Actions',
            //     align: 'right',
            //     numeric: false,
            //     disablePadding: false,
            //     renderCell: (row) => {
            //         return (
            //             <Box>
            //                 {rights.edit &&
            //                     <IconButton onClick={() => handleEdit(row.id)}>
            //                         <Edit />
            //                     </IconButton>
            //                 }
            //                 {rights.delete &&
            //                     <IconButton onClick={() => handleDelete(row.id)}>
            //                         <Trash />
            //                     </IconButton>
            //                 }
            //             </Box>
            //         )
            //     }
            // },
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
        searchHandler,
        handleRequestSort,
    }
}
export default UsePurchasedGiftCard;
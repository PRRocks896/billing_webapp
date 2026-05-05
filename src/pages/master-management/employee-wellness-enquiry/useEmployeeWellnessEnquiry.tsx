
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import { Edit, Trash } from "iconsax-reactjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteEmpWellnessEnquiry, getEmpWellnessEnquiryList, updateEmpWellnessEnquiry } from "service/empWellnessEnquiry";
import { HeadCell, ArrangementOrder } from "types/table";
import { ROWS } from "utils/constant";

const UseEmployeeWellnessEnquiry = () => {

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
            const { success, message, data }: any = await getEmpWellnessEnquiryList(payload);
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
                id: 'name',
                label: 'Name',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true
            },
            {
                id: 'designation',
                label: 'Designation',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true
            },
            {
                id: 'companyName',
                label: 'Company',
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
                label: 'Phone No.',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true
            },
            {
                id: 'location',
                label: 'Location',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true
            },
            {
                id: 'numberEmployee',
                label: 'No. of Employees',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row) => {
                    if (row.numberEmployee === 'ONE_TO_FIFTY') {
                        return <Box>1-50</Box>
                    }
                    if (row.numberEmployee === 'FIFTYONE_TO_ONEFIFTY') {
                        return <Box>51-150</Box>
                    }
                    if (row.numberEmployee === 'ONEFIFTYONE_TO_FIVEHUNDRED') {
                        return <Box>151-500</Box>
                    }
                    if (row.numberEmployee === 'FIVEHUNDRED_PLUS') {
                        return <Box>501+</Box>
                    }
                    return <Box>{row.numberEmployee || '-'}</Box>
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
};

export default UseEmployeeWellnessEnquiry;
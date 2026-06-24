import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getBookingServiceList } from "service/bookingService";
import { getBranch } from "service/user";
import { HeadCell, ArrangementOrder } from "types/table";
import { ROWS } from "utils/constant";

const UseBookingService = () => {

    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { user, isAdmin, accessRights, startLoading, stopLoading } = useAuth();
    const rights = accessRights(pathname);

    const [branchList, setBranchList] = useState<any[]>([]);
    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);

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

        if (!isAdmin && user) {
            payload.where.userID = user.id;
        } else if (selectedBranchId) {
            payload.where.userID = selectedBranchId;
        }

        try {
            startLoading();
            const { success, message, data }: any = await getBookingServiceList(payload);
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
    }, [page, rows, searchText, order, orderBy, selectedBranchId]);

    const handleRequestSort = (event: any, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const searchHandler = (searchText: string) => {
        setPage(0);
        setSearchText(searchText);
    };

    const fetchBranch = async () => {
        try {
            startLoading();
            const whereCondition = {
                isActive: true,
                isDeleted: false,
            };
            const { success, message, data }: any = await getBranch(whereCondition);
            if (!success) {
                openSnackbar({
                    open: true,
                    message: message,
                    variant: 'alert',
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                });
                return;
            }
            if (data && data && Array.isArray(data) && data.length > 0) {
                setBranchList(data.filter((item: any) => {
                    if (item && item.px_role && item.px_role.name && !['admin', 'super admin'].includes(item.px_role.name.toLowerCase())) {
                        return item;
                    }
                }))
            } else {
                setBranchList([]);
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

    useEffect(() => {
        if (isAdmin && user && user.companyID) {
            fetchBranch();
        }
    }, [isAdmin, user]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetch();
        }, 500);
        return () => clearTimeout(timeout);
    }, [page, rows, searchText, order, orderBy, selectedBranchId]);

    const Column: HeadCell[] = useMemo(() => {
        return [
            {
                id: 'date',
                label: 'Booking Date',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row) => {
                    return <span>{moment(row.date).format('DD/MM/YYYY')}</span>
                },
            },
            {
                id: 'user',
                label: 'Branch Name',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row) => {
                    return <span>{row?.px_user?.lastName}</span>
                }
            },
            {
                id: 'customer',
                label: 'Customer Name',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row) => {
                    return <span>{row?.px_customer?.name}</span>
                }
            },
            {
                id: 'service',
                label: 'Service',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row) => {
                    return <span>{row?.px_service?.displayName}</span>
                }
            },
            {
                id: 'duration',
                label: 'Duration',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
            },
            {
                id: 'promoCode',
                label: 'Applied PromoCode',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row) => {
                    return <span>{row?.px_promo_code?.code || '-'}</span>
                }
            },
            {
                id: 'redeemStatus',
                label: 'Redeem Status',
                align: 'left',
                numeric: false,
                disablePadding: false,
                isSortable: true
            },
            {
                id: 'grandTotal',
                label: 'Grand Total',
                align: 'right',
                numeric: false,
                disablePadding: false,
                isSortable: true,
                renderCell: (row) => {
                    return <span>{row?.grandTotal}/-</span>
                }
            }
        ]
    }, [rights, isAdmin]);

    return {
        list,
        page,
        rows,
        rights,
        Column,
        isAdmin,
        branchList,
        isVisible,
        totalCount,
        selectedBranchId,
        setPage,
        setRows,
        order,
        setOrder,
        orderBy,
        setSelectedBranchId,
        setOrderBy,
        handleRequestSort,
        searchHandler
    }
}

export default UseBookingService;
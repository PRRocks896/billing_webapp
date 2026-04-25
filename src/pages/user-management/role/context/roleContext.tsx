import { createContext, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { Edit, Trash } from "iconsax-reactjs";

import useAuth from "hooks/useAuth";
import { deleteRole, getRoleList, updateRole } from "service/role";
import { openSnackbar } from "api/snackbar";

import { FETCHROLE, CHANGESTATUSROLE, DELETEROLE } from './actions';
import roleReducer from "./role";
import { HeadCell, ArrangementOrder } from "types/table";
import { ROWS } from "utils/constant";
import Switch from "@mui/material/Switch";

type RoleContextType = {
    state: any;
    rights: any;
    rows: number;
    page: number;
    isVisible: boolean;
    selectedId: number;
    Column: HeadCell[];
    setPage: (page: number) => void;
    setRows: (rows: number) => void;
    handleAdd: () => void;
    handleEdit: (id: number) => void;
    handleDelete: (id: number) => void;
    searchHandler: (searchText: string) => void;
    onDeleteHandler: () => void;
    closeConfirmModal: () => void;
    order: ArrangementOrder;
    orderBy: string;
    handleRequestSort: (event: any, property: string) => void;
}

const RoleContext = createContext<RoleContextType | null>(null);

export const RoleProvider = ({ children }: { children: React.ReactElement }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { user, startLoading, stopLoading, accessRights } = useAuth();
    const rights = accessRights(pathname);
    const [state, dispatch] = useReducer(roleReducer, {
        list: [],
        error: null,
        count: 0,
    });

    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(ROWS);

    const [isVisible, setIsVisible] = useState(false);
    const [selectedId, setSelectedId] = useState<number>(-1);
    const [searchText, setSearchText] = useState<string>("");
    const [order, setOrder] = useState<ArrangementOrder>('desc');
    const [orderBy, setOrderBy] = useState<string>('createdAt');

    const handleAdd = () => {
        navigate("/role/add");
    }

    const handleEdit = (id: number) => {
        navigate(`/role/edit/${id}`);
    };

    const handleDelete = (id: number) => {
        setSelectedId(id);
        setIsVisible(true);
    };

    const closeConfirmModal = () => {
        setIsVisible(false);
    };

    const onStatusChange = async (id: number, newStatus: boolean) => {
        try {
            startLoading();
            const body: any = {
                isActive: newStatus,
                updatedBy: user?.id,
            };
            const { success, message }: any = await updateRole(body, id);
            if (success) {
                dispatch({
                    type: CHANGESTATUSROLE,
                    payload: {
                        id,
                        isActive: newStatus
                    }
                });
                openSnackbar({
                    open: true,
                    message: message || 'Something went wrong',
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
            const { success, message }: any = await deleteRole(selectedId);
            if (success) {
                dispatch({
                    type: DELETEROLE,
                    payload: {
                        id: selectedId,
                        list: state.list.filter((list: any) => list.id !== selectedId)
                    }
                });
                openSnackbar({
                    open: true,
                    message: message || 'Something went wrong',
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
            const { success, message, data }: any = await getRoleList(payload);
            if (success) {
                dispatch({
                    type: FETCHROLE,
                    payload: {
                        list: data.rows,
                        count: data.count,
                    },
                });
            } else {
                dispatch({
                    type: FETCHROLE,
                    payload: {
                        list: [],
                        count: 0,
                    },
                });
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
                                onChange={() => onStatusChange(row.id, !row.isActive)}
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
    }, [rights]);

    return (
        <RoleContext.Provider value={{
            state,
            rows,
            page,
            rights,
            Column,
            isVisible,
            selectedId,
            setPage,
            setRows,
            handleAdd,
            handleEdit,
            handleDelete,
            searchHandler,
            onDeleteHandler,
            closeConfirmModal,
            order,
            orderBy,
            handleRequestSort,
        }}>
            {children}
        </RoleContext.Provider>
    )
}

export default RoleContext;
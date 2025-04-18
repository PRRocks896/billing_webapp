import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { getRoomList, updateRoom, deleteRoom } from "../../../service/room";
import { listPayload, rightsAccess, showToast } from "../../../utils/helper";
import { startLoading, stopLoading } from "../../../redux/loader";

const useRoomHook = () => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const loggedInUser = useSelector((state) => state.loggedInUser);
    const { accessModules } = loggedInUser;

    const [deleteId, setDeleteId] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // pagination start
    const [page, setPage] = useState(0);
    const [count, setCount] = useState(0);
    const [rows, setRows] = useState([]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const rights = useMemo(() => {
        return rightsAccess(accessModules, pathname);
    }, [accessModules, pathname]);

    const isAdmin = useMemo(() => {
        if(loggedInUser && loggedInUser.px_role && ['Admin', 'Super Admin'].includes(loggedInUser.px_role.name)) {
            return true;
        }
        return false;
    }, [loggedInUser]);

    //  fetch company
    const fetchRoomData = useCallback(async (searchValue = "") => {
        try {
            dispatch(startLoading());
            let whereCondition = {
                isDeleted: false,
                searchText: searchValue,
            };
            if(!isAdmin) {
                whereCondition = {
                    ...whereCondition,
                    userID: loggedInUser.id,
                };
            }
            const body = listPayload(page, whereCondition);
            const response = await getRoomList(body);
            let payload = [];
            if (response?.statusCode === 200) {
                const payload = response?.data?.rows;
                setCount(response?.data?.count);
                setRows(payload);
                return;
                // dispatch(roleAction.storeRole(payload));
            }
            setCount(0);
            setRows(payload);
            // dispatch(roleAction.storeRole(payload));
        } catch (error) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    }, [dispatch, page, isAdmin]);

    // search role
    const searchRoomHandler = async (payload) => {
        try {
            fetchRoomData(payload.searchValue);
        } catch (error) {
            showToast(error?.message, false);
        }
    };

    useEffect(() => {
        fetchRoomData();
    }, [fetchRoomData]);

    // delete company click handler
    const deleteBtnClickHandler = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    // delete company
    const deleteHandler = async () => {
        try {
            setIsDeleteModalOpen(false);
            dispatch(startLoading());
            const response = await deleteRoom(deleteId);
            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                // dispatch(roleAction.removeRole({ id: deleteId }));
                setCount((prev) => prev - 1);
                fetchRoomData();
            } else {
                showToast(response?.messageCode, false);
            }
        } catch (error) {
            showToast(error?.message, false);
        } finally {
            setIsDeleteModalOpen(false);
            dispatch(stopLoading());
        }
    };

    // change status handler
    const changeStatusHandler = async (e, id) => {
        try {
            const payload = {
                isActive: e.target.checked,
                updatedBy: loggedInUser.id,
            };
            const response = await updateRoom(payload, id);

            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                fetchRoomData();
                // const payload2 = { id, status: payload.isActive };
                // dispatch(roleAction.changeRoleStatus(payload2));
            } else {
                showToast(response?.message, false);
            }
        } catch (error) {
            showToast(error?.message, false);
        }
    };

    return {
        page,
        rows,
        count,
        rights,
        isDeleteModalOpen,
        deleteHandler,
        handleChangePage,
        searchRoomHandler,
        changeStatusHandler,
        deleteBtnClickHandler,
        setIsDeleteModalOpen,
    }
};

export default useRoomHook;
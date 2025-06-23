import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { listPayload, rightsAccess, showToast } from "../../../utils/helper";
import { laundryItemAction } from "../../../redux/laundryItem";
import { getLaundryItemList, UpdateLaundryItem, deleteLaundryItem } from "../../../service/laundryItem";
import { startLoading, stopLoading } from "../../../redux/loader";

const useLaundryItem = () => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const laundryItemData = useSelector((state) => state.laundryItem.data);
    const loggedInUser = useSelector((state) => state.loggedInUser);
    const { accessModules } = loggedInUser;

    const [deleteId, setDeleteId] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // pagination start
    const [page, setPage] = useState(0);
    const [count, setCount] = useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const isAdmin = useMemo(() => {
        if (loggedInUser && loggedInUser.px_role && ['super admin', 'admin'].includes(loggedInUser.px_role.name.toLowerCase())) {
            return true;
        }
        return false;
    }, [loggedInUser]);

    const visibleRows = useMemo(() => {
        return laundryItemData;
    }, [laundryItemData]);

    const rights = useMemo(() => {
        return rightsAccess(accessModules, pathname);
    }, [accessModules, pathname]);

    const fetchLundryItemData = useCallback(async (searchValue = "") => {
        try {
            dispatch(startLoading());
            const body = listPayload(page, { searchText: searchValue });

            const response = await getLaundryItemList(body);

            if (response?.statusCode === 200) {
                const payload = response?.data?.rows;
                setCount(response?.data?.count);
                dispatch(laundryItemAction.storeLaundryItem(payload));
            } else if (response?.statusCode === 404) {
                const payload = [];
                dispatch(laundryItemAction.storeLaundryItem(payload));
            }
        } catch (error) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    }, [dispatch, page]);

    const deleteBtnClickHandler = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const deleteLaundryItemHandler = async () => {
        try {
            setIsDeleteModalOpen(false);
            dispatch(startLoading());
            const response = await deleteLaundryItem(deleteId);

            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                dispatch(laundryItemAction.removeLaundryItem({ id: deleteId }));
                setCount((prev) => prev - 1);
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

    const changeStatusHandler = async (e, id) => {
        try {
            const payload = {
                isActive: e.target.checked,
                updatedBy: loggedInUser.id,
            };
            const response = await UpdateLaundryItem(payload, id);

            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                const payload2 = { id, status: payload.isActive };
                dispatch(laundryItemAction.changeLaundryItemStatus(payload2));
            } else {
                showToast(response?.message, false);
            }
        } catch (error) {
            showToast(error?.message, false);
        }
    };

    const searchLaundryItemHandler = async (payload) => {
        try {
            fetchLundryItemData(payload.searchValue);
        } catch (error) {
            showToast(error?.message, false);
        }
    };

    useEffect(() => {
        fetchLundryItemData();
        // eslint-disable-next-line
    }, [fetchLundryItemData]);

    return {
        visibleRows,
        page,
        count,
        handleChangePage,
        isAdmin,
        rights,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        deleteBtnClickHandler,
        deleteLaundryItemHandler,
        changeStatusHandler,
        searchLaundryItemHandler,
    };
}

export default useLaundryItem;
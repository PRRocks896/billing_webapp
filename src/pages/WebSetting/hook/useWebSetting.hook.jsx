import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { listPayload, rightsAccess, showToast } from "../../../utils/helper";

import {
    updateWebSetting,
    deleteWebSetting,
    getWebSettingList
} from "../../../service/webSetting";
import { webSettingAction } from "../../../redux/webSetting";
import { startLoading, stopLoading } from "../../../redux/loader";

const useWebSettingHooks = () => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const webSettingData = useSelector((state) => state.webSetting.data);
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

    const rights = useMemo(() => {
        return rightsAccess(accessModules, pathname);
    }, [accessModules, pathname]);

    const visibleRows = useMemo(() => {
        return webSettingData;
    }, [webSettingData]);

    const fetchWebSettingData = useCallback(async (searchValue = '') => {
        try {
            dispatch(startLoading());
            const body = listPayload(page, { searchText: searchValue });
            const response = await getWebSettingList(body);
            if (response?.statusCode === 200) {
                const payload = response?.data?.rows;
                setCount(response?.data?.count);
                dispatch(webSettingAction.storeWebSetting(payload));
            } else if (response?.statusCode === 404) {
                const payload = [];
                dispatch(webSettingAction.storeWebSetting(payload));
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

    const deleteHandler = async () => {
        try {
            setIsDeleteModalOpen(false);
            dispatch(startLoading());
            const response = await deleteWebSetting(deleteId);

            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                dispatch(webSettingAction.removeWebSetting({ id: deleteId }));
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
            const response = await updateWebSetting(payload, id);

            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                const payload2 = { id, status: payload.isActive };
                dispatch(webSettingAction.changeWebSettingStatus(payload2));
            } else {
                showToast(response?.message, false);
            }
        } catch (error) {
            showToast(error?.message, false);
        }
    };

    const searchWebSettingHandler = (payload) => {
        try {
            fetchWebSettingData(payload.searchValue);
        } catch (error) {
            showToast(error.message, false);
        }
    };

    useEffect(() => {
        fetchWebSettingData()
    }, [fetchWebSettingData]);

    return {
        page,
        count,
        rights,
        visibleRows,
        isDeleteModalOpen,
        deleteHandler,
        handleChangePage,
        changeStatusHandler,
        setIsDeleteModalOpen,
        deleteBtnClickHandler,
        searchWebSettingHandler,
    }
}

export default useWebSettingHooks;
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { listPayload, rightsAccess, showToast } from "../../../utils/helper";

import {
    updateSeo,
    deleteSeo,
    getSeoList
} from "../../../service/seo";
import { seoAction } from "../../../redux/seo";
import { startLoading, stopLoading } from "../../../redux/loader";

const useSeoHook = () => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const seoData = useSelector((state) => state.seo.data);
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
        if (loggedInUser && loggedInUser.px_role && ['Admin', 'Super Admin'].includes(loggedInUser.px_role.name)) {
            return true;
        }
        return false;
    }, [loggedInUser]);

    const rights = useMemo(() => {
        return rightsAccess(accessModules, pathname);
    }, [accessModules, pathname]);

    const visibleRows = useMemo(() => {
        return seoData;
    }, [seoData]);

    const fetchSeoData = useCallback(async (searchValue = '') => {
        try {
            dispatch(startLoading());
            let payload = { searchText: searchValue };
            if (!isAdmin) {
                payload.createdBy = loggedInUser.id;
            }
            const body = listPayload(page, payload);
            const response = await getSeoList(body);
            if (response?.statusCode === 200) {
                const payload = response?.data?.rows;
                setCount(response?.data?.count);
                dispatch(seoAction.storeSeo(payload));
            } else if (response?.statusCode === 404) {
                const payload = [];
                dispatch(seoAction.storeSeo(payload));
            }
        } catch (error) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
        // eslint-disable-next-line
    }, [dispatch, page]);

    const deleteBtnClickHandler = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const deleteHandler = async () => {
        try {
            setIsDeleteModalOpen(false);
            dispatch(startLoading());
            const response = await deleteSeo(deleteId);

            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                dispatch(seoAction.removeSeo({ id: deleteId }));
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
            const response = await updateSeo(payload, id);

            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                const payload2 = { id, status: payload.isActive };
                dispatch(seoAction.changeSeoStatus(payload2));
            } else {
                showToast(response?.message, false);
            }
        } catch (error) {
            showToast(error?.message, false);
        }
    };

    const searchSeoHandler = (payload) => {
        try {
            fetchSeoData(payload.searchValue);
        } catch (error) {
            showToast(error.message, false);
        }
    };

    useEffect(() => {
        fetchSeoData()
    }, [fetchSeoData]);

    return {
        page,
        count,
        rights,
        isAdmin,
        visibleRows,
        isDeleteModalOpen,
        deleteHandler,
        handleChangePage,
        changeStatusHandler,
        setIsDeleteModalOpen,
        deleteBtnClickHandler,
        searchSeoHandler,
    }
}

export default useSeoHook;
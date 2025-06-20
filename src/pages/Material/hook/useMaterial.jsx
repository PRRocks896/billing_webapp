import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { listPayload, rightsAccess, showToast } from "../../../utils/helper";
import { materialActions } from "../../../redux/material";
import { getMaterialList, updateMaterial, deleteMaterial } from "../../../service/material";
import { startLoading, stopLoading } from "../../../redux/loader";

const useMaterial = () => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const materialData = useSelector((state) => state.material.data);
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
        return materialData;
    }, [materialData]);

    const rights = useMemo(() => {
        return rightsAccess(accessModules, pathname);
    }, [accessModules, pathname]);

    const fetchMaterialData = useCallback(async (searchValue = "") => {
        try {
            dispatch(startLoading());
            const body = listPayload(page, { searchText: searchValue });

            const response = await getMaterialList(body);

            if (response?.statusCode === 200) {
                const payload = response?.data?.rows;
                setCount(response?.data?.count);
                dispatch(materialActions.storeMaterial(payload));
            } else if (response?.statusCode === 404) {
                const payload = [];
                dispatch(materialActions.storeMaterial(payload));
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
            const response = await deleteMaterial(deleteId);

            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                dispatch(materialActions.removeMaterial({ id: deleteId }));
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
            const response = await updateMaterial(payload, id);

            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                const payload2 = { id, status: payload.isActive };
                dispatch(materialActions.changeMaterialStatus(payload2));
            } else {
                showToast(response?.message, false);
            }
        } catch (error) {
            showToast(error?.message, false);
        }
    };

    const searchMaterialHandler = async (payload) => {
        try {
            fetchMaterialData(payload.searchValue);
        } catch (error) {
            showToast(error?.message, false);
        }
    };

    useEffect(() => {
        fetchMaterialData();
        // eslint-disable-next-line
    }, [fetchMaterialData]);

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
        deleteHandler,
        changeStatusHandler,
        searchMaterialHandler,
    };
}

export default useMaterial;
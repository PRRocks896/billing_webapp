import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { getCompanyList, updateCompany, deleteCompany } from "../../../service/company";
import { listPayload, rightsAccess, showToast } from "../../../utils/helper";
import { startLoading, stopLoading } from "../../../redux/loader";

const useCompanyHook = () => {
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

    //  fetch company
    const fetchCompanyData = useCallback(async (searchValue = "") => {
        try {
            dispatch(startLoading());
            const body = listPayload(page, { searchText: searchValue });
            const response = await getCompanyList(body);
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
    }, [dispatch, page]);

    // search role
    const searchCompanyHandler = async (payload) => {
        try {
            fetchCompanyData(payload.searchValue);
        } catch (error) {
            showToast(error?.message, false);
        }
    };

    useEffect(() => {
        fetchCompanyData();
    }, [fetchCompanyData]);

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
            const response = await deleteCompany(deleteId);
            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                // dispatch(roleAction.removeRole({ id: deleteId }));
                setCount((prev) => prev - 1);
                fetchCompanyData();
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
            const response = await updateCompany(payload, id);

            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                fetchCompanyData();
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
        searchCompanyHandler,
        changeStatusHandler,
        deleteBtnClickHandler,
        setIsDeleteModalOpen,
    }
};

export default useCompanyHook;
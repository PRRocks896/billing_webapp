import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { listPayload, rightsAccess, showToast } from "../../../utils/helper";

import {
    updateEmployeeType,
    deleteEmployeeType,
    getEmployeeTypeList
} from "../../../service/employeeType";
import { employeeTypeAction } from "../../../redux/employeeType";
import { startLoading, stopLoading } from "../../../redux/loader";

const useEmployeeTypeHooks = () => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const employeeTypeData = useSelector((state) => state.employeeType.data);;
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
      return employeeTypeData;
    }, [employeeTypeData]);

    const fetchEmployeeTypeData = useCallback(async (searchValue = '') => {
      try {
        dispatch(startLoading());
        const body = listPayload(page, { searchText: searchValue });
        const response = await getEmployeeTypeList(body);
        if (response?.statusCode === 200) {
          const payload = response?.data?.rows;
          setCount(response?.data?.count);
          dispatch(employeeTypeAction.storeEmployeeType(payload));
        } else if (response?.statusCode === 404) {
          const payload = [];
          dispatch(employeeTypeAction.storeEmployeeType(payload));
        }
      } catch(error) {
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
        const response = await deleteEmployeeType(deleteId);

        if (response?.statusCode === 200) {
          showToast(response?.message, true);
          dispatch(employeeTypeAction.removeEmployeeType({ id: deleteId }));
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
          const response = await updateEmployeeType(payload, id);

          if (response?.statusCode === 200) {
            showToast(response?.message, true);
            const payload2 = { id, status: payload.isActive };
            dispatch(employeeTypeAction.changeEmployeeTypeStatus(payload2));
          } else {
            showToast(response?.message, false);
          }
        } catch (error) {
          showToast(error?.message, false);
        }
    };

    const searchEmployeeTypeHandler = (payload) => {
      try {
        fetchEmployeeTypeData(payload.searchValue);
      } catch (error) {
        showToast(error.message, false);
      }
    };

    useEffect(() => {
        fetchEmployeeTypeData()
    }, [fetchEmployeeTypeData]);

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
        searchEmployeeTypeHandler,
    }
}

export default useEmployeeTypeHooks;
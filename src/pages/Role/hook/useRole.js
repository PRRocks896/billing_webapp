import { useCallback, useEffect, useMemo, useState } from "react";
import { listPayload, rightsAccess, showToast } from "../../../utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { getRoleList, updateRole, deleteRole } from "../../../service/role";
import { roleAction } from "../../../redux/role";
import { useLocation } from "react-router";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useRole = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const roleData = useSelector((state) => state.role.data);
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

  const visibleRows = useMemo(() => {
    return roleData;
  }, [roleData]);

  // pagination end

  const rights = useMemo(() => {
    return rightsAccess(accessModules, pathname);
  }, [accessModules, pathname]);

  //  fetch role
  const fetchRoleData = useCallback(
    async (searchValue = "") => {
      try {
        dispatch(startLoading());
        const body = listPayload(page, { searchText: searchValue });

        const response = await getRoleList(body);
        if (response?.statusCode === 200) {
          const payload = response?.data?.rows;
          setCount(response?.data?.count);
          dispatch(roleAction.storeRole(payload));
        } else if (response?.statusCode === 404) {
          const payload = [];
          dispatch(roleAction.storeRole(payload));
        }
      } catch (error) {
        showToast(error?.message, false);
      } finally {
        dispatch(stopLoading());
      }
    },
    [dispatch, page]
  );

  // search role
  const searchRoleHandler = async (payload) => {
    try {
      fetchRoleData(payload.searchValue);
    } catch (error) {
      showToast(error?.message, false);
    }
  };

  useEffect(() => {
    fetchRoleData();
  }, [fetchRoleData]);

  // delete role click handler
  const deleteBtnClickHandler = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  // delete role
  const deleteHandler = async () => {
    try {
      setIsDeleteModalOpen(false);
      dispatch(startLoading());
      const response = await deleteRole(deleteId);
      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        dispatch(roleAction.removeRole({ id: deleteId }));
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

  // change status handler
  const changeStatusHandler = async (e, id) => {
    try {
      const payload = {
        isActive: e.target.checked,
        updatedBy: loggedInUser.id,
      };
      const response = await updateRole(payload, id);

      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        const payload2 = { id, status: payload.isActive };
        dispatch(roleAction.changeRoleStatus(payload2));
      } else {
        showToast(response?.message, false);
      }
    } catch (error) {
      showToast(error?.message, false);
    }
  };

  return {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteHandler,
    deleteBtnClickHandler,
    searchRoleHandler,
    changeStatusHandler,
    page,
    handleChangePage,
    visibleRows,
    count,
    rights,
  };
};

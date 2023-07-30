import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { listPayload, rightsAccess, showToast } from "../../../utils/helper";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteModule,
  getModuleList,
  updateModule,
} from "../../../service/module";
import { moduleAction } from "../../../redux/module";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useModule = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const moduleData = useSelector((state) => state.module.data);
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
    return moduleData;
  }, [moduleData]);

  // pagination end

  //  fetch payment type
  const fetchModuleData = useCallback(
    async (searchValue = "") => {
      try {
        dispatch(startLoading());
        const body = listPayload(page, { searchText: searchValue });

        const response = await getModuleList(body);
        if (response.statusCode === 200) {
          const payload = response.data.rows;
          setCount(response.data.count);
          dispatch(moduleAction.storeModule(payload));
        } else if (response.statusCode === 404) {
          const payload = [];
          dispatch(moduleAction.storeModule(payload));
        }
      } catch (error) {
        showToast(error.message, false);
      } finally {
        dispatch(stopLoading());
      }
    },
    [dispatch, page]
  );

  // search payment type
  const searchModuleHandler = async (payload) => {
    try {
      fetchModuleData(payload.searchValue);
    } catch (error) {
      showToast(error.message, false);
    }
  };

  useEffect(() => {
    fetchModuleData();
  }, [fetchModuleData]);

  // delete payment type click handler
  const deleteBtnClickHandler = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  // delete payment type
  const deleteHandler = async () => {
    try {
      setIsDeleteModalOpen(false);
      dispatch(startLoading());
      const response = await deleteModule(deleteId);

      if (response.statusCode === 200) {
        showToast(response.message, true);
        dispatch(moduleAction.removeModule({ id: deleteId }));
        setCount((prev) => prev - 1);
      } else {
        showToast(response.messageCode, false);
      }
    } catch (error) {
      showToast(error.message, false);
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
      const response = await updateModule(payload, id);

      if (response.statusCode === 200) {
        showToast(response.message, true);
        const payload2 = { id, status: payload.isActive };
        dispatch(moduleAction.changeModuleStatus(payload2));
      } else {
        showToast(response.message, false);
      }
    } catch (error) {
      showToast(error.message, false);
    }
  };

  return {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteHandler,
    deleteBtnClickHandler,
    searchModuleHandler,
    changeStatusHandler,
    page,
    handleChangePage,
    visibleRows,
    count,
    rights,
  };
};

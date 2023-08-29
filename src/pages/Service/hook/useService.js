import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteService,
  getServiceList,
  updateService,
} from "../../../service/service";
import { listPayload, rightsAccess, showToast } from "../../../utils/helper";
import { serviceAction } from "../../../redux/service";
import { useLocation } from "react-router";
import { startLoading, stopLoading } from "../../../redux/loader";
import { Stores, deleteData } from "../../../utils/db";

export const useService = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const service = useSelector((state) => state.service.data);
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const { accessModules } = loggedInUser;

  const [deleteId, setDeleteId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // pagination code start
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const visibleRows = useMemo(() => {
    return service;
  }, [service]);

  // pagination code end

  const rights = useMemo(() => {
    return rightsAccess(accessModules, pathname);
  }, [accessModules, pathname]);

  //  fetch service logic
  const fetchServiceData = useCallback(
    async (searchValue = "") => {
      try {
        dispatch(startLoading());
        const body = listPayload(page, { searchText: searchValue });

        const response = await getServiceList(body);

        if (response?.statusCode === 200) {
          const payload = response?.data?.rows;
          setCount(response?.data?.count);

          dispatch(serviceAction.storeServices(payload));
        } else if (response?.statusCode === 404) {
          const payload = [];
          dispatch(serviceAction.storeServices(payload));
        }
      } catch (error) {
        showToast(error?.message, false);
      } finally {
        dispatch(stopLoading());
      }
    },
    [dispatch, page]
  );

  useEffect(() => {
    fetchServiceData();
  }, [fetchServiceData]);

  // search service handler
  const searchServiceHandler = async (payload) => {
    try {
      fetchServiceData(payload.searchValue);
    } catch (error) {
      showToast(error?.message, false);
    }
  };

  // delete btn click handler
  const deleteBtnClickHandler = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  // delete service handler
  const deleteHandler = async () => {
    try {
      setIsDeleteModalOpen(false);
      dispatch(startLoading());
      const response = await deleteService(deleteId);

      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        await deleteData(Stores.Service, +deleteId);
        dispatch(serviceAction.removeService({ id: deleteId }));
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

  // change service status handler
  const changeStatusHandler = async (e, id) => {
    try {
      const payload = {
        isActive: e.target.checked,
        updatedBy: loggedInUser.id,
      };
      const response = await updateService(payload, id);

      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        const payload2 = { id, status: payload.isActive };
        dispatch(serviceAction.changeServiceStatus(payload2));
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
    searchServiceHandler,
    changeStatusHandler,
    page,
    handleChangePage,
    visibleRows,
    count,
    rights,
  };
};

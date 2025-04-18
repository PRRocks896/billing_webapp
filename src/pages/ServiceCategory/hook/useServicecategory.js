import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serviceCategoryAction } from "../../../redux/serviceCategory";
import { listPayload, rightsAccess, showToast } from "../../../utils/helper";
import {
  deleteServiceCategory,
  getServiceCategoryList,
  updateServiceCategory,
} from "../../../service/serviceCategory";
import { useLocation } from "react-router";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useServiceCategory = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const serviceCategories = useSelector((state) => state.serviceCategory.data);
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
    return serviceCategories;
  }, [serviceCategories]);

  // pagination code end

  const rights = useMemo(() => {
    return rightsAccess(accessModules, pathname);
  }, [accessModules, pathname]);

  //  fetch service category logic
  const fetchServiceCategoryData = useCallback(
    async (searchValue = "") => {
      try {
        dispatch(startLoading());
        const body = listPayload(page, { searchText: searchValue });

        const response = await getServiceCategoryList(body);

        if (response?.statusCode === 200) {
          const payload = response?.data?.rows;
          setCount(response?.data?.count);
          dispatch(serviceCategoryAction.storeServiceCategories(payload));
        } else if (response?.statusCode === 404) {
          const payload = [];
          dispatch(serviceCategoryAction.storeServiceCategories(payload));
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
    fetchServiceCategoryData();
  }, [fetchServiceCategoryData]);

  // search service category handler
  const searchServiceCategoryHandler = async (payload) => {
    try {
      fetchServiceCategoryData(payload.searchValue);
    } catch (error) {
      showToast(error?.message, false);
    }
  };

  // delete btn click handler
  const deleteBtnClickHandler = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  // delete service category handler
  const deleteHandler = async () => {
    try {
      setIsDeleteModalOpen(false);
      dispatch(startLoading());
      const response = await deleteServiceCategory(deleteId);
      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        dispatch(serviceCategoryAction.removeServiceCategory({ id: deleteId }));
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

  // change service category status handler
  const changeStatusHandler = async (e, id) => {
    try {
      const payload = {
        isActive: e.target.checked,
        updatedBy: loggedInUser.id,
      };
      const response = await updateServiceCategory(payload, id);

      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        const payload2 = { id, status: payload.isActive };
        dispatch(serviceCategoryAction.changeServiceCategoryStatus(payload2));
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
    searchServiceCategoryHandler,
    changeStatusHandler,
    page,
    handleChangePage,
    visibleRows,
    count,
    rights,
  };
};

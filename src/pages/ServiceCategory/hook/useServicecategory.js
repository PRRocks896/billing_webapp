import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serviceCategoryAction } from "../../../redux/serviceCategory";
import { showToast } from "../../../utils/helper";
import {
  deleteServiceCategory,
  getServiceCategoryList,
} from "../../../service/serviceCategory";
import useLoader from "../../../hook/useLoader";

export const useServiceCategory = () => {
  const dispatch = useDispatch();
  const { loading } = useLoader();

  const serviceCategories = useSelector((state) => state.serviceCategory.data);

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

  //  fetch staff logic
  const fetchServiceCategoryData = useCallback(
    async (searchValue = "") => {
      try {
        loading(true);
        const body = {
          where: {
            // isActive: true,
            isDeleted: false,
            searchText: searchValue,
          },
          pagination: {
            sortBy: "createdAt",
            descending: true,
            rows: 10,
            page: page + 1,
          },
        };
        const response = await getServiceCategoryList(body);

        if (response.statusCode === 200) {
          const payload = response.data.rows;
          setCount(response.data.count);
          dispatch(serviceCategoryAction.storeServiceCategories(payload));
        } else if (response.statusCode === 404) {
          const payload = [];
          dispatch(serviceCategoryAction.storeServiceCategories(payload));
        }
      } catch (error) {
        showToast(error.message, false);
      } finally {
        loading(false);
      }
    },
    [dispatch, page]
  );

  useEffect(() => {
    fetchServiceCategoryData();
  }, [fetchServiceCategoryData]);

  const searchServiceCategoryHandler = async (payload) => {
    try {
      fetchServiceCategoryData(payload.searchValue);
    } catch (error) {
      showToast(error.message, false);
    }
  };

  const deleteBtnClickHandler = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const deleteHandler = async () => {
    try {
      setIsDeleteModalOpen(false);
      loading(true);
      const response = await deleteServiceCategory(deleteId);
      if (response.statusCode === 200) {
        showToast(response.message, true);
        dispatch(serviceCategoryAction.removeServiceCategory({ id: deleteId }));
        setCount((prev) => prev - 1);
      } else {
        showToast(response.messageCode, false);
      }
    } catch (error) {
      showToast(error.message, false);
    } finally {
      setIsDeleteModalOpen(false);
      loading(false);
    }
  };

  return {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteHandler,
    deleteBtnClickHandler,
    searchServiceCategoryHandler,
    page,
    handleChangePage,
    visibleRows,
    count,
  };
};

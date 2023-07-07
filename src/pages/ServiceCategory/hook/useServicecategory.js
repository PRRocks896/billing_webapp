import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { serviceCategoryAction } from "../../../redux/serviceCategory";
import { showToast } from "../../../utils/helper";
import {
  deleteServiceCategory,
  getServiceCategoryList,
} from "../../../service/serviceCategory";

export const useServiceCategory = () => {
  const dispatch = useDispatch();

  const [deleteId, setDeleteId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // const deleteModalOpen = () => setIsDeleteModalOpen(true);
  // const deleteModalClose = () => setIsDeleteModalOpen(false);

  //  fetch staff logic
  const fetchServiceCategoryData = useCallback(
    async (searchValue = "") => {
      try {
        const body = {
          where: {
            // isActive: true,
            isDeleted: false,
            searchText: searchValue,
          },
          pagination: {
            sortBy: "createdAt",
            descending: true,
            rows: 5,
            page: 1,
          },
        };
        const response = await getServiceCategoryList(body);

        if (response.statusCode === 200) {
          const payload = response.data.rows;
          dispatch(serviceCategoryAction.storeServiceCategories(payload));
        } else if (response.statusCode === 404) {
          const payload = [];
          dispatch(serviceCategoryAction.storeServiceCategories(payload));
        }
      } catch (error) {
        showToast(error.message, false);
      }
    },
    [dispatch]
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
    // deleteModalOpen();
    setIsDeleteModalOpen(true);
  };

  const deleteHandler = async () => {
    try {
      const response = await deleteServiceCategory(deleteId);
      if (response.statusCode === 200) {
        showToast(response.message, true);
        dispatch(serviceCategoryAction.removeServiceCategory({ id: deleteId }));
        // deleteModalClose();
      } else {
        showToast(response.messageCode, false);
      }
    } catch (error) {
      showToast(error.message, false);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteHandler,
    deleteBtnClickHandler,
    searchServiceCategoryHandler,
  };
};

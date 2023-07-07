import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteService, getServiceList } from "../../../service/service";
import { showToast } from "../../../utils/helper";
import { serviceAction } from "../../../redux/service";

export const useService = () => {
  const dispatch = useDispatch();

  const [deleteId, setDeleteId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // const deleteModalOpen = () => setIsDeleteModalOpen(true);
  // const deleteModalClose = () => setIsDeleteModalOpen(false);

  //  fetch staff logic
  const fetchServiceData = useCallback(
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
        const response = await getServiceList(body);

        if (response.statusCode === 200) {
          const payload = response.data.rows;
          dispatch(serviceAction.storeServices(payload));
        } else if (response.statusCode === 404) {
          const payload = [];
          dispatch(serviceAction.storeServices(payload));
        }
      } catch (error) {
        showToast(error.message, false);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    fetchServiceData();
  }, [fetchServiceData]);

  const searchServiceHandler = async (payload) => {
    try {
      fetchServiceData(payload.searchValue);
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
      const response = await deleteService(deleteId);
      if (response.statusCode === 200) {
        showToast(response.message, true);
        dispatch(serviceAction.removeService({ id: deleteId }));
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
    searchServiceHandler,
  };
};

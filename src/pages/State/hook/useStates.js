import { useCallback, useEffect, useState } from "react";
import { showToast } from "../../../utils/helper";
import { statesAction } from "../../../redux/states";
import { useDispatch } from "react-redux";
import { getStatesList, deleteState } from "../../../service/states";

export const useStates = () => {
  const dispatch = useDispatch();

  const [deleteId, setDeleteId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const deleteModalOpen = () => setIsDeleteModalOpen(true);
  const deleteModalClose = () => setIsDeleteModalOpen(false);

  //  fetch states logic
  const fetchStatesData = useCallback(
    async (searchValue = "") => {
      try {
        const body = {
          where: {
            isActive: true,
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
        const response = await getStatesList(body);

        if (response.statusCode === 200) {
          const payload = response.data.rows;
          dispatch(statesAction.storeStates(payload));
        } else if (response.statusCode === 404) {
          const payload = [];
          dispatch(statesAction.storeStates(payload));
        }
      } catch (error) {
        showToast(error.message, false);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    fetchStatesData();
  }, [fetchStatesData]);

  const searchStatesandler = async (payload) => {
    try {
      fetchStatesData(payload.searchValue);
    } catch (error) {
      console.log(error);
      showToast(error.message, false);
    }
  };

  const deleteBtnClickHandler = (id) => {
    setDeleteId(id);
    deleteModalOpen();
  };

  const deleteHandler = async () => {
    try {
      console.log(deleteId);
      const response = await deleteState(deleteId);
      if (response.statusCode === 200) {
        showToast(response.message, true);
        dispatch(statesAction.removeStates({ id: deleteId }));
        deleteModalClose();
      } else {
        showToast(response.messageCode, false);
      }
    } catch (error) {
      console.log(error);
      showToast(error.message, false);
    }
  };

  return {
    isDeleteModalOpen,
    deleteModalClose,
    deleteHandler,
    deleteBtnClickHandler,
    searchStatesandler,
  };
};

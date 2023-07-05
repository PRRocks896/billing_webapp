import { useCallback, useEffect, useState } from "react";
import { showToast } from "../../../utils/helper";
import { statesAction } from "../../../redux/states";
import { useDispatch } from "react-redux";
import {
  getStatesList,
  searchStates,
  deleteState,
} from "../../../service/states";

export const useStates = () => {
  const dispatch = useDispatch();

  const [deleteId, setDeleteId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const deleteModalOpen = () => setIsDeleteModalOpen(true);
  const deleteModalClose = () => setIsDeleteModalOpen(false);
  const deleteHandler = (id) => {
    deleteModalOpen();
    setDeleteId(id);
  };

  //  fetch states logic
  const fetchStatesData = useCallback(async () => {
    try {
      const body = {
        where: {
          isActive: true,
          isDeleted: false,
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
      }
    } catch (error) {
      showToast(error.message, false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchStatesData();
  }, [fetchStatesData]);

  const searchStatesandler = async (payload) => {
    try {
      if (payload.searchValue === "") {
        fetchStatesData();
      } else {
        const body = { name: payload.searchValue };
        console.log(body);
        const response = await searchStates(body);
        if (response.statusCode === 200) {
          const payload = response.data;
          dispatch(statesAction.storeStates([payload]));
        } else if (response.statusCode === 404) {
          const payload = [];
          dispatch(statesAction.storeStates(payload));
        }
      }
    } catch (error) {
      console.log(error);
      showToast(error.message, false);
    }
  };

  return {
    isDeleteModalOpen,
    deleteHandler,
    deleteModalClose,
    deleteId,
    deleteState,
    searchStatesandler,
  };
};

import { useCallback, useEffect, useState } from "react";
import { showToast } from "../../../utils/helper";
import { getStatesList } from "../../../service/states";
import { statesAction } from "../../../redux/states";
import { useDispatch } from "react-redux";

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

  //  fetch staff logic
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

  return { isDeleteModalOpen, deleteHandler, deleteModalClose, deleteId };
};

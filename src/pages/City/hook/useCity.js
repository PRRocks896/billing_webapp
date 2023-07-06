import { useCallback, useEffect, useState } from "react";
import { showToast } from "../../../utils/helper";
import { deleteCity, getCityList } from "../../../service/city";
import { cityAction } from "../../../redux/city";
import { useDispatch } from "react-redux";

export const useCity = () => {
  const dispatch = useDispatch();

  const [deleteId, setDeleteId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const deleteModalOpen = () => setIsDeleteModalOpen(true);
  const deleteModalClose = () => setIsDeleteModalOpen(false);

  //  fetch city logic
  const fetchCityData = useCallback(
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
        const response = await getCityList(body);
        if (response.statusCode === 200) {
          const payload = response.data.rows;
          dispatch(cityAction.storeCity(payload));
        } else if (response.statusCode === 404) {
          const payload = [];
          dispatch(cityAction.storeCity(payload));
        }
      } catch (error) {
        showToast(error.message, false);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    fetchCityData();
  }, [fetchCityData]);

  const searchCityHandler = async (payload) => {
    try {
      fetchCityData(payload.searchValue);
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
      const response = await deleteCity(deleteId);
      if (response.statusCode === 200) {
        showToast(response.message, true);
        dispatch(cityAction.removeCity({ id: deleteId }));
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
    searchCityHandler,
  };
};

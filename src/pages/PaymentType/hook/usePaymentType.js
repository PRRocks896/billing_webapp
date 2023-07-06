import { useCallback, useEffect, useState } from "react";
import { showToast } from "../../../utils/helper";
import { getPaymentTypeList } from "../../../service/paymentType";
import { paymentTypeAction } from "../../../redux/paymentType";
import { useDispatch } from "react-redux";
import { deletePaymentType } from "../../../service/paymentType";

export const usePaymentType = () => {
  const dispatch = useDispatch();

  const [deleteId, setDeleteId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const deleteModalOpen = () => setIsDeleteModalOpen(true);
  const deleteModalClose = () => setIsDeleteModalOpen(false);

  //  fetch payment type logic
  const fetchPaymentTypeData = useCallback(
    async (searchValue = "") => {
      try {
        console.log("fetchPaymentTypeData");
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
        const response = await getPaymentTypeList(body);
        console.log("payment type data", response.data);
        if (response.statusCode === 200) {
          const payload = response.data.rows;
          dispatch(paymentTypeAction.storePaymentType(payload));
        } else if (response.statusCode === 404) {
          const payload = [];
          dispatch(paymentTypeAction.storePaymentType(payload));
        }
      } catch (error) {
        showToast(error.message, false);
      }
    },
    [dispatch]
  );

  const searchPaymentTypeHandler = async (payload) => {
    try {
      fetchPaymentTypeData(payload.searchValue);
    } catch (error) {
      console.log(error);
      showToast(error.message, false);
    }
  };

  useEffect(() => {
    fetchPaymentTypeData();
  }, [fetchPaymentTypeData]);

  const deleteBtnClickHandler = (id) => {
    setDeleteId(id);
    deleteModalOpen();
  };

  const deleteHandler = async () => {
    try {
      console.log(deleteId);
      const response = await deletePaymentType(deleteId);
      if (response.statusCode === 200) {
        showToast(response.message, true);
        dispatch(paymentTypeAction.removePaymentType({ id: deleteId }));
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
    searchPaymentTypeHandler,
  };
};

import { useCallback, useEffect, useState } from "react";
import { showToast } from "../../../utils/helper";
import {
  getPaymentTypeList,
  searchPaymentType,
} from "../../../service/paymentType";
import { paymentTypeAction } from "../../../redux/paymentType";
import { useDispatch } from "react-redux";
import { deletePaymentType } from "../../../service/paymentType";

export const usePaymentType = () => {
  const dispatch = useDispatch();

  const [deleteId, setDeleteId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const deleteModalOpen = () => setIsDeleteModalOpen(true);
  const deleteModalClose = () => setIsDeleteModalOpen(false);
  const deleteHandler = (id) => {
    deleteModalOpen();
    setDeleteId(id);
  };

  //  fetch payment type logic
  const fetchPaymentTypeData = useCallback(async () => {
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
      const response = await getPaymentTypeList(body);

      if (response.statusCode === 200) {
        const payload = response.data.rows;
        dispatch(paymentTypeAction.storePaymentType(payload));
      }
    } catch (error) {
      showToast(error.message, false);
    }
  }, [dispatch]);

  const searchPaymentTypeHandler = async (payload) => {
    try {
      if (payload.searchValue === "") {
        fetchPaymentTypeData();
      } else {
        const body = { name: payload.searchValue };
        console.log(body);
        const response = await searchPaymentType(body);
        if (response.statusCode === 200) {
          const payload = response.data;
          dispatch(paymentTypeAction.storePaymentType([payload]));
        } else if (response.statusCode === 404) {
          const payload = [];
          dispatch(paymentTypeAction.storePaymentType(payload));
        }
      }
    } catch (error) {
      console.log(error);
      showToast(error.message, false);
    }
  };

  useEffect(() => {
    fetchPaymentTypeData();
  }, [fetchPaymentTypeData]);

  return {
    isDeleteModalOpen,
    deleteHandler,
    deleteModalClose,
    deleteId,
    deletePaymentType,
    searchPaymentTypeHandler,
  };
};

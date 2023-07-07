import { useCallback, useEffect, useMemo, useState } from "react";
import { showToast } from "../../../utils/helper";
import { getPaymentTypeList } from "../../../service/paymentType";
import { paymentTypeAction } from "../../../redux/paymentType";
import { useDispatch, useSelector } from "react-redux";
import { deletePaymentType } from "../../../service/paymentType";

export const usePaymentType = () => {
  const dispatch = useDispatch();
  const paymentTypeData = useSelector((state) => state.paymentType.data);

  const [deleteId, setDeleteId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const visibleRows = useMemo(() => {
    return paymentTypeData;
  }, [paymentTypeData]);

  //  fetch payment type logic
  const fetchPaymentTypeData = useCallback(
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
            rows: 10,
            page: page + 1,
          },
        };
        const response = await getPaymentTypeList(body);
        if (response.statusCode === 200) {
          const payload = response.data.rows;
          setCount(response.data.count);
          dispatch(paymentTypeAction.storePaymentType(payload));
        } else if (response.statusCode === 404) {
          const payload = [];
          dispatch(paymentTypeAction.storePaymentType(payload));
        }
      } catch (error) {
        showToast(error.message, false);
      }
    },
    [dispatch, page]
  );

  const searchPaymentTypeHandler = async (payload) => {
    try {
      fetchPaymentTypeData(payload.searchValue);
    } catch (error) {
      showToast(error.message, false);
    }
  };

  useEffect(() => {
    fetchPaymentTypeData();
  }, [fetchPaymentTypeData]);

  const deleteBtnClickHandler = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const deleteHandler = async () => {
    try {
      const response = await deletePaymentType(deleteId);
      if (response.statusCode === 200) {
        showToast(response.message, true);
        dispatch(paymentTypeAction.removePaymentType({ id: deleteId }));
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
    searchPaymentTypeHandler,
    page,
    handleChangePage,
    visibleRows,
    count,
  };
};

import { useCallback, useEffect, useMemo, useState } from "react";
import { showToast } from "../../../utils/helper";
import {
  getPaymentTypeList,
  updatePaymentType,
} from "../../../service/paymentType";
import { paymentTypeAction } from "../../../redux/paymentType";
import { useDispatch, useSelector } from "react-redux";
import { deletePaymentType } from "../../../service/paymentType";
import { useLocation } from "react-router";
import { startLoading, stopLoading } from "../../../redux/loader";

export const usePaymentType = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const paymentTypeData = useSelector((state) => state.paymentType.data);
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const { accessModules } = loggedInUser;

  const [deleteId, setDeleteId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // pagination start
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const visibleRows = useMemo(() => {
    return paymentTypeData;
  }, [paymentTypeData]);

  // pagination end

  const rights = useMemo(() => {
    if (accessModules && accessModules.length > 0) {
      const selectedModule = accessModules.find(
        (res) => res.px_module.path === pathname
      );
      return {
        add: selectedModule.add || false,
        edit: selectedModule.edit || false,
        delete: selectedModule.delete || false,
      };
    } else {
      return {
        add: false,
        edit: false,
        delete: false,
      };
    }
  }, [accessModules, pathname]);

  //  fetch payment type
  const fetchPaymentTypeData = useCallback(
    async (searchValue = "") => {
      try {
        dispatch(startLoading());
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
      } finally {
        dispatch(stopLoading());
      }
    },
    [dispatch, page]
  );

  // search payment type
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

  // delete payment type click handler
  const deleteBtnClickHandler = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  // delete payment type
  const deleteHandler = async () => {
    try {
      setIsDeleteModalOpen(false);
      dispatch(startLoading());
      const response = await deletePaymentType(deleteId);
      if (response.statusCode === 200) {
        showToast(response.message, true);
        dispatch(paymentTypeAction.removePaymentType({ id: deleteId }));
        setCount((prev) => prev - 1);
      } else {
        showToast(response.messageCode, false);
      }
    } catch (error) {
      showToast(error.message, false);
    } finally {
      setIsDeleteModalOpen(false);
      dispatch(stopLoading());
    }
  };

  // change status handler
  const changeStatusHandler = async (e, id) => {
    try {
      const payload = {
        isActive: e.target.checked,
        updatedBy: loggedInUser.id,
      };
      const response = await updatePaymentType(payload, id);

      if (response.statusCode === 200) {
        showToast(response.message, true);
        const payload2 = { id, status: payload.isActive };
        dispatch(paymentTypeAction.changePaymentTypeStatus(payload2));
      } else {
        showToast(response.message, false);
      }
    } catch (error) {
      showToast(error.message, false);
    }
  };

  return {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteHandler,
    deleteBtnClickHandler,
    searchPaymentTypeHandler,
    changeStatusHandler,
    page,
    handleChangePage,
    visibleRows,
    count,
    rights,
  };
};

import { useCallback, useEffect, useMemo, useState } from "react";
import { showToast } from "../../../utils/helper";
import {
  getPaymentTypeList,
  updatePaymentType,
} from "../../../service/paymentType";
import { billAction } from "../../../redux/bill";
import { useDispatch, useSelector } from "react-redux";
import useLoader from "../../../hook/useLoader";
import { useLocation } from "react-router";
import { deleteBill, getBillList } from "../../../service/bill";

export const useBill = () => {
  const dispatch = useDispatch();
  const { loading } = useLoader();
  const { pathname } = useLocation();
  const billData = useSelector((state) => state.bill.data);
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
    return billData;
  }, [billData]);

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

  //  fetch bill
  const fetchBillData = useCallback(
    async (searchValue = "") => {
      try {
        loading(true);
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

        const response = await getBillList(body);

        if (response.statusCode === 200) {
          const payload = response.data.rows;
          setCount(response.data.count);
          dispatch(billAction.storeBill(payload));
        } else if (response.statusCode === 404) {
          const payload = [];
          dispatch(billAction.storeBill(payload));
        }
      } catch (error) {
        showToast(error.message, false);
      } finally {
        loading(false);
      }
    },
    [dispatch, page]
  );

  // search bill
  const searchBillHandler = async (payload) => {
    try {
      fetchBillData(payload.searchValue);
    } catch (error) {
      showToast(error.message, false);
    }
  };

  useEffect(() => {
    fetchBillData();
  }, [fetchBillData]);

  // delete payment type click handler
  const deleteBtnClickHandler = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  // delete bill
  const deleteHandler = async () => {
    try {
      setIsDeleteModalOpen(false);
      loading(true);
      const response = await deleteBill(deleteId);
      if (response.statusCode === 200) {
        showToast(response.message, true);
        dispatch(billAction.removeBill({ id: deleteId }));
        setCount((prev) => prev - 1);
      } else {
        showToast(response.messageCode, false);
      }
    } catch (error) {
      showToast(error.message, false);
    } finally {
      setIsDeleteModalOpen(false);
      loading(false);
    }
  };

  return {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteHandler,
    deleteBtnClickHandler,
    searchBillHandler,
    page,
    handleChangePage,
    visibleRows,
    count,
    rights,
  };
};

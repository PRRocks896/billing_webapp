import { useCallback, useEffect, useMemo, useState } from "react";
import { listPayload, rightsAccess, showToast } from "../../../utils/helper";
import { billAction } from "../../../redux/bill";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { deleteBill, getBillList } from "../../../service/bill";
import { startLoading, stopLoading } from "../../../redux/loader";
import { Stores, deleteData, getStoreDataPagination } from "../../../utils/db";

export const useBill = () => {
  window.localStorage.removeItem("billNo");
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const billData = useSelector((state) => state.bill.data);
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const userRole = loggedInUser?.px_role?.name?.toLowerCase();
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
    return rightsAccess(accessModules, pathname);
  }, [accessModules, pathname]);

  //  fetch bill
  const fetchBillData = useCallback(
    async (searchValue = "") => {
      try {
        dispatch(startLoading());

        const localBillData = await getStoreDataPagination(
          Stores.Bills,
          page,
          10,
          searchValue
        ); //getStoreData(Stores.Bills, searchValue);
        let descendingLocalBillData = [];

        if (localBillData.statusCode === 200) {
          descendingLocalBillData = localBillData.data
            .slice()
            .sort((a, b) => b.id.localeCompare(a.id));
        }
        let whereCondition = {
          isDeleted: false,
          searchText: searchValue,
        };
        if (userRole !== "admin") {
          whereCondition = {
            ...whereCondition,
            userID: loggedInUser.id,
          };
        }

        const body = listPayload(
          page,
          whereCondition,
          10 - localBillData.count,
          { sortBy: "billNo" }
        );

        const response = await getBillList(body);

        if (response?.statusCode === 200) {
          const finalPayload = [
            ...descendingLocalBillData,
            ...response?.data?.rows,
          ];

          setCount(response.data.count + localBillData.count);
          dispatch(billAction.storeBill(finalPayload));
        }
        // else if (response?.statusCode === 404) {
        else {
          const payload = [...descendingLocalBillData];
          setCount(payload?.length);
          dispatch(billAction.storeBill(payload));
        }
      } catch (error) {
        showToast(error?.message, false);
      } finally {
        dispatch(stopLoading());
      }
    },
    [dispatch, page, userRole, loggedInUser.id]
  );

  // search bill
  const searchBillHandler = async (payload) => {
    try {
      fetchBillData(payload.searchValue);
    } catch (error) {
      showToast(error?.message, false);
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
      dispatch(startLoading());
      let response;
      if (typeof deleteId === "string") {
        response = await deleteData(Stores.Bills, deleteId);
      } else {
        response = await deleteBill(deleteId);
      }

      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        dispatch(billAction.removeBill({ id: deleteId }));
        setCount((prev) => prev - 1);
      } else {
        showToast(response?.messageCode, false);
      }
    } catch (error) {
      showToast(error?.message, false);
    } finally {
      setIsDeleteModalOpen(false);
      dispatch(stopLoading());
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

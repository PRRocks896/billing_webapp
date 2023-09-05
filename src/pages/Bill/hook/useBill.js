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
  // eslint-disable-next-line
  const billData = useSelector((state) => state.bill.data);
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const userRole = loggedInUser?.px_role?.name?.toLowerCase();
  const { accessModules } = loggedInUser;

  const [deleteId, setDeleteId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // const [localBillList, setLocalBillList] = useState([]);
  const [combinedData, setCombinedData] = useState([]);

  // pagination start
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);

  const visibleRows = useMemo(() => {
    return combinedData; //billData;
  }, [/*billData*/combinedData]);

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
          rowsPerPage,
          searchValue
        );
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
          rowsPerPage,
          { sortBy: "billNo" }
        );

        const response = await getBillList(body);

        if (response?.statusCode === 200) {
          const finalPayload = [
            ...descendingLocalBillData,
            ...response?.data?.rows,
          ];
          setCombinedData(finalPayload);
          setCount(response.data.count + localBillData.count);
          dispatch(billAction.storeBill(finalPayload));
        }
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
    [dispatch, page, userRole, loggedInUser.id, rowsPerPage]
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    console.log(event.target.value);
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteHandler,
    deleteBtnClickHandler,
    searchBillHandler,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    visibleRows,
    count,
    rights,
  };
};

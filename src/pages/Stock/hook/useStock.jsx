import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { listPayload, rightsAccess, showToast } from "../../../utils/helper";
import { stockAction } from "../../../redux/stock";
import { deleteStock, getStockList, updateStock } from "../../../service/stock";
import { startLoading, stopLoading } from "../../../redux/loader";

const useStock = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const stockData = useSelector((state) => state.stock.data);
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

  const isAdmin = useMemo(() => {
    if (
      loggedInUser &&
      loggedInUser.px_role &&
      ["super admin", "admin"].includes(loggedInUser.px_role.name.toLowerCase())
    ) {
      return true;
    }
    return false;
  }, [loggedInUser]);

  const visibleRows = useMemo(() => {
    return stockData;
  }, [stockData]);

  const rights = useMemo(() => {
    return rightsAccess(accessModules, pathname);
  }, [accessModules, pathname]);


 const fetchStockData = useCallback(async (searchValue = "") => {
         try {
             dispatch(startLoading());
             const body = listPayload(page, { searchText: searchValue } );
 
             const response = await getStockList(body);
 
             if (response?.statusCode === 200) {
                 const payload = response?.data?.rows;
                 setCount(response?.data?.count);
                 dispatch(stockAction.storeStock(payload));
             } else if (response?.statusCode === 404) {
                 const payload = [];
                 dispatch(stockAction.storeStock(payload));
             }
         } catch (error) {
             showToast(error?.message, false);
         } finally {
             dispatch(stopLoading());
         }
     }, [dispatch, page]);
 
  const deleteBtnClickHandler = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const deleteHandler = async () => {
    try {
      setIsDeleteModalOpen(false);
      dispatch(startLoading());
      const response = await deleteStock(deleteId);

      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        dispatch(stockAction.removeStock({ id: deleteId }));
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

  const changeStatusHandler = async (e, id) => {
    try {
      const payload = {
        isActive: e.target.checked,
        updatedBy: loggedInUser.id,
      };
      const response = await updateStock(payload, id);

      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        const payload2 = { id, status: payload.isActive };
        dispatch(stockAction.changeStockStatus(payload2));
      } else {
        showToast(response?.message, false);
      }
    } catch (error) {
      showToast(error?.message, false);
    }
  };

  // search Advance
  const searchStockHandler = async (payload) => {
    try {
      fetchStockData(payload.searchValue);
    } catch (error) {
      showToast(error?.message, false);
    }
  };



  useEffect(() => {
    fetchStockData();
  }, [fetchStockData]);

  return {
    page,
    count,
    rights,
    isAdmin,
    visibleRows,
    isDeleteModalOpen,
    deleteHandler,
    handleChangePage,
    changeStatusHandler,
    setIsDeleteModalOpen,
    searchStockHandler,
    deleteBtnClickHandler,
  };
};

export default useStock;

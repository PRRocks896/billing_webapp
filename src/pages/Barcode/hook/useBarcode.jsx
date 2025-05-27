import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import {
  getBarcodeList,
  updateBarcode,
  deleteBarcode,
  createBarcode,
} from "../../../service/barcode";
import { listPayload, rightsAccess, showToast } from "../../../utils/helper";
import { startLoading, stopLoading } from "../../../redux/loader";



const useBarcodeHook = () => {

  
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const { accessModules } = loggedInUser;
  

  const [deleteId, setDeleteId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // pagination start

  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

const rights = useMemo(() => {
  return rightsAccess(accessModules, pathname);
}, [accessModules, pathname]);

  // fetch barcode

  const fetchBarcodeData = useCallback(
    async (searchValue = "") => {
      try {
        dispatch(startLoading());
        const body = listPayload(page, { serchText: searchValue });
        const response = await getBarcodeList(body);
        let payload = [];
        if (response?.status === 200) {
          const payload = response?.data?.rows;
          setCount(response?.data?.count);
          setRows(payload);
          return;
        }
        setCount(0);
        setRows(payload);
      } catch (error) {
        showToast(error?.message, false);
      } finally {
        dispatch(stopLoading());
      }
    },
    [dispatch, page]
  );

  // serch barcode

  const searchBarcodeHandler = async (payload) => {
    try {
      fetchBarcodeData(payload.searchValue);
    } catch (error) {
      showToast(error?.message, false);
    }
  };

  useEffect(() => {
    fetchBarcodeData();
  }, [fetchBarcodeData]);

  // delete barcode click handler

  const deleteBtnClickHandler = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  // deleteBarcode

  const deleteHandler = async () => {
    try {
      setIsDeleteModalOpen(false);
      setIsDeleteModalOpen(false);
      const response = await deleteBarcode(deleteId);
      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        setCount((prev) => prev - 1);
        fetchBarcodeData();
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

  // change status handler

  const changeStatusHandler = async (e, id) => {
    try {
      const payload = {
        isActive: e.target.checked,
        updatedBy: loggedInUser.id,
      };
      const response = await updateBarcode(payload, id);

      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        fetchBarcodeData();
      } else {
        showToast(response?.message, false);
      }
    } catch (error) {
      showToast(error?.message, false);
    }
  };

  const handleAddOrEdit = async () => {
    try {
      if (isEditMode) {
        const payload = {
          companyName: inputValue,
          updatedBy: loggedInUser.id,
        };
        const response = await updateBarcode(payload, editId);
        if (response?.statusCode === 200) {
          showToast(response?.message, true);
          fetchBarcodeData();
        } else {
          showToast(response?.messageCode || "Update failed", false);
        }
        setIsEditMode(false);
        setEditId(null);
      } else {
        const payload = {
          companyName: inputValue,
          createdBy: loggedInUser.id,
        };
        const response = await createBarcode(payload);
        if (response?.statusCode === 200) {
          showToast(response?.message, true);
          fetchBarcodeData();
        } else {
          showToast(response?.messageCode || "Create failed", false);
        }
      }
    } catch (error) {
      showToast(error?.message || "Something went wrong", false);
    } finally {
      setInputValue("");
    }
  };

  const handleRowEdit = (row) => {
    setInputValue(row.BarcodeName);
    setIsEditMode(true);
    setEditId(row.id);
  };

  return {
    page,
    rows,
    count,
    rights,
    isDeleteModalOpen,
    deleteHandler,
    handleChangePage,
    searchBarcodeHandler,
    changeStatusHandler,
    deleteBtnClickHandler,
    setIsDeleteModalOpen,
    handleAddOrEdit,
    handleRowEdit,
    inputValue,
    setInputValue,
  };
};

export default useBarcodeHook;

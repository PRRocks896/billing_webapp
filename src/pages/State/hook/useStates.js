import { useCallback, useEffect, useMemo, useState } from "react";
import { showToast } from "../../../utils/helper";
import { statesAction } from "../../../redux/states";
import { useDispatch, useSelector } from "react-redux";
import { getStatesList, deleteState } from "../../../service/states";

export const useStates = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.states.data);

  // pagination code start
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const emptyRows =
  //   page > 0 ? Math.max(0, (1 + page) * rowsPerPage - state.length) : 0;

  const emptyRows = rowsPerPage - state.length;

  // const visibleRows = useMemo(() => {
  //   console.log(state);
  //   return state?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  // }, [page, rowsPerPage, state]);

  const visibleRows = useMemo(() => {
    console.log(state);
    return state;
  }, [state]);

  // pagination code end

  const [deleteId, setDeleteId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const deleteModalOpen = () => setIsDeleteModalOpen(true);
  const deleteModalClose = () => setIsDeleteModalOpen(false);

  //  fetch states logic
  const fetchStatesData = useCallback(
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
            rows: rowsPerPage,
            page: page + 1,
          },
        };
        console.log(body);
        const response = await getStatesList(body);
        console.log("RK", response);
        if (response.statusCode === 200) {
          const payload = response.data.rows;
          setCount(response.data.count);
          dispatch(statesAction.storeStates(payload));
        } else if (response.statusCode === 404) {
          const payload = [];
          dispatch(statesAction.storeStates(payload));
        }
      } catch (error) {
        showToast(error.message, false);
      }
    },
    [dispatch, page, rowsPerPage]
  );

  useEffect(() => {
    fetchStatesData();
  }, [fetchStatesData]);

  const searchStatesandler = async (payload) => {
    try {
      fetchStatesData(payload.searchValue);
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
      const response = await deleteState(deleteId);
      if (response.statusCode === 200) {
        showToast(response.message, true);
        dispatch(statesAction.removeStates({ id: deleteId }));
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
    searchStatesandler,

    // ----
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    emptyRows,
    visibleRows,
    count,
  };
};

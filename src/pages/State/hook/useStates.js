import { useCallback, useEffect, useMemo, useState } from "react";
import { showToast } from "../../../utils/helper";
import { statesAction } from "../../../redux/states";
import { useDispatch, useSelector } from "react-redux";
import { getStatesList, deleteState } from "../../../service/states";
import useLoader from "../../../hook/useLoader";

export const useStates = () => {
  const dispatch = useDispatch();
  const { loading } = useLoader();
  const states = useSelector((state) => state.states.data);

  // pagination code start
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const visibleRows = useMemo(() => {
    return states;
  }, [states]);

  // pagination code end

  const [deleteId, setDeleteId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  //  fetch states logic
  const fetchStatesData = useCallback(
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

        const response = await getStatesList(body);
        loading(false);
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
      } finally {
        loading(false);
      }
    },
    [dispatch, page]
  );

  useEffect(() => {
    fetchStatesData();
  }, [fetchStatesData]);

  const searchStatesandler = async (payload) => {
    try {
      fetchStatesData(payload.searchValue);
    } catch (error) {
      showToast(error.message, false);
    }
  };

  const deleteBtnClickHandler = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const deleteHandler = async () => {
    try {
      setIsDeleteModalOpen(false);
      loading(true);
      const response = await deleteState(deleteId);
      loading(false);
      if (response.statusCode === 200) {
        showToast(response.message, true);
        dispatch(statesAction.removeStates({ id: deleteId }));
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
    searchStatesandler,
    // ----
    page,
    handleChangePage,
    visibleRows,
    count,
  };
};

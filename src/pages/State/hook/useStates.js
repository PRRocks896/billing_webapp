import { useCallback, useEffect, useMemo, useState } from "react";
import { showToast } from "../../../utils/helper";
import { statesAction } from "../../../redux/states";
import { useDispatch, useSelector } from "react-redux";
import {
  getStatesList,
  deleteState,
  updateStates,
} from "../../../service/states";
import { useLocation } from "react-router";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useStates = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const states = useSelector((state) => state.states.data);
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const { accessModules } = loggedInUser;

  const [deleteId, setDeleteId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  //  fetch states logic
  const fetchStatesData = useCallback(
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

        const response = await getStatesList(body);
        dispatch(stopLoading());
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
        dispatch(stopLoading());
      }
    },
    [dispatch, page]
  );

  useEffect(() => {
    fetchStatesData();
  }, [fetchStatesData]);

  // search states handler
  const searchStatesandler = async (payload) => {
    try {
      fetchStatesData(payload.searchValue);
    } catch (error) {
      showToast(error.message, false);
    }
  };

  // delete btn click handler
  const deleteBtnClickHandler = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  // delete state handler
  const deleteHandler = async () => {
    try {
      setIsDeleteModalOpen(false);
      dispatch(startLoading());
      const response = await deleteState(deleteId);
      dispatch(stopLoading());
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
      const response = await updateStates(payload, id);

      if (response.statusCode === 200) {
        showToast(response.message, true);
        const payload2 = { id, status: payload.isActive };
        dispatch(statesAction.changeStatesStatus(payload2));
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
    searchStatesandler,
    changeStatusHandler,
    page,
    handleChangePage,
    visibleRows,
    count,
    rights,
  };
};

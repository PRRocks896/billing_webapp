import { useCallback, useEffect, useMemo, useState } from "react";
import { listPayload, rightsAccess, showToast } from "../../../utils/helper";
import { deleteDailyTask, getDailyTaskList, updateDailyTask, createDailyTask } from "../../../service/dailyTask";
import { dailyTaskAction } from "../../../redux/dailyTask";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useDailyTask = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const dailyTask = useSelector((state) => state.dailyTask.data);
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
    if(loggedInUser && loggedInUser.px_role && ['Admin', 'Super Admin'].includes(loggedInUser.px_role.name)) {
        return true;
    }
    return false;
  }, [loggedInUser]);

  const visibleRows = useMemo(() => {
    return dailyTask;
  }, [dailyTask]);

  // pagination end

  const rights = useMemo(() => {
    return rightsAccess(accessModules, pathname);
  }, [accessModules, pathname]);

  //  fetch staff logic
  const fetchDailyTaskData = useCallback(
    async (searchValue = "") => {
      try {
        dispatch(startLoading());
        const payload = { searchText: searchValue };
        payload.createdBy = loggedInUser.id;
        const body = listPayload(page, { ...payload });
        const response = await getDailyTaskList(body);
        if (response?.statusCode === 200) {
          const payload = response?.data?.rows;
          setCount(response?.data?.count);
          dispatch(dailyTaskAction.storeDailyTask(payload));
        } else if (response?.statusCode === 404) {
          const payload = [];
          dispatch(dailyTaskAction.storeDailyTask(payload));
        }
      } catch (error) {
        showToast(error?.message, false);
      } finally {
        dispatch(stopLoading());
      }
    },
    // eslint-disable-next-line
    [dispatch, page]
    // [dispatch, page, isAdmin]
  );

  const searchDailyTaskHandler = async (payload) => {
    try {
      fetchDailyTaskData(payload.searchValue);
    } catch (error) {
      showToast(error?.message, false);
    }
  };

  useEffect(() => {
    fetchDailyTaskData();
  }, [fetchDailyTaskData]);

  const deleteBtnClickHandler = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const deleteHandler = async () => {
    try {
      setIsDeleteModalOpen(false);
      dispatch(startLoading());
      const response = await deleteDailyTask(deleteId);
      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        dispatch(dailyTaskAction.removeDailyTask({ id: deleteId }));
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
        status: e.target.value,
        isActive: e.target.checked,
        updatedBy: loggedInUser.id,
      };
      const response = await updateDailyTask(payload, id);

      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        await fetchDailyTaskData();
        const payload2 = { id, status: payload.isActive };
        dispatch(dailyTaskAction.changeDailyTaskStatus(payload2));
      } else {
        showToast(response?.message, false);
      }
    } catch (error) {
      showToast(error?.message, false);
    }
  };

  return {
    isAdmin,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteHandler,
    deleteBtnClickHandler,
    searchDailyTaskHandler,
    changeStatusHandler,
    page,
    handleChangePage,
    visibleRows,
    count,
    rights,

  };
};

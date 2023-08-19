import { useCallback, useEffect, useMemo, useState } from "react";
import { listPayload, rightsAccess, showToast } from "../../../utils/helper";
import { deleteUser, getUserList, updateUser } from "../../../service/users";
import { useDispatch, useSelector } from "react-redux";
import { userAction } from "../../../redux/users";
import { useLocation } from "react-router";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useUser = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const usersData = useSelector((state) => state.users.data);
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
    return usersData;
  }, [usersData]);

  // pagination end

  const rights = useMemo(() => {
    return rightsAccess(accessModules, pathname);
  }, [accessModules, pathname]);

  //  fetch user data
  const fetchUsersData = useCallback(
    async (searchValue = "") => {
      try {
        dispatch(startLoading());

        const body = listPayload(page, {
          searchText: searchValue,
          createdBy: loggedInUser.id,
        });
        const response = await getUserList(body);
        if (response?.statusCode === 200) {
          const payload = response?.data?.rows;
          setCount(response?.data?.count);
          dispatch(userAction.storeUser(payload));
        } else if (response?.statusCode === 404) {
          const payload = [];
          dispatch(userAction.storeUser(payload));
        }
      } catch (error) {
        showToast(error?.message, false);
      } finally {
        dispatch(stopLoading());
      }
    },
    // eslint-disable-next-line
    [dispatch, page]
  );

  // search states handler
  const searchUserHandler = async (payload) => {
    try {
      fetchUsersData(payload.searchValue);
    } catch (error) {
      showToast(error.message, false);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, [fetchUsersData]);

  // delete user click handler
  const deleteBtnClickHandler = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  // delete user
  const deleteHandler = async () => {
    try {
      setIsDeleteModalOpen(false);
      dispatch(startLoading());
      const response = await deleteUser(deleteId);
      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        dispatch(userAction.removeUser({ id: deleteId }));
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

  // change status handler
  const changeStatusHandler = async (e, id) => {
    try {
      const payload = {
        isActive: e.target.checked,
        updatedBy: loggedInUser.id,
      };
      const response = await updateUser(payload, id);

      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        const payload2 = { id, status: payload.isActive };
        dispatch(userAction.changeUserStatus(payload2));
      } else {
        showToast(response?.message, false);
      }
    } catch (error) {
      showToast(error?.message, false);
    }
  };

  return {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteHandler,
    deleteBtnClickHandler,
    searchUserHandler,
    changeStatusHandler,
    page,
    handleChangePage,
    visibleRows,
    count,
    rights,
  };
};

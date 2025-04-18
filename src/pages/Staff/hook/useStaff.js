import { useCallback, useEffect, useMemo, useState } from "react";
import { listPayload, rightsAccess, showToast } from "../../../utils/helper";
import { deleteStaff, getStaffList, updateStaff } from "../../../service/staff";
import { staffAction } from "../../../redux/staff";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useStaff = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const staffData = useSelector((state) => state.staff.data);
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
    return staffData;
  }, [staffData]);

  // pagination end

  const rights = useMemo(() => {
    return rightsAccess(accessModules, pathname);
  }, [accessModules, pathname]);

  //  fetch staff logic
  const fetchStaffData = useCallback(
    async (searchValue = "") => {
      try {
        dispatch(startLoading());
        // const userRole = loggedInUser?.px_role?.name?.toLowerCase();
        // let whereCondition = {
        //   searchText: searchValue,
        // };
        // if (userRole !== "admin") {
        //   whereCondition = {
        //     ...whereCondition,
        //     createdBy: loggedInUser.id,
        //   };
        // }
        const payload = { searchText: searchValue };
        if (!isAdmin) {
          payload.createdBy = loggedInUser.id;
        }
        const body = listPayload(page, { ...payload });
        const response = await getStaffList(body);
        if (response?.statusCode === 200) {
          const payload = response?.data?.rows;
          setCount(response?.data?.count);
          dispatch(staffAction.storeStaff(payload));
        } else if (response?.statusCode === 404) {
          const payload = [];
          dispatch(staffAction.storeStaff(payload));
        }
      } catch (error) {
        showToast(error?.message, false);
      } finally {
        dispatch(stopLoading());
      }
    },
    // eslint-disable-next-line
    [dispatch, page, isAdmin]
  );

  const searchStaffHandler = async (payload) => {
    try {
      fetchStaffData(payload.searchValue);
    } catch (error) {
      showToast(error?.message, false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, [fetchStaffData]);

  const deleteBtnClickHandler = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const deleteHandler = async () => {
    try {
      setIsDeleteModalOpen(false);
      dispatch(startLoading());
      const response = await deleteStaff(deleteId);
      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        dispatch(staffAction.removeStaff({ id: deleteId }));
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
      const response = await updateStaff(payload, id);

      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        const payload2 = { id, status: payload.isActive };
        dispatch(staffAction.changeStaffStatus(payload2));
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
    searchStaffHandler,
    changeStatusHandler,
    page,
    handleChangePage,
    visibleRows,
    count,
    rights,
  };
};

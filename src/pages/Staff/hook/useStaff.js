import { useCallback, useEffect, useMemo, useState } from "react";
import { showToast } from "../../../utils/helper";
import { deleteStaff, getStaffList, updateStaff } from "../../../service/staff";
import { staffAction } from "../../../redux/staff";
import { useDispatch, useSelector } from "react-redux";
import useLoader from "../../../hook/useLoader";

export const useStaff = () => {
  const dispatch = useDispatch();
  const { loading } = useLoader();
  const staffData = useSelector((state) => state.staff.data);
  const loggedInUser = useSelector((state) => state.loggedInUser);
  console.log(staffData);

  const [deleteId, setDeleteId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // pagination start
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const visibleRows = useMemo(() => {
    return staffData;
  }, [staffData]);

  // pagination end

  //  fetch staff logic
  const fetchStaffData = useCallback(
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
        const response = await getStaffList(body);
        if (response.statusCode === 200) {
          const payload = response.data.rows;
          setCount(response.data.count);
          dispatch(staffAction.storeStaff(payload));
        } else if (response.statusCode === 404) {
          const payload = [];
          dispatch(staffAction.storeStaff(payload));
        }
      } catch (error) {
        showToast(error.message, false);
      } finally {
        loading(false);
      }
    },
    [dispatch, page]
  );

  const searchStaffHandler = async (payload) => {
    try {
      fetchStaffData(payload.searchValue);
    } catch (error) {
      showToast(error.message, false);
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
      loading(true);
      const response = await deleteStaff(deleteId);
      if (response.statusCode === 200) {
        showToast(response.message, true);
        dispatch(staffAction.removeStaff({ id: deleteId }));
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

  const changeStatusHandler = async (e, id) => {
    try {
      const payload = {
        isActive: e.target.checked,
        updatedBy: loggedInUser.id,
      };
      const response = await updateStaff(payload, id);

      if (response.statusCode === 200) {
        showToast(response.message, true);
        const payload2 = { id, status: payload.isActive };
        dispatch(staffAction.changeStaffStatus(payload2));
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
    searchStaffHandler,
    changeStatusHandler,
    page,
    handleChangePage,
    visibleRows,
    count,
  };
};

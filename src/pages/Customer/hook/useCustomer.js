import { useCallback, useEffect, useMemo, useState } from "react";
import { showToast } from "../../../utils/helper";
import { customerActions } from "../../../redux/customer";
import { useDispatch, useSelector } from "react-redux";
import useLoader from "../../../hook/useLoader";
import {
  deleteCustomer,
  getCustomerList,
  updateCustomer,
} from "../../../service/customer";

export const useCustomer = () => {
  const dispatch = useDispatch();
  const { loading } = useLoader();
  const customerData = useSelector((state) => state.customer.data);
  const loggedInUser = useSelector((state) => state.loggedInUser);
  console.log(customerData);

  const [deleteId, setDeleteId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // pagination start
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const visibleRows = useMemo(() => {
    return customerData;
  }, [customerData]);

  // pagination end

  //  fetch customer logic
  const fetchCustomerData = useCallback(
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
        const response = await getCustomerList(body);
        if (response.statusCode === 200) {
          const payload = response.data.rows;
          setCount(response.data.count);
          dispatch(customerActions.storeCustomer(payload));
        } else if (response.statusCode === 404) {
          const payload = [];
          dispatch(customerActions.storeCustomer(payload));
        }
      } catch (error) {
        showToast(error.message, false);
      } finally {
        loading(false);
      }
    },
    [dispatch, page]
  );

  const searchCustomerHandler = async (payload) => {
    try {
      fetchCustomerData(payload.searchValue);
    } catch (error) {
      showToast(error.message, false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, [fetchCustomerData]);

  const deleteBtnClickHandler = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const deleteHandler = async () => {
    try {
      setIsDeleteModalOpen(false);
      loading(true);
      const response = await deleteCustomer(deleteId);
      if (response.statusCode === 200) {
        showToast(response.message, true);
        dispatch(customerActions.removeCustomer({ id: deleteId }));
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
      const response = await updateCustomer(payload, id);

      if (response.statusCode === 200) {
        showToast(response.message, true);
        const payload2 = { id, status: payload.isActive };
        dispatch(customerActions.changeCustomerStatus(payload2));
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
    searchCustomerHandler,
    changeStatusHandler,
    page,
    handleChangePage,
    visibleRows,
    count,
  };
};

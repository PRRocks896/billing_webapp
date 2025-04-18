import { useCallback, useEffect, useMemo, useState } from "react";
import { listPayload, rightsAccess, showToast } from "../../../utils/helper";
import { customerActions } from "../../../redux/customer";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerList, updateCustomer, deleteCustomer, customerReport } from "../../../service/customer";
import { useLocation } from "react-router";
import { getUserList } from "../../../service/users";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useCustomer = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const customerData = useSelector((state) => state.customer.data);
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const { accessModules } = loggedInUser;

  const [deleteId, setDeleteId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);

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

  const rights = useMemo(() => {
    return rightsAccess(accessModules, pathname);
  }, [accessModules, pathname]);

  const isAdmin = useMemo(() => {
    if(loggedInUser && loggedInUser.px_role && loggedInUser.px_role.name === 'Admin') {
        return true;
    }
    return false;
  }, [loggedInUser]);

  const fetchBranch = async () => {
    try {
      const body = listPayload(0, {isActive: true, isDeleted: false}, 1000);

      const response = await getUserList(body);
      if (response?.statusCode === 200) {
        const payload = response?.data?.rows;
        const branchOption = payload.filter(item => item.roleID !== 1);
        setBranchList([{id: null, branchName: 'All'}].concat(branchOption));
        // setBranchList([{id: null, branchName: 'All'}].concat(branchOption));
      } else if (response?.statusCode === 404) {
        const payload = [];
        setBranchList(payload);
      }
    } catch (error) {
      showToast(error?.message, false);
    }
  };

  //  fetch customer logic
  const fetchCustomerData = useCallback(
    async (searchValue = "") => {
      try {
        dispatch(startLoading());
        const payload = { searchText: searchValue };
        const body = listPayload(page, { ...payload });

        const response = await getCustomerList(body);
        if (response?.statusCode === 200) {
          const payload = response?.data;
          setCount(payload?.count);
          dispatch(customerActions.storeCustomer(payload.rows));
        } else if (response?.statusCode === 404) {
          const payload = [];
          dispatch(customerActions.storeCustomer(payload));
        }
      } catch (error) {
        showToast(error?.message, false);
      } finally {
        dispatch(stopLoading());
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
    fetchBranch();
    // eslint-disable-next-line
  }, [fetchCustomerData]);

  const deleteBtnClickHandler = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const deleteHandler = async () => {
    try {
      // setIsDeleteModalOpen(false);
      dispatch(startLoading());
      const response = await deleteCustomer(deleteId);
      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        dispatch(customerActions.removeCustomer({ id: deleteId }));
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
      const response = await updateCustomer(payload, id);

      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        // fetchCustomerData();
        const payload2 = { id, status: payload.isActive };
        dispatch(customerActions.changeCustomerStatus(payload2));
      } else {
        showToast(response?.message, false);
      }
    } catch (error) {
      showToast(error?.message, false);
    }
  };

  const downloadCustomer = async () => {
    try {
      dispatch(startLoading());
      if(selectedBranch.length) {
        const body = {
          branchIds: selectedBranch
        }
        await customerReport(body)
      } else {
        showToast('Select Branch', false);
      }
    } catch(error) {
      showToast(error?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  }

  return {
    branchList,
    isAdmin,
    isDeleteModalOpen,
    setSelectedBranch,
    selectedBranch,
    setIsDeleteModalOpen,
    deleteHandler,
    deleteBtnClickHandler,
    searchCustomerHandler,
    changeStatusHandler,
    page,
    handleChangePage,
    visibleRows,
    count,
    downloadCustomer,
    rights,
  };
};

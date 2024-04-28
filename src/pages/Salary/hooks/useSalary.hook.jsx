import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import moment from "moment";

import { listPayload, rightsAccess, showToast } from "../../../utils/helper";

import {
  updateSalary,
  deleteSalary,
  getSalaryList,
  downloadSalary,
} from "../../../service/salary";
import {
  getUserList
} from "../../../service/users";
import { salaryAction } from "../../../redux/salary";
import { startLoading, stopLoading } from "../../../redux/loader";

const useSalaryHooks = () => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const salaryData = useSelector((state) => state.salary.data);;
    const loggedInUser = useSelector((state) => state.loggedInUser);
    const { accessModules } = loggedInUser;

    const [month, setMonth] = useState((moment().month() + 1));
    const [year, setYear] = useState(moment().format('yyyy'));
    const [selectedBranch, setSelectedBranch] = useState(null);

    const [branchList, setBranchList] = useState([]);
    const [deleteId, setDeleteId] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // pagination start
    const [page, setPage] = useState(0);
    const [count, setCount] = useState(0);

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const isAdmin = useMemo(() => {
      if(loggedInUser && loggedInUser.px_role && ['super admin', 'admin'].includes(loggedInUser.px_role.name.toLowerCase())) {
        return true;
      }
      return false;
    }, [loggedInUser]);

    const rights = useMemo(() => {
      return rightsAccess(accessModules, pathname);
    }, [accessModules, pathname]);

    const visibleRows = useMemo(() => {
      return salaryData;
    }, [salaryData]);

    const fetchSalaryData = useCallback(async (searchValue = '') => {
      try {
        dispatch(startLoading());
        const body = listPayload(page, { searchText: searchValue });
        const response = await getSalaryList(body);
        if (response?.statusCode === 200) {
          const payload = response?.data?.rows;
          setCount(response?.data?.count);
          dispatch(salaryAction.storeSalary(payload));
        } else if (response?.statusCode === 404) {
          const payload = [];
          dispatch(salaryAction.storeSalary(payload));
        }
      } catch(error) {
        showToast(error?.message, false);
      } finally {
        dispatch(stopLoading());
      }
    }, [dispatch, page]);

    const deleteBtnClickHandler = (id) => {
      setDeleteId(id);
      setIsDeleteModalOpen(true);
    };

    const deleteHandler = async () => {
      try {
        setIsDeleteModalOpen(false);
        dispatch(startLoading());
        const response = await deleteSalary(deleteId);

        if (response?.statusCode === 200) {
          showToast(response?.message, true);
          dispatch(salaryAction.removeSalary({ id: deleteId }));
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
        const response = await updateSalary(payload, id);

        if (response?.statusCode === 200) {
          showToast(response?.message, true);
          const payload2 = { id, status: payload.isActive };
          dispatch(salaryAction.changeSalaryStatus(payload2));
        } else {
          showToast(response?.message, false);
        }
      } catch (error) {
        showToast(error?.message, false);
      }
    };

    const fetchBranch = async () => {
      try {
        const body = listPayload(0, {isActive: true, isDeleted: false}, 1000);
  
        const response = await getUserList(body);
        if (response?.statusCode === 200) {
          const payload = response?.data?.rows;
          const branchOption = payload.filter(item => item.roleID !== 1);
          setBranchList(branchOption);
          // setBranchList([{id: null, branchName: 'All'}].concat(branchOption));
        } else if (response?.statusCode === 404) {
          const payload = [];
          setBranchList(payload);
        }
      } catch (error) {
        showToast(error?.message, false);
      }
    };

    const download = async () => {
      try {
        dispatch(startLoading());
        if(year && year.length !== 4) {
          showToast('Please Enter Correct Year', false);
          return;
        }
        if(selectedBranch === null) {
          showToast('Please Select Branch', false);
          return;
        }
        await downloadSalary({
          year: year,
          month: month,
          branchId: selectedBranch?.id
        }, `${selectedBranch?.branchName}_${month}_${year}.xlsx`);
      } catch(err) {
        showToast(err?.response?.statusText, false);
      } finally {
        dispatch(stopLoading());
      }
    }

    useEffect(() => {
      if(isAdmin) {
        fetchBranch();
      }
      // eslint-disable-next-line
    }, [isAdmin]);

    useEffect(() => {
      fetchSalaryData()
    }, [fetchSalaryData]);

    return {
        page,
        year,
        count,
        month,
        rights,
        isAdmin,
        branchList,
        visibleRows,
        selectedBranch,
        isDeleteModalOpen,
        setYear,
        setMonth,
        download,
        deleteHandler,
        handleChangePage,
        setSelectedBranch,
        changeStatusHandler,
        setIsDeleteModalOpen,
        deleteBtnClickHandler,
    }
}

export default useSalaryHooks;
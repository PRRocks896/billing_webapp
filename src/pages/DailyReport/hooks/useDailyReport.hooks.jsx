import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import * as moment from "moment";

import { listPayload, rightsAccess, showToast } from "../../../utils/helper";

import {
  getDailyReportList,
  updateDailyReport,
  deleteDailyReport,
  downloadDailyReport
} from "../../../service/dailyReport";

import {
  getUserList
} from "../../../service/users";

import { dailyReportAction } from "../../../redux/dailyReport";
import { startLoading, stopLoading } from "../../../redux/loader";

const useDailyReportHooks = () => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const dailyReportData = useSelector((state) => state.dailyReport.data);;
    const loggedInUser = useSelector((state) => state.loggedInUser);
    const { accessModules } = loggedInUser;

    const [deleteId, setDeleteId] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // const [pdfData, setPdfData] = useState(null);
    
    const [dateRange, setDateRange] = useState(moment(new Date()).format('yyyy-MM-DD'));
    const [branchList, setBranchList] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);

    // pagination start
    const [page, setPage] = useState(0);
    const [count, setCount] = useState(0);

    const isAdmin = useMemo(() => {
      if(loggedInUser && loggedInUser.px_role && loggedInUser.px_role.name === 'Admin') {
          return true;
      }
      return false;
  }, [loggedInUser]);

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const rights = useMemo(() => {
      return rightsAccess(accessModules, pathname);
    }, [accessModules, pathname]);
  
    const visibleRows = useMemo(() => {
        return dailyReportData;
    }, [dailyReportData]);
    
    const fetchDailyReportData = useCallback(async (searchValue = '') => {
        try {
          dispatch(startLoading());
          let payload = {
            searchText: searchValue
          };
          if(!isAdmin) {
            payload = {
              ...payload,
              createdBy: loggedInUser.id
            }
          }
          const body = listPayload(page, payload);
          const response = await getDailyReportList(body);
          if (response?.statusCode === 200) {
            const payload = response?.data?.rows;
            setCount(response?.data?.count);
            dispatch(dailyReportAction.storeDailyReport(payload));
          } else if (response?.statusCode === 404) {
            const payload = [];
            dispatch(dailyReportAction.storeDailyReport(payload));
          }
        } catch(error) {
          showToast(error?.message, false);
        } finally {
          dispatch(stopLoading());
        }
    }, [dispatch, page, loggedInUser, isAdmin]);

    const deleteBtnClickHandler = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const deleteHandler = async () => {
        try {
          setIsDeleteModalOpen(false);
          dispatch(startLoading());
          const response = await deleteDailyReport(deleteId);
  
          if (response?.statusCode === 200) {
            showToast(response?.message, true);
            dispatch(dailyReportAction.removeDailyReport({ id: deleteId }));
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
          const response = await updateDailyReport(payload, id);

          if (response?.statusCode === 200) {
            showToast(response?.message, true);
            const payload2 = { id, status: payload.isActive };
            dispatch(dailyReportAction.changeDailyReportStatus(payload2));
          } else {
            showToast(response?.message, false);
          }
        } catch (error) {
          showToast(error?.message, false);
        }
    };

    const searchDailyReportHandler = (payload) => {
      fetchDailyReportData(payload.searchValue);
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
  
    const downloadReport = async () => {
      try {
        dispatch(startLoading());
        const payload = {
          userID: selectedBranch?.id,
          startDate: moment(dateRange).format('yyyy-MM-DD'),
          endDate: moment(dateRange).format('yyyy-MM-DD')
        }
        await downloadDailyReport(payload);
      } catch(err) {
        console.error(err);
        showToast(err?.message, false);
      } finally {
        dispatch(stopLoading());
      }
    }

    useEffect(() => {
      if(isAdmin) {
        fetchBranch();
      }
    }, [isAdmin]);
  
    useEffect(() => {
        fetchDailyReportData()
    }, [fetchDailyReportData]);

    return {
        page,
        count,
        rights,
        isAdmin,
        dateRange,
        branchList,
        visibleRows,
        selectedBranch,
        isDeleteModalOpen,
        setDateRange,
        deleteHandler,
        downloadReport,
        handleChangePage,
        setSelectedBranch,
        changeStatusHandler,
        setIsDeleteModalOpen,
        deleteBtnClickHandler,
        searchDailyReportHandler,
    }
};

export default useDailyReportHooks;
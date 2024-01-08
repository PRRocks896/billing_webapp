import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { listPayload, rightsAccess, showToast } from "../../../utils/helper";

import {
    updateMembershipPlan,
    deleteMembershipPlan,
    getMembershipPlanList
} from "../../../service/membershipPlan";
import { membershipPlanAction } from "../../../redux/membershipPlan";
import { startLoading, stopLoading } from "../../../redux/loader";

const useMembershipPlanHooks = () => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const membershipPlanData = useSelector((state) => state.membershipPlan.data);;
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

    const rights = useMemo(() => {
      return rightsAccess(accessModules, pathname);
    }, [accessModules, pathname]);

    const visibleRows = useMemo(() => {
      return membershipPlanData;
    }, [membershipPlanData]);

    const fetchMembershipPlanData = useCallback(async (searchValue = '') => {
      try {
        dispatch(startLoading());
        const body = listPayload(page, { searchText: searchValue });
        const response = await getMembershipPlanList(body);
        if (response?.statusCode === 200) {
          const payload = response?.data?.rows;
          setCount(response?.data?.count);
          dispatch(membershipPlanAction.storeMembershipPlan(payload));
        } else if (response?.statusCode === 404) {
          const payload = [];
          dispatch(membershipPlanAction.storeMembershipPlan(payload));
        }
      } catch(error) {
        showToast(error?.message, false);
      } finally {
        dispatch(stopLoading());
      }
    }, [dispatch, page]);

    const deleteBtnClickHandler = (id) => {
      console.log(id);
      setDeleteId(id);
      setIsDeleteModalOpen(true);
    };

    const deleteHandler = async () => {
      try {
        setIsDeleteModalOpen(false);
        dispatch(startLoading());
        const response = await deleteMembershipPlan(deleteId);

        if (response?.statusCode === 200) {
          showToast(response?.message, true);
          dispatch(membershipPlanAction.removeMembershipPlan({ id: deleteId }));
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
          const response = await updateMembershipPlan(payload, id);

          if (response?.statusCode === 200) {
            showToast(response?.message, true);
            const payload2 = { id, status: payload.isActive };
            dispatch(membershipPlanAction.changeMembershipPlanStatus(payload2));
          } else {
            showToast(response?.message, false);
          }
        } catch (error) {
          showToast(error?.message, false);
        }
    };

    const searchMembershipPlanHandler = (payload) => {
      try {
        fetchMembershipPlanData(payload.searchValue);
      } catch (error) {
        showToast(error.message, false);
      }
    };

    useEffect(() => {
      fetchMembershipPlanData()
    }, [fetchMembershipPlanData]);

    return {
        page,
        count,
        rights,
        visibleRows,
        isDeleteModalOpen,
        deleteHandler,
        handleChangePage,
        changeStatusHandler,
        setIsDeleteModalOpen,
        deleteBtnClickHandler,
        searchMembershipPlanHandler,
    }
}

export default useMembershipPlanHooks;
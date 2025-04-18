import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { listPayload, rightsAccess, showToast } from "../../../utils/helper";

import {
  updateCoupon,
  deleteCoupon,
  getCouponList
} from "../../../service/coupon";
import { couponAction } from "../../../redux/coupon";
import { startLoading, stopLoading } from "../../../redux/loader";

const useCouponHook = () => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const couponData = useSelector((state) => state.coupon.data);;
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

    const rights = useMemo(() => {
      return rightsAccess(accessModules, pathname);
    }, [accessModules, pathname]);

    const visibleRows = useMemo(() => {
      return couponData;
    }, [couponData]);

    const fetchCouponData = useCallback(async (searchValue = '') => {
      try {
        dispatch(startLoading());
        let payload = { searchText: searchValue };
        if (!isAdmin) {
          payload.createdBy = loggedInUser.id;
        }
        const body = listPayload(page, payload);
        const response = await getCouponList(body);
        if (response?.statusCode === 200) {
          const payload = response?.data?.rows;
          setCount(response?.data?.count);
          dispatch(couponAction.storeCoupon(payload));
        } else if (response?.statusCode === 404) {
          const payload = [];
          dispatch(couponAction.storeCoupon(payload));
        }
      } catch(error) {
        showToast(error?.message, false);
      } finally {
        dispatch(stopLoading());
      }
      // eslint-disable-next-line
    }, [dispatch, page]);

    const deleteBtnClickHandler = (id) => {
      setDeleteId(id);
      setIsDeleteModalOpen(true);
    };

    const deleteHandler = async () => {
      try {
        setIsDeleteModalOpen(false);
        dispatch(startLoading());
        const response = await deleteCoupon(deleteId);

        if (response?.statusCode === 200) {
          showToast(response?.message, true);
          dispatch(couponAction.removeCoupon({ id: deleteId }));
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
          const response = await updateCoupon(payload, id);

          if (response?.statusCode === 200) {
            showToast(response?.message, true);
            const payload2 = { id, status: payload.isActive };
            dispatch(couponAction.changeCouponStatus(payload2));
          } else {
            showToast(response?.message, false);
          }
        } catch (error) {
          showToast(error?.message, false);
        }
    };

    const searchCouponHandler = (payload) => {
      try {
        fetchCouponData(payload.searchValue);
      } catch (error) {
        showToast(error.message, false);
      }
    };

    useEffect(() => {
      fetchCouponData()
    }, [fetchCouponData]);

    return {
      page,
      count,
      rights,
      isAdmin,
      visibleRows,
      isDeleteModalOpen,
      deleteHandler,
      handleChangePage,
      changeStatusHandler,
      setIsDeleteModalOpen,
      deleteBtnClickHandler,
      searchCouponHandler,
    }
};

export default useCouponHook;
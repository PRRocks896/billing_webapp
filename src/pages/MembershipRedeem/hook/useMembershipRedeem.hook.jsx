
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { listPayload, rightsAccess, showToast } from "../../../utils/helper";
import {
    updateMembershipRedeem,
    deleteMembershipRedeem,
    getMembershipRedeemList
} from "../../../service/membershipRedeem";
import { membershipRedeemAction } from "../../../redux/membershipRedeem";
import { startLoading, stopLoading } from "../../../redux/loader";

const useMembershipRedeemHooks = () => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const membershipRedeemData = useSelector((state) => state.membershipRedeem.data);
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
        return membershipRedeemData;
    }, [membershipRedeemData]);

    const fetchMembershipRedeemData = useCallback(async (searchValue = '') => {
        try {
            dispatch(startLoading());
            const body = listPayload(page, { searchText: searchValue });
            const response = await getMembershipRedeemList(body);
            if (response?.statusCode === 200) {
                const payload = response?.data?.rows;
                setCount(response?.data?.count);
                dispatch(membershipRedeemAction.storeMembershipRedeem(payload));
            } else if (response?.statusCode === 404) {
                const payload = [];
                dispatch(membershipRedeemAction.storeMembershipRedeem(payload));
            }
        } catch (error) {
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
            const response = await deleteMembershipRedeem(deleteId);

            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                dispatch(membershipRedeemAction.removeMembershipRedeem({ id: deleteId }));
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
            const response = await updateMembershipRedeem(payload, id);

            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                const payload2 = { id, status: payload.isActive };
                dispatch(membershipRedeemAction.changeMembershipRedeemStatus(payload2));
            } else {
                showToast(response?.message, false);
            }
        } catch (error) {
            showToast(error?.message, false);
        }
    };

    const searchMembershipRedeemHandler = (payload) => {
        try {
            fetchMembershipRedeemData(payload.searchValue);
        } catch (error) {
            showToast(error.message, false);
        }
    };

    useEffect(() => {
        fetchMembershipRedeemData()
    }, [fetchMembershipRedeemData]);

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
        deleteMembershipRedeem,
        searchMembershipRedeemHandler,
    }
};

export default useMembershipRedeemHooks;
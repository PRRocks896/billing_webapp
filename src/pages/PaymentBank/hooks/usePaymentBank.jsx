import { useCallback, useEffect, useMemo, useState } from "react";
import { listPayload, rightsAccess, showToast } from "../../../utils/helper";
import { getPaymentBankList, deletePaymentBank, updatePaymentBank } from "../../../service/paymentBank";
import { paymentBankAction } from "../../../redux/paymentBank";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { startLoading, stopLoading } from "../../../redux/loader";

const UsePaymentBank = () => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const paymentBankData = useSelector((state) => state.paymentBank.data);
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
        if (loggedInUser && loggedInUser.px_role && ['Admin', 'Super Admin'].includes(loggedInUser.px_role.name)) {
            return true;
        }
        return false;
    }, [loggedInUser]);

    const visibleRows = useMemo(() => {
        return paymentBankData;
    }, [paymentBankData]);

    // pagination end

    const rights = useMemo(() => {
        return rightsAccess(accessModules, pathname);
    }, [accessModules, pathname]);

    const fetchPaymentBank = useCallback(async (searchValue = "") => {
        try {
            dispatch(startLoading());
            const payload = { searchText: searchValue };
            if (!isAdmin) {
                payload.createdBy = loggedInUser.id;
            }
            const body = listPayload(page, { ...payload });
            const response = await getPaymentBankList(body);
            if (response?.statusCode === 200) {
                const payload = response?.data?.rows;
                setCount(response?.data?.count);
                dispatch(paymentBankAction.storePaymentBank(payload));
            } else if (response?.statusCode === 404) {
                const payload = [];
                dispatch(paymentBankAction.storePaymentBank(payload));
            }
        } catch (error) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
        // eslint-disable-next-line
    }, [dispatch, page, isAdmin]);

    const searchPaymentBankHandler = async (payload) => {
        try {
            fetchPaymentBank(payload.searchValue);
        } catch (error) {
            showToast(error?.message, false);
        }
    };

    useEffect(() => {
        fetchPaymentBank();
    }, []);

    const deleteBtnClickHandler = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const deleteHandler = async () => {
        try {
            setIsDeleteModalOpen(false);
            dispatch(startLoading());
            const response = await deletePaymentBank(deleteId);
            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                dispatch(paymentBankAction.removePaymentBank({ id: deleteId }));
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
            const response = await updatePaymentBank(payload, id);

            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                const payload2 = { id, status: payload.isActive };
                dispatch(paymentBankAction.changePaymentBankStatus(payload2));
            } else {
                showToast(response?.message, false);
            }
        } catch (error) {
            showToast(error?.message, false);
        }
    };

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
        deleteBtnClickHandler,
        searchPaymentBankHandler,
    }
}

export default UsePaymentBank;
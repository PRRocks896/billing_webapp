import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { listPayload, rightsAccess, showToast } from "../../../utils/helper";
import { LaundryReceiverActions } from "../../../redux/laundryReceiver";
import { deleteLaundryReceiver, getLaundryReceiverList, updateLaundryReceiver } from "../../../service/laundryReceiver";
import { startLoading, stopLoading } from "../../../redux/loader";

const useLaundryReceiver = () => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const laundryReceiverData = useSelector((state) => state.LaundryReceiver.data);
    console.log(laundryReceiverData)
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
        if(loggedInUser && loggedInUser.px_role && ['super admin', 'admin'].includes(loggedInUser.px_role.name.toLowerCase())) {
          return true;
        }
        return false;
    }, [loggedInUser]);

    const visibleRows = useMemo(() => {
        return laundryReceiverData;
    }, [laundryReceiverData]);

    const rights = useMemo(() => {
        return rightsAccess(accessModules, pathname);
    }, [accessModules, pathname]);

    //  fetch Advance
    const fetchLaundryReceiverData = useCallback(async (searchValue = "") => {
        try {
            dispatch(startLoading());
            const body = listPayload(page, { isDeleted: false, searchText: searchValue });
    
            const response = await getLaundryReceiverList(body);
    
            if (response?.statusCode === 200) {
                const payload = response?.data?.rows;
                setCount(response?.data?.count);
                dispatch(LaundryReceiverActions.storeLaundryReceiver(payload));
            } else if (response?.statusCode === 404) {
                const payload = [];
                dispatch(LaundryReceiverActions.storeLaundryReceiver(payload));
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
            const response = await deleteLaundryReceiver(deleteId);
    
            if (response?.statusCode === 200) {
              showToast(response?.message, true);
              dispatch(LaundryReceiverActions.removeLaundryReceiver({ id: deleteId }));
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
            const response = await updateLaundryReceiver(payload, id);

            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                const payload2 = { id, status: payload.isActive };
                dispatch(LaundryReceiverActions.changeLaundryReceiverStatus(payload2));
            } else {
                showToast(response?.message, false);
            }
        } catch (error) {
            showToast(error?.message, false);
        }
    };
        
    // search Advance
    const searchLaundryReceiverHandler = async (payload) => {
        try {
            fetchLaundryReceiverData(payload.searchValue);
        } catch (error) {
            showToast(error?.message, false);
        }
    };

    // useEffect(() => {
    //     const fetchDropDownList = async () => {
    //         const whereCondition = {
    //             isActive: true,
    //             isDeleted: false
    //         };
    //         const payload = listPayload(0, whereCondition, 100000);
    //         const [
    //             staffResponse,
    //             paymentResponse
    //         ] = await Promise.all([
    //             getStaffList(listPayload(0, ['admin', 'super admin'].includes(loggedInUser?.px_role?.name?.toLowerCase()) ? {...whereCondition} : {...whereCondition, createdBy: loggedInUser.id}, 100000)),
    //             getPaymentTypeList(payload)
    //         ]);
    //         if(staffResponse && staffResponse.statusCode === 200 && staffResponse.success) {
    //             setStaffOption(staffResponse.data.rows);
    //         } else {
    //             setStaffOption([]);
    //         }
    //         if(paymentResponse && paymentResponse.statusCode === 200 && paymentResponse.success) {
    //             setPaymentOption(paymentResponse.data.rows);
    //         } else {
    //             setPaymentOption([]);
    //         }
    //     };
    //     fetchDropDownList();
    //     // eslint-disable-next-line
    // }, []);

    useEffect(() => {
        fetchLaundryReceiverData();
        // eslint-disable-next-line
    }, [fetchLaundryReceiverData]);

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
        searchLaundryReceiverHandler,
        deleteBtnClickHandler,
    }
}

export default useLaundryReceiver;
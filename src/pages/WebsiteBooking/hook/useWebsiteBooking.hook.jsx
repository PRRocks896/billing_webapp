import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { listPayload, rightsAccess, showToast } from "../../../utils/helper";

import {
    getWebsiteBookingList
} from "../../../service/websiteBooking";
import { websiteBookingAction } from "../../../redux/websiteBooking";
import { startLoading, stopLoading } from "../../../redux/loader";

const useWebsiteBookingHook = () => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const websiteBookingData = useSelector((state) => state.websiteBooking.data);
    const loggedInUser = useSelector((state) => state.loggedInUser);
    const { accessModules } = loggedInUser;

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

    const rights = useMemo(() => {
        return rightsAccess(accessModules, pathname);
    }, [accessModules, pathname]);

    const visibleRows = useMemo(() => {
        return websiteBookingData;
    }, [websiteBookingData]);

    const fetchWebsiteBookingData = useCallback(async (searchValue = '') => {
        try {
            dispatch(startLoading());
            let payload = { searchText: searchValue };
            if (!isAdmin) {
                payload.userID = loggedInUser.id;
            }
            const body = listPayload(page, payload);
            const response = await getWebsiteBookingList(body);
            if (response?.statusCode === 200) {
                const payload = response?.data?.rows;
                setCount(response?.data?.count);
                dispatch(websiteBookingAction.storeWebsiteBooking(payload));
            } else if (response?.statusCode === 404) {
                const payload = [];
                dispatch(websiteBookingAction.storeWebsiteBooking(payload));
            }
        } catch (error) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
        // eslint-disable-next-line
    }, [dispatch, page]);

    const searchWebsiteBookingHandler = (payload) => {
        try {
            fetchWebsiteBookingData(payload.searchValue);
        } catch (error) {
            showToast(error.message, false);
        }
    };

    useEffect(() => {
        fetchWebsiteBookingData()
    }, [fetchWebsiteBookingData]);

    return {
        page,
        count,
        rights,
        isAdmin,
        visibleRows,
        handleChangePage,
        searchWebsiteBookingHandler,
    }
}

export default useWebsiteBookingHook;
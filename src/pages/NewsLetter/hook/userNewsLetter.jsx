import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { listPayload, rightsAccess, showToast } from "../../../utils/helper";
import { newsLetterAction } from "../../../redux/newsletter";
import { getNewsLetterList } from "../../../service/newsLetter";
import { startLoading, stopLoading } from "../../../redux/loader";

const useNewsLetterHooks = () => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const newsLetterData = useSelector((state) => state.newsLetter.data);
    const loggedInUser = useSelector((state) => state.loggedInUser);
    const { accessModules } = loggedInUser;

    // pagination start
    const [page, setPage] = useState(0);
    const [count, setCount] = useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const visibleRows = useMemo(() => {
        return newsLetterData;
    }, [newsLetterData]);

    // pagination end

    const rights = useMemo(() => {
        return rightsAccess(accessModules, pathname);
    }, [accessModules, pathname]);

    //  fetch NewsLetter
    const fetchNewsLetterData = useCallback(
        async (searchValue = "") => {
            try {
            dispatch(startLoading());
            const body = listPayload(page, { searchText: searchValue });
    
            const response = await getNewsLetterList(body);
    
            if (response?.statusCode === 200) {
              const payload = response?.data?.rows;
              setCount(response?.data?.count);
              dispatch(newsLetterAction.storeNewsLetter(payload));
            } else if (response?.statusCode === 404) {
              const payload = [];
              dispatch(newsLetterAction.storeNewsLetter(payload));
            }
          } catch (error) {
            showToast(error?.message, false);
          } finally {
            dispatch(stopLoading());
          }
        },
        [dispatch, page]
    );
    
    // search NewsLetter
    const searchNewsLetterHandler = async (payload) => {
        try {
            fetchNewsLetterData(payload.searchValue);
        } catch (error) {
          showToast(error?.message, false);
        }
    };
    
    useEffect(() => {
        fetchNewsLetterData();
    }, [fetchNewsLetterData]);

    return {
        page,
        count,
        rights,
        visibleRows,
        handleChangePage,
        searchNewsLetterHandler
    }
}

export default useNewsLetterHooks;
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteService, getServiceList } from "../../../service/service";
import { showToast } from "../../../utils/helper";
import { serviceAction } from "../../../redux/service";

export const useService = () => {
  const dispatch = useDispatch();

  const service = useSelector((state) => state.service.data);

  const [deleteId, setDeleteId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // pagination code start
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const visibleRows = useMemo(() => {
    return service;
  }, [service]);

  // pagination code end

  //  fetch staff logic
  const fetchServiceData = useCallback(
    async (searchValue = "") => {
      try {
        const body = {
          where: {
            isActive: true,
            isDeleted: false,
            searchText: searchValue,
          },
          pagination: {
            sortBy: "createdAt",
            descending: true,
            rows: 10,
            page: page + 1,
          },
        };
        const response = await getServiceList(body);

        if (response.statusCode === 200) {
          const payload = response.data.rows;
          setCount(response.data.count);
          dispatch(serviceAction.storeServices(payload));
        } else if (response.statusCode === 404) {
          const payload = [];
          dispatch(serviceAction.storeServices(payload));
        }
      } catch (error) {
        showToast(error.message, false);
      }
    },
    [dispatch, page]
  );

  useEffect(() => {
    fetchServiceData();
  }, [fetchServiceData]);

  const searchServiceHandler = async (payload) => {
    try {
      fetchServiceData(payload.searchValue);
    } catch (error) {
      showToast(error.message, false);
    }
  };

  const deleteBtnClickHandler = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const deleteHandler = async () => {
    try {
      const response = await deleteService(deleteId);
      if (response.statusCode === 200) {
        showToast(response.message, true);
        dispatch(serviceAction.removeService({ id: deleteId }));
      } else {
        showToast(response.messageCode, false);
      }
    } catch (error) {
      showToast(error.message, false);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteHandler,
    deleteBtnClickHandler,
    searchServiceHandler,
    page,
    handleChangePage,
    visibleRows,
    count,
  };
};

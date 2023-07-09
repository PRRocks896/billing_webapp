import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteService,
  getServiceList,
  updateService,
} from "../../../service/service";
import { showToast } from "../../../utils/helper";
import { serviceAction } from "../../../redux/service";
import useLoader from "../../../hook/useLoader";

export const useService = () => {
  const dispatch = useDispatch();
  const { loading } = useLoader();

  const service = useSelector((state) => state.service.data);
  const loggedInUser = useSelector((state) => state.loggedInUser);

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

  //  fetch service logic
  const fetchServiceData = useCallback(
    async (searchValue = "") => {
      try {
        loading(true);
        const body = {
          where: {
            // isActive: true,
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
      } finally {
        loading(false);
      }
    },
    [dispatch, page]
  );

  useEffect(() => {
    fetchServiceData();
  }, [fetchServiceData]);

  // search service handler
  const searchServiceHandler = async (payload) => {
    try {
      fetchServiceData(payload.searchValue);
    } catch (error) {
      showToast(error.message, false);
    }
  };

  // delete btn click handler
  const deleteBtnClickHandler = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  // delete service handler
  const deleteHandler = async () => {
    try {
      setIsDeleteModalOpen(false);
      loading(true);
      const response = await deleteService(deleteId);

      if (response.statusCode === 200) {
        showToast(response.message, true);
        dispatch(serviceAction.removeService({ id: deleteId }));
        setCount((prev) => prev - 1);
      } else {
        showToast(response.messageCode, false);
      }
    } catch (error) {
      showToast(error.message, false);
    } finally {
      setIsDeleteModalOpen(false);
      loading(false);
    }
  };

  // change service status handler
  const changeStatusHandler = async (e, id) => {
    try {
      const payload = {
        isActive: e.target.checked,
        updatedBy: loggedInUser.id,
      };
      const response = await updateService(payload, id);

      if (response.statusCode === 200) {
        showToast(response.message, true);
        const payload2 = { id, status: payload.isActive };
        dispatch(serviceAction.changeServiceStatus(payload2));
      } else {
        showToast(response.message, false);
      }
    } catch (error) {
      showToast(error.message, false);
    }
  };

  return {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteHandler,
    deleteBtnClickHandler,
    searchServiceHandler,
    changeStatusHandler,
    page,
    handleChangePage,
    visibleRows,
    count,
  };
};

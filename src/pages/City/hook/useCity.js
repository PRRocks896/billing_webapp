import { useCallback, useEffect, useMemo, useState } from "react";
import { showToast } from "../../../utils/helper";
import { deleteCity, getCityList } from "../../../service/city";
import { cityAction } from "../../../redux/city";
import { useDispatch, useSelector } from "react-redux";

export const useCity = () => {
  const dispatch = useDispatch();

  const cities = useSelector((state) => state.city.data);
  const [count, setCount] = useState(0);

  // pagination code start
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const emptyRows =
  //   page > 0 ? Math.max(0, (1 + page) * rowsPerPage - cities.length) : 0;

  const emptyRows = rowsPerPage - cities.length;

  // const visibleRows = useMemo(
  //   () => cities?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
  //   [page, rowsPerPage, cities]
  // );
  const visibleRows = useMemo(() => {
    return cities;
  }, [cities]);

  // pagination code end

  const [deleteId, setDeleteId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // const deleteModalOpen = () => setIsDeleteModalOpen(true);
  // const deleteModalClose = () => setIsDeleteModalOpen(false);

  //  fetch city logic
  const fetchCityData = useCallback(
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
            rows: rowsPerPage,
            page: page + 1,
          },
        };
        const response = await getCityList(body);
        if (response.statusCode === 200) {
          const payload = response.data.rows;
          setCount(response.data.count);
          dispatch(cityAction.storeCity(payload));
        } else if (response.statusCode === 404) {
          const payload = [];
          dispatch(cityAction.storeCity(payload));
        }
      } catch (error) {
        showToast(error.message, false);
      }
    },
    [dispatch, page, rowsPerPage]
  );

  useEffect(() => {
    fetchCityData();
  }, [fetchCityData]);

  const searchCityHandler = async (payload) => {
    try {
      fetchCityData(payload.searchValue);
    } catch (error) {
      showToast(error.message, false);
    }
  };

  const deleteBtnClickHandler = (id) => {
    setDeleteId(id);
    // deleteModalOpen();
    setIsDeleteModalOpen(true);
  };

  const deleteHandler = async () => {
    try {
      const response = await deleteCity(deleteId);
      if (response.statusCode === 200) {
        showToast(response.message, true);
        dispatch(cityAction.removeCity({ id: deleteId }));
        // deleteModalClose();
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
    searchCityHandler,
    // ----
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    emptyRows,
    visibleRows,
    count,
  };
};

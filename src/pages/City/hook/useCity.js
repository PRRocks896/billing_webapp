import { useCallback, useEffect, useMemo, useState } from "react";
import { showToast } from "../../../utils/helper";
import { deleteCity, getCityList } from "../../../service/city";
import { cityAction } from "../../../redux/city";
import { useDispatch, useSelector } from "react-redux";
import useLoader from "../../../hook/useLoader";

export const useCity = () => {
  const dispatch = useDispatch();
  const { loading } = useLoader();
  const cities = useSelector((state) => state.city.data);

  const [deleteId, setDeleteId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // pagination code start
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const visibleRows = useMemo(() => {
    return cities;
  }, [cities]);

  // pagination code end

  //  fetch city logic
  const fetchCityData = useCallback(
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
        console.log("catch");
        showToast(error.message, false);
      } finally {
        loading(false);
      }
    },
    [dispatch, page]
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
    setIsDeleteModalOpen(true);
  };

  const deleteHandler = async () => {
    try {
      setIsDeleteModalOpen(false);
      loading(true);
      const response = await deleteCity(deleteId);
      loading(false);
      if (response.statusCode === 200) {
        showToast(response.message, true);
        dispatch(cityAction.removeCity({ id: deleteId }));
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

  return {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteHandler,
    deleteBtnClickHandler,
    searchCityHandler,
    // ----
    page,
    handleChangePage,
    visibleRows,
    count,
  };
};

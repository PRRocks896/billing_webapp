import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { getServiceCategoryList } from "../../../service/serviceCategory";
import { showToast } from "../../../utils/helper";
import {
  createService,
  getServiceById,
  updateService,
} from "../../../service/service";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useAddEditService = (tag) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const [categoryOptions, setCategoryOptions] = useState([]);
  const { id } = useParams();
  const [serviceCategories, setServiceCategories] = useState([]);
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const { control, setValue, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      amount: "",
      category: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      dispatch(startLoading());
      const payload = {
        name: data.name,
        service_category_id: data.category.value,
        amount: data.amount,
      };

      const response =
        tag === "add"
          ? await createService({ ...payload, createdBy: loggedInUser.id })
          : await updateService({ ...payload, updatedBy: loggedInUser.id }, id);
      if (response.statusCode === 200) {
        showToast(response.message, true);
        navigate("/service");
      } else {
        showToast(response.messageCode, false);
      }
      // if (tag === "add") {
      //   const payload = {
      //     name: data.name,
      //     service_category_id: data.category.value,
      //     amount: data.amount,
      //     createdBy: loggedInUser.id,
      //   };

      //   const response = await createService(payload);

      //   if (response.statusCode === 200) {
      //     showToast(response.message, true);
      //     navigate("/service");
      //   } else {
      //     showToast(response.messageCode, false);
      //   }
      // } else if (tag === "edit") {
      //   const payload = {
      //     name: data.service_name,
      //     service_category_id: data.category.value,
      //     amount: data.amount,
      //     updatedBy: loggedInUser.id,
      //   };

      //   const response = await updateService(payload, id);

      //   if (response.statusCode === 200) {
      //     showToast(response.message, true);
      //     navigate("/service");
      //   } else {
      //     showToast(response.message, false);
      //   }
      // }
    } catch (error) {
      showToast(error.message, false);
    } finally {
      dispatch(stopLoading());
    }
  };

  const cancelHandler = () => {
    navigate("/service");
  };

  const fetchEditServiceData = useCallback(async () => {
    try {
      if (id) {
        dispatch(startLoading());
        const response = await getServiceById(id);
        if (response.statusCode === 200) {
          const category = {
            value: response.data.px_service_category.id,
            label: response.data.px_service_category.name,
          };
          setValue("name", response.data.name);
          setValue("amount", response.data.amount);
          setValue("category", category);
        } else {
          showToast(response.message, false);
        }
      }
    } catch (error) {
      showToast(error.message, false);
    } finally {
      dispatch(stopLoading());
    }
  }, [id, dispatch, setValue]);

  useEffect(() => {
    tag === "edit" && fetchEditServiceData();
  }, [tag, fetchEditServiceData]);

  // gemrate service category options for drop down
  const categoryOptions = useMemo(() => {
    const data = serviceCategories.map((item) => {
      return { value: item.id, label: item.name };
    });
    // setCategoryOptions([...data]);
    return data;
  }, [serviceCategories]);

  useEffect(() => {
    try {
      const fetchServiceCategoryData = async () => {
        const body = {
          where: {
            isActive: true,
            isDeleted: false,
          },
          pagination: {
            sortBy: "createdAt",
            descending: true,
            rows: 1000,
            page: 1,
          },
        };
        const response = await getServiceCategoryList(body);
        if (response.statusCode === 200) {
          const payload = response.data.rows;
          setServiceCategories(payload);
        } else if (response.statusCode === 404) {
          const payload = [];
          setServiceCategories(payload);
        }
      };
      fetchServiceCategoryData();
    } catch (error) {
      showToast(error.message, false);
    }
  }, []);

  return {
    control,
    handleSubmit,
    onSubmit,
    cancelHandler,
    categoryOptions,
  };
};

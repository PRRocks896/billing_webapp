import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getServiceCategoryList } from "../../../service/serviceCategory";
import { serviceCategoryAction } from "../../../redux/serviceCategory";
import { showToast } from "../../../utils/helper";
import { createService, getServiceById } from "../../../service/service";
import { useParams } from "react-router-dom";

export const useAddEditService = (tag) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [categoryOptions, setCategoryOptions] = useState([]);
  const { id } = useParams();
  const serviceSategories = useSelector((state) => state.serviceCategory.data);

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      service_name: "",
      amount: "",
      category: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      if (tag === "add") {
        console.log(data);
        const payload = {
          name: data.service_name,
          service_category_id: data.category.value,
          amount: data.amount,
          createdBy: 1,
        };
        console.log(payload);
        const response = await createService(payload);
        console.log(response);
        if (response.statusCode === 200) {
          showToast(response.message, true);
          navigate(-1);
        } else {
          showToast(response.messageCode, false);
        }
      } else if (tag === "edit") {
        console.log("else for update", data);
      }
    } catch (error) {
      console.log(error);
      showToast(error.message, false);
    }
  };
  console.log(errors);

  const cancelHandler = () => {
    navigate(-1);
  };

  useEffect(() => {
    try {
      const fetchEditServiceData = async () => {
        if (id) {
          console.log("Fetched");
          const response = await getServiceById(id);
          console.warn(response);
          if (response.statusCode === 200) {
            console.log(response.data);
            setValue("service_name", response.data.name);
            setValue("amount", response.data.amount);
            setValue("category", response.data.service_category_id);
          } else {
            showToast(response.message, false);
          }
        }
      };
      fetchEditServiceData();
    } catch (error) {
      console.log(error);
      showToast(error.message, false);
    }
  }, [id, setValue]);

  // gemrate service category options for drop down
  const makeServiceCaytegoryOption = useCallback(() => {
    const data = serviceSategories.map((item) => {
      return { value: item.id, label: item.name };
    });
    setCategoryOptions([...data]);
  }, [serviceSategories]);

  const fetchServiceCategoryData = useCallback(async () => {
    try {
      console.log("fetchServiceCategoryData");
      const body = {
        where: {
          isActive: true,
          isDeleted: false,
        },
        pagination: {
          sortBy: "createdAt",
          descending: true,
          rows: 5,
          page: 1,
        },
      };
      const response = await getServiceCategoryList(body);
      //   console.log(response);
      if (response.statusCode === 200) {
        const payload = response.data.rows;
        dispatch(serviceCategoryAction.storeServiceCategories(payload));
      } else if (response.statusCode === 404) {
        const payload = [];
        dispatch(serviceCategoryAction.storeServiceCategories(payload));
      }
    } catch (error) {
      showToast(error.message, false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (serviceSategories.length === 0) {
      fetchServiceCategoryData();
    }
    makeServiceCaytegoryOption();
  }, [
    fetchServiceCategoryData,
    makeServiceCaytegoryOption,
    serviceSategories.length,
  ]);

  return {
    control,
    handleSubmit,
    onSubmit,
    cancelHandler,
    categoryOptions,
  };
};

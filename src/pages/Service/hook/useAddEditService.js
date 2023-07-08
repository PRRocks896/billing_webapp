import { useEffect, useMemo, useState } from "react";
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
import { useSelector } from "react-redux";

export const useAddEditService = (tag) => {
  const navigate = useNavigate();
  const [categoryOptions, setCategoryOptions] = useState([]);
  const { id } = useParams();
  const [serviceSategories, setServiceSategories] = useState([]);
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const { control, setValue, handleSubmit } = useForm({
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
        const payload = {
          name: data.service_name,
          service_category_id: data.category.value,
          amount: data.amount,
          createdBy: loggedInUser.id,
        };

        const response = await createService(payload);

        if (response.statusCode === 200) {
          showToast(response.message, true);
          navigate(-1);
        } else {
          showToast(response.messageCode, false);
        }
      } else if (tag === "edit") {
        const payload = {
          name: data.service_name,
          service_category_id: data.category.value,
          amount: data.amount,
          updatedBy: loggedInUser.id,
        };

        const response = await updateService(payload, id);

        if (response.statusCode === 200) {
          showToast(response.message, true);
          navigate(-1);
        } else {
          showToast(response.message, false);
        }
      }
    } catch (error) {
      showToast(error.message, false);
    }
  };

  const cancelHandler = () => {
    navigate(-1);
  };

  useEffect(() => {
    try {
      const fetchEditServiceData = async () => {
        if (id) {
          const response = await getServiceById(id);

          if (response.statusCode === 200) {
            const category = {
              value: response.data.px_service_category.id,
              label: response.data.px_service_category.name,
            };
            setValue("service_name", response.data.name);
            setValue("amount", response.data.amount);
            setValue("category", category);
          } else {
            showToast(response.message, false);
          }
        }
      };
      fetchEditServiceData();
    } catch (error) {
      showToast(error.message, false);
    }
  }, [id, setValue]);

  // gemrate service category options for drop down
  useMemo(() => {
    const data = serviceSategories.map((item) => {
      return { value: item.id, label: item.name };
    });
    setCategoryOptions([...data]);
  }, [serviceSategories]);

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
          setServiceSategories(payload);
        } else if (response.statusCode === 404) {
          const payload = [];
          setServiceSategories(payload);
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

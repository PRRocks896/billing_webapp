import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { showToast } from "../../../utils/helper";
import {
  createServiceCategory,
  getServiceCategoryById,
  updateServiceCategory,
} from "../../../service/serviceCategory";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export const useAddEditServiceCategory = (tag) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      service_category: "",
    },
    mode: "onBlur",
  });

  // add - update logic
  const onSubmit = async (data) => {
    try {
      console.log(data);
      if (tag === "add") {
        console.log("add call");
        const payload = { name: data.service_category, createdBy: 1 };
        const response = await createServiceCategory(payload);
        console.log(response);
        if (response.statusCode === 200) {
          showToast(response.message, true);
          navigate(-1);
        } else {
          showToast(response.messageCode, false);
        }
      } else if (tag === "edit") {
        console.log("update call");
        const payload = { name: data.service_category };
        const response = await updateServiceCategory(payload, id);
        console.log(response);
        if (response.statusCode === 200) {
          showToast(response.message, true);
          navigate(-1);
        } else {
          showToast(response.message, false);
        }
      }
    } catch (error) {
      console.log(error);
      showToast(error.message, false);
    }
  };

  useEffect(() => {
    try {
      const fetchEditServiceCategoryData = async () => {
        if (id) {
          const response = await getServiceCategoryById(id);
          console.warn(response);
          if (response.statusCode === 200) {
            console.log(response.data.name);
            setValue("service_category", response.data.name);
          } else {
            showToast(response.message, false);
          }
        }
      };
      fetchEditServiceCategoryData();
    } catch (error) {
      console.log(error);
      showToast(error.message, false);
    }
  }, [id, setValue]);

  // cancel handler and error displaying
  console.log(errors);
  const cancelHandler = () => {
    navigate(-1);
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    cancelHandler,
  };
};

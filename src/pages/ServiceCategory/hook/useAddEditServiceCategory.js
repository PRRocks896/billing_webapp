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
import { useSelector } from "react-redux";

export const useAddEditServiceCategory = (tag) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.loggedInUser);
  console.log(loggedInUser);

  const { setValue, handleSubmit, control } = useForm({
    defaultValues: {
      service_category: "",
    },
    mode: "onBlur",
  });

  // add - update logic
  const onSubmit = async (data) => {
    try {
      if (tag === "add") {
        const payload = {
          name: data.service_category,
          createdBy: loggedInUser.id,
        };
        const response = await createServiceCategory(payload);

        if (response.statusCode === 200) {
          showToast(response.message, true);
          navigate(-1);
        } else {
          showToast(response.messageCode, false);
        }
      } else if (tag === "edit") {
        const payload = {
          name: data.service_category,
          updatedBy: loggedInUser.id,
        };
        const response = await updateServiceCategory(payload, id);

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

  useEffect(() => {
    try {
      const fetchEditServiceCategoryData = async () => {
        if (id) {
          const response = await getServiceCategoryById(id);

          if (response.statusCode === 200) {
            setValue("service_category", response.data.name);
          } else {
            showToast(response.message, false);
          }
        }
      };
      fetchEditServiceCategoryData();
    } catch (error) {
      showToast(error.message, false);
    }
  }, [id, setValue]);

  // cancel handler and error displaying
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

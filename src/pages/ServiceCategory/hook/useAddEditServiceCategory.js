import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { showToast } from "../../../utils/helper";
import { createServiceCategory } from "../../../service/serviceCategory";

export const useAddEditServiceCategory = (tag) => {
  const navigate = useNavigate();

  const {
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
      } else {
        console.log("update call");
      }
    } catch (error) {
      console.log(error);
      showToast(error.message, false);
    }
  };

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

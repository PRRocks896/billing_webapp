import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { createStates } from "../../../service/states";
import { showToast } from "../../../utils/helper";

export const useAddEditStates = (tag) => {
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      stateName: "",
    },
  });
  const onSubmit = async (data) => {
    try {
      if (tag === "add") {
        const payload = { name: data.stateName, createdBy: 1 };
        const response = await createStates(payload);
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

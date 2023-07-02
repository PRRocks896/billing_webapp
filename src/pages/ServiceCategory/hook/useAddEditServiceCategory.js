import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

export const useAddEditServiceCategory = () => {
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
  const onSubmit = (data) => console.log(data);
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

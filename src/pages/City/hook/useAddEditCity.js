import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

export const useAddEditCity = () => {
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

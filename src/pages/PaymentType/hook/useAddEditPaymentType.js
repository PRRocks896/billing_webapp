import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

export const useAddEditPaymentType = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      payment_type: "",
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

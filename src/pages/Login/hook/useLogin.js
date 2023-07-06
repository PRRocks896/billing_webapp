import { useForm } from "react-hook-form";
import { showToast } from "../../../utils/helper";
import { login } from "../../../service/login";

export const useLogin = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    console.log("data", data);
    try {
      const payload = { email: data.email, password: data.password };
      const response = await login(payload);
      if (response.statusCode === 200) {
        const getToken = response.data.token;
        localStorage.setItem("token", getToken);

        showToast(response.message, true);
        // navigate(-1);
      } else {
        showToast(response.messageCode, false);
      }
    } catch (error) {
      console.log(error);
      showToast(error.message, false);
    }
  };

  return {
    control,
    handleSubmit,
    onSubmit,
  };
};

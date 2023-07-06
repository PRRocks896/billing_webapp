import { useForm } from "react-hook-form";
import { setAuthToken, showToast } from "../../../utils/helper";
import { login } from "../../../service/login";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const navigate = useNavigate();

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
    try {
      const payload = { email: data.email, password: data.password };
      const response = await login(payload);
      if (response.statusCode === 200) {
        const authToken = response.data.token;
        setAuthToken(authToken);
        navigate("/", { replace: true });
      } else {
        showToast(response.messageCode, false);
      }
    } catch (error) {
      showToast(error.message, false);
    }
  };

  return {
    control,
    handleSubmit,
    onSubmit,
  };
};

import { useForm } from "react-hook-form";
import { setAuthToken, showToast } from "../../../utils/helper";
import { login } from "../../../service/login";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loggedInUserAction } from "../../../redux/loggedInUser";

const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      login_key: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      let payload;
      if (emailPattern.test(data?.login_key)) {
        payload = { email: data?.login_key, password: data?.password };
      } else {
        payload = { userName: data?.login_key, password: data?.password };
      }
      const response = await login(payload);
      if (response?.statusCode === 200) {
        const authToken = response?.data?.token;
        setAuthToken(authToken);
        dispatch(loggedInUserAction.storeLoggedInUserData(response?.data));
        navigate("/", { replace: true });
      } else {
        showToast(response?.message || response?.messageCode, false);
      }
    } catch (error) {
      showToast(error?.message, false);
    }
  };

  return {
    control,
    handleSubmit,
    onSubmit,
  };
};

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { setAuthToken, showToast } from "../../../utils/helper";
import { loginViaPhone, verifyOTP, login } from "../../../service/login";

import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "../../../redux/loader";
import { loggedInUserAction } from "../../../redux/loggedInUser";

const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const useLogin = () => {
  // const navigate = useNavigate();
  
  const dispatch = useDispatch();

  const [showOTP, setShowOTP] = useState(false);
  const [seconds, setSeconds] = useState(60); // Initial countdown time
  const [canResend, setCanResend] = useState(false);

  const { control, getValues, handleSubmit } = useForm({
    defaultValues: {
      login_key: "",
      password: "",
      // phoneNumber: "",
      // otp: ""
    },
    mode: "onBlur",
  });

  const toggleShowOTP = () => {
    setShowOTP(!showOTP);
  };

  const startTimer = () => {
    setCanResend(false);
    setSeconds(30); // You can set the initial time here
  };

  useEffect(() => {
    let timer;

    if (seconds > 0 && !canResend) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else {
      clearInterval(timer);
      setCanResend(true);
    }

    return () => clearInterval(timer);
  }, [seconds, canResend]);

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
        const isLastDailyReportAdded = response.data.isLastDailyReportAdded;
        localStorage.setItem("latestBillNo", response.data.latestBillNo);
        localStorage.setItem("latestCustomerNo", response.data.latestCustomerNo);
        localStorage.setItem("isLastDailyReportAdded", isLastDailyReportAdded);
        dispatch(loggedInUserAction.storeLoggedInUserData(response?.data));
        window.location.replace('/');
        
        // navigate("/", { replace: true });
      } else {
        showToast(response?.message || response?.messageCode, false);
      }

      // dispatch(startLoading());
      // if (showOTP) {
      //   const payload = {
      //     otp: data.otp,
      //     phoneNumber: data.phoneNumber
      //   };
      //   const response = await verifyOTP(payload);
      //   if (response.statusCode === 200) {
      //     const authToken = response?.data?.token;
      //     setAuthToken(authToken);
      //     const isLastDailyReportAdded = response.data.isLastDailyReportAdded;
      //     localStorage.setItem("latestBillNo", response.data.latestBillNo);
      //     localStorage.setItem("latestCustomerNo", response.data.latestCustomerNo);
      //     localStorage.setItem("isLastDailyReportAdded", isLastDailyReportAdded);
      //     dispatch(loggedInUserAction.storeLoggedInUserData(response?.data));
      //     window.location.replace('/');
      //   } else {
      //     showToast(response?.message || response?.messageCode, false);
      //   }
      // } else {
      //   const payload = {
      //     phoneNumber: data.phoneNumber
      //   };
      //   const response = await loginViaPhone(payload);
      //   if (response && response.success) {
      //     setShowOTP(true);
      //     startTimer();
      //   } else {
      //     showToast(response?.message || response?.messageCode, false);
      //   }
      // }
    } catch (error) {
      showToast(error?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  };

  const resendOtp = async () => {
    try {
      dispatch(startLoading());
      const payload = {
        phoneNumber: getValues('phoneNumber')
      };
      const response = await loginViaPhone(payload);
      if (response.statusCode === 200) {
        // setShowOTP(true);
        startTimer();
      }
    } catch (err) {
      showToast(err?.message, false);
    } finally {
      dispatch(stopLoading())
    }
  };

  return {
    control,
    showOTP,
    seconds,
    canResend,
    onSubmit,
    resendOtp,
    handleSubmit,
    toggleShowOTP
  };
};

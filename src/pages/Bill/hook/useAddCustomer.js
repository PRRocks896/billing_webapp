import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createCustomer } from "../../../service/customer";
import { showToast } from "../../../utils/helper";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useAddCustomer = (
  setIsCustomerModalOpen,
  setCustomerSelectedHandler
) => {
  const dispatch = useDispatch();

  const loggedInUser = useSelector((state) => state.loggedInUser);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      customer_name: "",
      phone: "",
      dob: "",
      gender: "male",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      dispatch(startLoading());
      const payload = {
        userID: loggedInUser.id,
        phoneNumber: data.phone,
        gender: data.gender,
        name: data.customer_name,
        dob: data.dob,
        createdBy: loggedInUser.id,
      };

      const response = await createCustomer(payload);
      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        setIsCustomerModalOpen(false);
        setCustomerSelectedHandler(
          response.data.id,
          payload.phoneNumber,
          payload.name,
          response.data.customerNo
        );
        reset();
      } else {
        showToast(response?.message || response?.messageCode, false);
      }
    } catch (error) {
      showToast(error?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    reset,
  };
};

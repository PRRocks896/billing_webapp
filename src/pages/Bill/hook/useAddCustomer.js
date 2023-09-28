import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
// import { createCustomer } from "../../../service/customer";
import { showToast } from "../../../utils/helper";
import { startLoading, stopLoading } from "../../../redux/loader";
import { Stores, addData } from "../../../utils/db";

export const useAddCustomer = (
  setIsCustomerModalOpen,
  fetchCustomersData,
  setCustomerSelectedHandler
) => {
  const dispatch = useDispatch();

  const loggedInUser = useSelector((state) => state.loggedInUser);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      customer_name: "",
      phone: "",
      gender: "male",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      dispatch(startLoading());

      const inputString = localStorage.getItem("latestCustomerNo");
      const numericPart = inputString.match(/\d+/)[0];
      const incrementedNumericPart = String(Number(numericPart) + 1).padStart(
        numericPart.length,
        "0"
      );
      const resultString = inputString.replace(/\d+/, incrementedNumericPart);
      console.log(resultString);
      const newID = resultString;

      const payload = {
        id: newID,
        userID: loggedInUser.id,
        phoneNumber: data.phone,
        gender: data.gender,
        name: data.customer_name,
        createdBy: loggedInUser.id,
      };
      // const response = await createCustomer(payload);
      const response = await addData(Stores.Customer, {
        ...payload,
        createdAt: new Date().toISOString(),
      });

      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        // await addData(Stores.Customer, response.data);
        localStorage.setItem("latestCustomerNo", newID);
        fetchCustomersData();
        setIsCustomerModalOpen(false);
        setCustomerSelectedHandler(
          response.data.id,
          payload.phoneNumber,
          payload.name,
          response.data.customerNo
        );
        reset();
      } else {
        showToast(response?.messageCode, false);
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

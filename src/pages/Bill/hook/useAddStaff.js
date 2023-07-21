import { useForm } from "react-hook-form";
import { showToast } from "../../../utils/helper";
import { createStaff } from "../../../service/staff";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useAddStaff = (setIsStaffModalOpen, fetchStaffData) => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      staff_name: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      dispatch(startLoading());

      const payload = {
        userID: loggedInUser.id,
        name: data.staff_name,
        createdBy: loggedInUser.id,
      };
      const response = await createStaff(payload);
      if (response.statusCode === 200) {
        showToast(response.message, true);
        setIsStaffModalOpen();
        fetchStaffData();
        reset();
      } else {
        showToast(response.messageCode, false);
      }
    } catch (error) {
      showToast(error.message, false);
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

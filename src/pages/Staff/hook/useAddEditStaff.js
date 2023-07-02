import { useForm } from "react-hook-form";
import { showToast } from "../../../utils/helper";
import { createStaff } from "../../../service/staff";
import { useNavigate } from "react-router";

export const useAddEditStaff = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const payload = { userID: 1, name: data.staff_name, createdBy: 1 };
      console.log(payload);
      const response = await createStaff(payload);
      console.log(response);
      if (response.statusCode === 200) {
        showToast(response.message, true);
        navigate("/staff");
      }
    } catch (error) {
      showToast(error.message, false);
    }
  };
  console.log(errors);

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
  };
};

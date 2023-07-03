import { useForm } from "react-hook-form";
import { showToast } from "../../../utils/helper";
import { createStaff, getStaffById, updateStaff } from "../../../service/staff";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export const useAddEditStaff = (tag) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      staff_name: "",
    },
    mode: "onBlur",
  });

  console.log(errors);

  const onSubmit = async (data) => {
    try {
      console.log(data);
      if (tag === "add") {
        console.log("add call");
        const payload = { userID: 1, name: data.staff_name, createdBy: 1 };
        const response = await createStaff(payload);
        console.log(response);
        if (response.statusCode === 200) {
          showToast(response.message, true);
          navigate(-1);
        }
      } else if (tag === "edit") {
        console.log("update call");
        const payload = { userID: 1, name: data.staff_name, updatedBy: 1 };
        const response = await updateStaff(payload, id);
        console.log(response);
        if (response.statusCode === 200) {
          showToast(response.message, true);
          navigate(-1);
        } else {
          showToast(response.message, false);
        }
      }
    } catch (error) {
      showToast(error.message, false);
    }
  };

  // edit logic - get single record

  useEffect(() => {
    try {
      const fetchEditStaffData = async () => {
        if (id) {
          console.log("Fetched");
          const response = await getStaffById(id);
          console.warn(response);
          if (response.statusCode === 200) {
            console.log(response.data.name);
            setValue("staff_name", response.data.name);
          } else {
            showToast(response.message, false);
          }
        }
      };
      fetchEditStaffData();
    } catch (error) {
      console.log(error);
      showToast(error.message, false);
    }
  }, [id, setValue]);

  return {
    control,
    handleSubmit,
    onSubmit,
  };
};

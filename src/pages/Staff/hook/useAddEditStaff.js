import { useForm } from "react-hook-form";
import { showToast } from "../../../utils/helper";
import { createStaff, getStaffById, updateStaff } from "../../../service/staff";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import useLoader from "../../../hook/useLoader";

export const useAddEditStaff = (tag) => {
  const navigate = useNavigate();
  const { loading } = useLoader();
  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      staff_name: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      loading(true);
      if (tag === "add") {
        const payload = {
          userID: loggedInUser.id,
          name: data.staff_name,
          createdBy: loggedInUser.id,
        };
        const response = await createStaff(payload);
        if (response.statusCode === 200) {
          showToast(response.message, true);
          navigate(-1);
        } else {
          showToast(response.messageCode, false);
        }
      } else if (tag === "edit") {
        const payload = {
          userID: loggedInUser.id,
          name: data.staff_name,
          createdBy: loggedInUser.id,
        };
        const response = await updateStaff(payload, id);

        if (response.statusCode === 200) {
          showToast(response.message, true);
          navigate(-1);
        } else {
          showToast(response.message, false);
        }
      }
    } catch (error) {
      showToast(error.message, false);
    } finally {
      loading(false);
    }
  };

  // edit logic - get single record
  const fetchEditStaffData = useCallback(async () => {
    try {
      loading(true);
      if (id) {
        const response = await getStaffById(id);
        if (response.statusCode === 200) {
          setValue("staff_name", response.data.name);
        } else {
          showToast(response.message, false);
        }
      }
    } catch (error) {
      showToast(error.message, false);
    } finally {
      loading(false);
    }
  }, [id, loading, setValue]);

  useEffect(() => {
    fetchEditStaffData();
  }, [fetchEditStaffData]);

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

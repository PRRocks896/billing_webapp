import { useForm } from "react-hook-form";
import { showToast } from "../../../utils/helper";
import { createStaff, getStaffById, updateStaff } from "../../../service/staff";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useAddEditStaff = (tag) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      dispatch(startLoading());
      if (tag === "add") {
        const payload = {
          userID: loggedInUser.id,
          name: data.staff_name,
          createdBy: loggedInUser.id,
        };
        const response = await createStaff(payload);
        if (response.statusCode === 200) {
          showToast(response.message, true);
          navigate("/staff");
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
          navigate("/staff");
        } else {
          showToast(response.message, false);
        }
      }
    } catch (error) {
      showToast(error.message, false);
    } finally {
      dispatch(stopLoading());
    }
  };

  // edit logic - get single record
  const fetchEditStaffData = useCallback(async () => {
    try {
      dispatch(startLoading());
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
      dispatch(stopLoading());
    }
  }, [id, dispatch, setValue]);

  useEffect(() => {
    fetchEditStaffData();
  }, [fetchEditStaffData]);

  const cancelHandler = () => {
    navigate("/staff");
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    cancelHandler,
  };
};

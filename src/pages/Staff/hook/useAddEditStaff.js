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
      name: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      dispatch(startLoading());
      const payload = {
        userID: loggedInUser.id,
        ...data,
      };
      const response =
        tag === "add"
          ? await createStaff({ ...payload, createdBy: loggedInUser.id })
          : await updateStaff({ ...payload, updatedBy: loggedInUser.id }, id);

      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        navigate("/staff");
      } else {
        showToast(response?.messageCode, false);
      }
    } catch (error) {
      showToast(error?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  };

  // edit logic - get single record
  const fetchEditStaffData = useCallback(async () => {
    try {
      if (id) {
        dispatch(startLoading());
        const response = await getStaffById(id);
        if (response?.statusCode === 200) {
          setValue("name", response.data.name);
        } else {
          showToast(response?.message, false);
        }
      }
    } catch (error) {
      showToast(error?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  }, [id, dispatch, setValue]);

  useEffect(() => {
    tag === "edit" && fetchEditStaffData();
  }, [tag, fetchEditStaffData]);

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

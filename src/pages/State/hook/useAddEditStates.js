import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import {
  createStates,
  getStatesById,
  updateStates,
} from "../../../service/states";
import { showToast } from "../../../utils/helper";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useAddEditStates = (tag) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const { setValue, handleSubmit, control } = useForm({
    defaultValues: {
      name: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      dispatch(startLoading());
      const response =
        tag === "add"
          ? await createStates({ ...data, createdBy: loggedInUser.id })
          : await updateStates({ ...data, updatedBy: loggedInUser.id }, id);
      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        navigate("/states");
      } else {
        showToast(response?.messageCode, false);
      }
    } catch (error) {
      showToast(error?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  };

  const fetchEditStateData = useCallback(async () => {
    try {
      if (id) {
        dispatch(startLoading());
        const response = await getStatesById(id);
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
    tag === "edit" && fetchEditStateData();
  }, [tag, fetchEditStateData]);

  const cancelHandler = () => {
    navigate("/states");
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    cancelHandler,
  };
};

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { showToast } from "../../../utils/helper";
import {
  createServiceCategory,
  getServiceCategoryById,
  updateServiceCategory,
} from "../../../service/serviceCategory";
import { useParams } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useAddEditServiceCategory = (tag) => {
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

  // add - update logic
  const onSubmit = async (data) => {
    try {
      dispatch(startLoading());
      const payload = { ...data };
      const response =
        tag === "add"
          ? await createServiceCategory({
              ...payload,
              createdBy: loggedInUser.id,
            })
          : await updateServiceCategory(
              { ...payload, updatedBy: loggedInUser.id },
              id
            );

      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        navigate("/service-category");
      } else {
        showToast(response?.messageCode, false);
      }
    } catch (error) {
      showToast(error?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  };

  const fetchEditServiceCategoryData = useCallback(async () => {
    try {
      if (id) {
        dispatch(startLoading());
        const response = await getServiceCategoryById(id);
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
    tag === "edit" && fetchEditServiceCategoryData();
  }, [tag, fetchEditServiceCategoryData]);

  // cancel handler and error displaying
  const cancelHandler = () => {
    navigate("/service-category");
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    cancelHandler,
  };
};

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { showToast } from "../../../utils/helper";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createRole, getRoleById, updateRole } from "../../../service/role";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useAddEditRole = (tag) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const { setValue, control, handleSubmit } = useForm({
    defaultValues: {
      name: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      dispatch(startLoading());
      const payload = { ...data };
      const response =
        tag === "add"
          ? await createRole({ ...payload, createdBy: loggedInUser.id })
          : await updateRole({ ...payload, updatedBy: loggedInUser.id }, id);

      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        navigate("/role");
      } else {
        showToast(response?.messageCode, false);
      }
    } catch (error) {
      showToast(error?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  };

  const fetchEditRoleData = useCallback(async () => {
    try {
      if (id) {
        dispatch(startLoading());
        const response = await getRoleById(id);
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
    tag === "edit" && fetchEditRoleData();
  }, [tag, fetchEditRoleData]);

  const cancelHandler = () => {
    navigate("/role");
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    cancelHandler,
  };
};

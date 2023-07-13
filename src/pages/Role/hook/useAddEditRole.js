import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { showToast } from "../../../utils/helper";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import useLoader from "../../../hook/useLoader";
import { createRole, getRoleById, updateRole } from "../../../service/role";

export const useAddEditRole = (tag) => {
  const navigate = useNavigate();
  const { loading } = useLoader();
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
      loading(true);
      if (tag === "add") {
        const payload = { name: data.name, createdBy: loggedInUser.id };
        const response = await createRole(payload);
        if (response.statusCode === 200) {
          showToast(response.message, true);
          navigate(-1);
        } else {
          showToast(response.messageCode, false);
        }
      } else if (tag === "edit") {
        const payload = { name: data.name, updatedBy: loggedInUser.id };
        const response = await updateRole(payload, id);

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

  const fetchEditRoleData = useCallback(async () => {
    try {
      loading(true);
      if (id) {
        const response = await getRoleById(id);

        if (response.statusCode === 200) {
          setValue("name", response.data.name);
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
    fetchEditRoleData();
  }, [fetchEditRoleData]);

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

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
import { useSelector } from "react-redux";
import useLoader from "../../../hook/useLoader";

export const useAddEditStates = (tag) => {
  const navigate = useNavigate();
  const { loading } = useLoader();
  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const { setValue, handleSubmit, control } = useForm({
    defaultValues: {
      stateName: "",
    },
    mode: "onBlur",
  });
  const onSubmit = async (data) => {
    try {
      loading(true);
      if (tag === "add") {
        const payload = { name: data.stateName, createdBy: loggedInUser.id };
        const response = await createStates(payload);
        if (response.statusCode === 200) {
          showToast(response.message, true);
          navigate(-1);
        } else {
          showToast(response.messageCode, false);
        }
      } else if (tag === "edit") {
        const payload = { name: data.stateName, updatedBy: loggedInUser.id };
        const response = await updateStates(payload, id);

        if (response.statusCode === 200) {
          showToast(response.message, true);
          navigate(-1);
        } else {
          showToast(response.message, false);
        }
      }
      loading(false);
    } catch (error) {
      showToast(error.message, false);
    } finally {
      loading(false);
    }
  };

  const fetchEditStateData = useCallback(async () => {
    try {
      if (id) {
        loading(true);
        const response = await getStatesById(id);
        if (response.statusCode === 200) {
          setValue("stateName", response.data.name);
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
    fetchEditStateData();
  }, [fetchEditStateData]);

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

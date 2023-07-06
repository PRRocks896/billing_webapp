import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import {
  createStates,
  getStatesById,
  updateStates,
} from "../../../service/states";
import { showToast } from "../../../utils/helper";
import { useEffect } from "react";

export const useAddEditStates = (tag) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { setValue, handleSubmit, control } = useForm({
    defaultValues: {
      stateName: "",
    },
  });
  const onSubmit = async (data) => {
    try {
      if (tag === "add") {
        const payload = { name: data.stateName, createdBy: 1 };
        const response = await createStates(payload);

        if (response.statusCode === 200) {
          showToast(response.message, true);
          navigate(-1);
        } else {
          showToast(response.messageCode, false);
        }
      } else {
        const payload = { name: data.stateName };
        const response = await updateStates(payload, id);

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

  useEffect(() => {
    try {
      const fetchEditStateData = async () => {
        if (id) {
          const response = await getStatesById(id);

          if (response.statusCode === 200) {
            setValue("stateName", response.data.name);
          } else {
            showToast(response.message, false);
          }
        }
      };
      fetchEditStateData();
    } catch (error) {
      showToast(error.message, false);
    }
  }, [id, setValue]);

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

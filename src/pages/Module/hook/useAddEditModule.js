import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { showToast } from "../../../utils/helper";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createModule,
  getModuleById,
  updateModule,
} from "../../../service/module";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useAddEditModule = (tag) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const { setValue, control, handleSubmit, watch } = useForm({
    defaultValues: {
      name: "",
      path: "",
      icon: "",
    },
    mode: "onBlur",
  });
  const name = watch("name");

  useMemo(() => {
    let path = name.toLowerCase();
    path = path.replace(/\s+/g, "-");
    setValue("path", `/${path}`);
  }, [name, setValue]);

  const onSubmit = async (data) => {
    try {
      dispatch(startLoading());
      if (tag === "add") {
        const payload = {
          name: data.name,
          path: data.path,
          icon: data.icon,
          createdBy: loggedInUser.id,
        };
        const response = await createModule(payload);
        if (response.statusCode === 200) {
          showToast(response.message, true);
          navigate("/module");
        } else {
          showToast(response.messageCode, false);
        }
      } else if (tag === "edit") {
        const payload = {
          name: data.name,
          path: data.path,
          icon: data.icon,
          updatedBy: loggedInUser.id,
        };
        const response = await updateModule(payload, id);

        if (response.statusCode === 200) {
          showToast(response.message, true);
          navigate("/module");
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

  const fetchEditModuleData = useCallback(async () => {
    try {
      dispatch(startLoading());
      if (id) {
        const response = await getModuleById(id);

        if (response.statusCode === 200) {
          setValue("name", response.data.name);
          setValue("path", response.data.path);
          setValue("icon", response.data.icon);
        } else {
          showToast(response.message, false);
        }
      }
    } catch (error) {
      showToast(error.message, false);
    } finally {
      dispatch(stopLoading());
    }
  }, [id, setValue, dispatch]);

  useEffect(() => {
    fetchEditModuleData();
  }, [fetchEditModuleData]);

  const cancelHandler = () => {
    navigate("/module");
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    cancelHandler,
  };
};

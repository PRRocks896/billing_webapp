import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { showToast } from "../../../utils/helper";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import useLoader from "../../../hook/useLoader";
import {
  createModule,
  getModuleById,
  updateModule,
} from "../../../service/module";

export const useAddEditModule = (tag) => {
  const navigate = useNavigate();
  const { loading } = useLoader();
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
      loading(true);
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
          navigate(-1);
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

  const fetchEditModuleData = useCallback(async () => {
    try {
      loading(true);
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
      loading(false);
    }
  }, [id, setValue, loading]);

  useEffect(() => {
    fetchEditModuleData();
  }, []);

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

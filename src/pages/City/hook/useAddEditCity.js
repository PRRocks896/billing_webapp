import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { createCity, getCityById, updateCity } from "../../../service/city";
import { listPayload, showToast } from "../../../utils/helper";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStatesList } from "../../../service/states";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useAddEditCity = (tag) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();
  const [states, setStates] = useState([]);
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const { setValue, handleSubmit, control } = useForm({
    defaultValues: {
      name: "",
      stateID: "",
      description: "",
      image: ""
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      dispatch(startLoading());
      const payload = {...data};
      const formData = new FormData();
      if(tag === "add") {
        formData.append('createdBy', '' + loggedInUser?.id);
      } else {
        formData.append('updatedBy', '' + loggedInUser?.id);
      }
      (Object.keys(data)).forEach(key => {
        if(!['image', 'stateID'].includes(key)) {
          formData.append(key, data[key]);
        }
      });
      if(payload && payload.stateID && typeof payload.stateID === 'object') {
        formData.append('stateID', payload.stateID.value);
      }
      if (payload && payload.image && typeof payload.image === 'object') {
        formData.append('image', payload.image);
      }
      const response =
        tag === "add"
          ? await createCity(formData)
          : await updateCity(formData, id);
      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        navigate("/city");
      } else {
        showToast(response?.messageCode, false);
      }
    } catch (error) {
      showToast(error?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  };

  const fetchEditCityData = useCallback(async () => {
    try {
      if (id) {
        dispatch(startLoading());
        const response = await getCityById(id);
        if (response?.statusCode === 200) {
          setValue("name", response.data.name);
          setValue("stateID", {
            value: response.data.stateID,
            label: response.data.px_state.name,
          });
          setValue("description", response.data.description);
          setValue("image", response.data.image);
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
    tag === "edit" && fetchEditCityData();
  }, [tag, fetchEditCityData]);

  const cancelHandler = () => {
    navigate("/city");
  };

  // gemrate service category options for drop down
  const statesOptions = useMemo(() => {
    const data = states.map((item) => {
      return { value: item.id, label: item.name };
    });
    // setStatesOptions([...data]);
    return data;
  }, [states]);

  useEffect(() => {
    try {
      const fetchStateData = async () => {
        const body = listPayload(0, { isActive: true }, 1000);

        const response = await getStatesList(body);

        if (response?.statusCode === 200) {
          const payload = response?.data?.rows;
          setStates(payload);
        } else if (response?.statusCode === 404) {
          const payload = [];
          setStates(payload);
        }
      };
      fetchStateData();
    } catch (error) {
      showToast(error?.message, false);
    }
  }, []);

  return {
    control,
    handleSubmit,
    onSubmit,
    cancelHandler,
    statesOptions,
  };
};

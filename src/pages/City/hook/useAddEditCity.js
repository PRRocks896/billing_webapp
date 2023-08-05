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
      cityName: "",
      stateId: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      dispatch(startLoading());
      const payload = {
        name: data.cityName,
        stateID: data.stateId.value,
      };
      const response =
        tag === "add"
          ? await createCity({ ...payload, createdBy: loggedInUser.id })
          : await updateCity({ ...payload, updatedBy: loggedInUser.id }, id);
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
          setValue("cityName", response.data.name);
          setValue("stateId", {
            value: response.data.stateID,
            label: response.data.px_state.name,
          });
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

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { createCity, getCityById, updateCity } from "../../../service/city";
import { showToast } from "../../../utils/helper";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStatesList } from "../../../service/states";
import { statesAction } from "../../../redux/states";

export const useAddEditCity = (tag) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [statesOptions, setStatesOptions] = useState([]);
  const states = useSelector((state) => state.states.data);

  const { setValue, handleSubmit, control } = useForm({
    defaultValues: {
      cityName: "",
      stateId: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      if (tag === "add") {
        const payload = {
          name: data.cityName,
          stateID: data.stateId.value,
          createdBy: 1,
        };

        const response = await createCity(payload);

        if (response.statusCode === 200) {
          showToast(response.message, true);
          navigate(-1);
        } else {
          showToast(response.messageCode, false);
        }
      } else if (tag === "edit") {
        const payload = {
          name: data.cityName,
          stateID: data.stateId.value,
          createdBy: 1,
        };

        const response = await updateCity(payload, id);

        if (response.statusCode === 200) {
          showToast(response.message, true);
          navigate(-1);
        } else {
          showToast(response.messageCode, false);
        }
      }
    } catch (error) {
      showToast(error.message, false);
    }
  };

  useEffect(() => {
    try {
      const fetchEditCityData = async () => {
        if (id) {
          const response = await getCityById(id);

          if (response.statusCode === 200) {
            setValue("cityName", response.data.name);
            setValue("stateId", {
              value: response.data.stateID,
              label: response.data.px_state.name,
            });
          } else {
            showToast(response.message, false);
          }
        }
      };
      fetchEditCityData();
    } catch (error) {
      showToast(error.message, false);
    }
  }, [id, setValue]);

  const cancelHandler = () => {
    navigate(-1);
  };

  // gemrate service category options for drop down
  const makeStatesOption = useCallback(() => {
    const data = states.map((item) => {
      return { value: item.id, label: item.name };
    });

    setStatesOptions([...data]);
  }, [states]);

  const fetchStateData = useCallback(async () => {
    try {
      const body = {
        where: {
          isActive: true,
          isDeleted: false,
        },
        pagination: {
          sortBy: "createdAt",
          descending: true,
          rows: 1000,
          page: 1,
        },
      };
      const response = await getStatesList(body);

      if (response.statusCode === 200) {
        const payload = response.data.rows;
        dispatch(statesAction.storeStates(payload));
      } else if (response.statusCode === 404) {
        const payload = [];
        dispatch(statesAction.storeStates(payload));
      }
    } catch (error) {
      showToast(error.message, false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchStateData();
    makeStatesOption();
  }, [fetchStateData, makeStatesOption, states]);

  return {
    control,
    handleSubmit,
    onSubmit,
    cancelHandler,
    statesOptions,
  };
};

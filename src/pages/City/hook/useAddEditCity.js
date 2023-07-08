import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { createCity, getCityById, updateCity } from "../../../service/city";
import { showToast } from "../../../utils/helper";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getStatesList } from "../../../service/states";

export const useAddEditCity = (tag) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [statesOptions, setStatesOptions] = useState([]);
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
      if (tag === "add") {
        const payload = {
          name: data.cityName,
          stateID: data.stateId.value,
          createdBy: loggedInUser.id,
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
          updatedBy: loggedInUser.id,
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
  useMemo(() => {
    const data = states.map((item) => {
      return { value: item.id, label: item.name };
    });
    setStatesOptions([...data]);
  }, [states]);

  useEffect(() => {
    try {
      const fetchStateData = async () => {
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
          setStates(payload);
        } else if (response.statusCode === 404) {
          const payload = [];
          setStates(payload);
        }
      };
      fetchStateData();
    } catch (error) {
      showToast(error.message, false);
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

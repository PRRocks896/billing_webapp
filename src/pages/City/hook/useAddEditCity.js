import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { createCity, getCityById, updateCity } from "../../../service/city";
import { showToast } from "../../../utils/helper";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export const useAddEditCity = (tag) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [options, setOptions] = useState([]);

  // const statesData = useSelector((state) => state.states.data);
  // const statesList = statesData.map((item) => {
  //   return {
  //     id: item.id,
  //     name: item.name,
  //   };
  // });

  // console.log("statesList", statesList);

  const {
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      cityName: "",
      stateId: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      if (tag === "add") {
        const payload = { name: data.cityName, stateID: 1, createdBy: 1 };
        const response = await createCity(payload);

        if (response.statusCode === 200) {
          showToast(response.message, true);
          navigate(-1);
        } else {
          showToast(response.messageCode, false);
        }
      } else {
        const payload = { name: data.cityName, stateID: 1, createdBy: 1 };
        const response = await updateCity(payload, id);

        if (response.statusCode === 200) {
          showToast(response.message, true);
          navigate(-1);
        } else {
          showToast(response.messageCode, false);
        }
      }
    } catch (error) {
      console.log(error);
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
            setValue("stateId", response.data.stateID);
          } else {
            showToast(response.message, false);
          }
        }
      };
      fetchEditCityData();
    } catch (error) {
      console.log(error);
      showToast(error.message, false);
    }
  }, [id, setValue]);

  const cancelHandler = () => {
    navigate(-1);
  };

  return {
    control,
    options,
    handleSubmit,
    onSubmit,
    cancelHandler,
  };
};

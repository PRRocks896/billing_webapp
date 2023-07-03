import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { createCity } from "../../../service/city";
import { showToast } from "../../../utils/helper";
import { useSelector } from "react-redux";

export const useAddEditCity = (tag) => {
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);

  const statesData = useSelector((state) => state.states.data);
  const statesList = statesData.map((item) => {
    return {
      id: item.id,
      name: item.name,
    };
  });

  console.log("statesList", statesList);

  const {
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
        const payload = { name: data.stateName, stateID: 1, createdBy: 1 };
        const response = await createCity(payload);
        console.log(response);
        if (response.statusCode === 200) {
          showToast(response.message, true);
          navigate(-1);
        } else {
          showToast(response.messageCode, false);
        }
      } else {
        console.log("update call");
      }
    } catch (error) {
      console.log(error);
      showToast(error.message, false);
    }
  };
  console.log(errors);

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

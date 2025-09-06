import { useForm } from "react-hook-form";
import { showToast } from "../../../utils/helper";
import { createBikeDetails, getBikeDetailsById, updateBikeDetails } from "../../../service/bikeDetails";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCityByFind } from "../../../service/city";
import { startLoading, stopLoading } from "../../../redux/loader";
import moment from "moment";

export const useAddEditBikeDetails = (tag) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const [cities, setCities] = useState([]);

  const { control, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      userID: loggedInUser.id,
      bikeName: "",
      bikeNumber: "",
      bikeOwnerName: "",
      registerNumber: "",
      cityID: "",
      insuranceNumber: "",
      insurancePolicyDoc: "",
      rcBookDoc: ""
    },
    mode: "onBlur",
  });

  const isAdmin = useMemo(() => {
    if (loggedInUser && ['super admin', 'admin'].includes(loggedInUser.px_role?.name.toLowerCase())) {
      return true;
    }
    return false;
  }, [loggedInUser]);

  const cityOptions = useMemo(() => {
    const data = cities.map((item) => {
      return { value: item.id, label: item.name };
    });
    return data;
  }, [cities]);

  const onSubmit = async (data) => {
    try {
      dispatch(startLoading());
      const payload = { ...data };
      const formData = new FormData();
      if (tag === "add") {
        formData.append('createdBy', '' + loggedInUser?.id);
      } else {
        formData.append('updatedBy', '' + loggedInUser?.id);
      }
      (Object.keys(data)).forEach(key => {
        if (!['rcBookDoc', 'insurancePolicyDoc'].includes(key)) {
          formData.append(key, data[key]);
        }
      });

      if (payload.rcBookDoc && typeof payload.rcBookDoc === "object") {
        formData.append("rcBookDoc", payload.rcBookDoc[0]);
      }

      if (payload.insurancePolicyDoc && typeof payload.insurancePolicyDoc === "object") {
        formData.append("insurancePolicyDoc", payload.insurancePolicyDoc[0]);
      }
      const response = tag === "add" ? await createBikeDetails(formData) : await updateBikeDetails(formData, id);
      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        navigate("/bike-details");
      } else {
        showToast(response?.message, false);
      }
    } catch (error) {
      showToast(error?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  }

  useEffect(() => {
    try {
      const fetchDropDownData = async () => {
        const [
          cityResponse
        ] = await (
          getCityByFind({ isActive: true, isDeleted: false })
        );
        if (cityResponse.statusCode === 200) {
          const payload = cityResponse?.data;
          setCities(payload);
        }
      };
      fetchDropDownData();
    } catch (error) {
      showToast(error.message, false);
    }
  }, []);

  const fetchEdiBikeDetails = useCallback(async () => {
    try {
      if (id) {
        dispatch(startLoading());
        const response = await getBikeDetailsById(id);
        if (response?.statusCode === 200) {
          const data = response.data;
          setValue("userID", data.userID);
          setValue("bikeOwnerName", data.bikeOwnerName);
          setValue("cityID", data.cityID);
          setValue("bikeName", data.bikeName);
          setValue("bikeNumber", data?.bikeNumber)
          setValue("registerNumber", data?.registerNumber);
          setValue("registerDate", moment(new Date(data.registerDate)).format("yyyy-MM-DD"));
          setValue("renewDate", moment(new Date(data.renewDate)).format("yyyy-MM-DD"));
          setValue("insuranceDate", moment(new Date(data.insuranceDate)).format("yyyy-MM-DD"));
          setValue("insuranceNumber", data.insuranceNumber);
          setValue("insuranceRenewDate", moment(new Date(data.insuranceRenewDate)).format("yyyy-MM-DD"));
          setValue("rcBookDoc", [data?.rcBookDoc]);
          setValue("insurancePolicyDoc", [data?.insurancePolicyDoc]);
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
    tag === "edit" && fetchEdiBikeDetails();
    // eslint-disable-next-line
  }, [tag]);

  const cancelHandler = () => {
    navigate("/bike-details");
  };

  return {
    control,
    isAdmin,
    onSubmit,
    getValues,
    handleSubmit,
    cancelHandler,
    cityOptions,
  };
};

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import useLoader from "../../../hook/useLoader";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  createCustomer,
  getCustomerById,
  updateCustomer,
} from "../../../service/customer";
import { showToast } from "../../../utils/helper";
import { useCallback, useEffect } from "react";

export const useAddEditCustomer = (tag) => {
  const navigate = useNavigate();
  const { loading } = useLoader();
  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const { control, setValue, handleSubmit } = useForm({
    defaultValues: {
      customer_name: "",
      phone: "",
      gender: tag === "add" ? "male" : "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      loading(true);
      if (tag === "add") {
        const payload = {
          userID: loggedInUser.id,
          cityID: 1,
          phoneNumber: data.phone,
          gender: data.gender,
          name: data.customer_name,
          createdBy: loggedInUser.id,
        };
        // console.log(payload);
        const response = await createCustomer(payload);
        // console.log("rk", response);
        if (response.statusCode === 200) {
          showToast(response.message, true);
          navigate(-1);
        } else {
          showToast(response.messageCode, false);
        }
      } else if (tag === "edit") {
        const payload = {
          userID: loggedInUser.id,
          cityID: 1,
          phoneNumber: data.phone,
          gender: data.gender,
          name: data.customer_name,
          updatedBy: loggedInUser.id,
        };
        const response = await updateCustomer(payload, id);

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

  const fetchEditCustomerData = useCallback(async () => {
    try {
      loading(true);
      if (id) {
        const response = await getCustomerById(id);
        if (response.statusCode === 200) {
          setValue("customer_name", response.data.name);
          setValue("phone", response.data.phoneNumber);
          setValue("gender", response.data.gender);
        } else {
          showToast(response.message, false);
        }
      }
    } catch (error) {
      showToast(error.message, false);
    } finally {
      loading(false);
    }
  }, [id, loading, setValue]);

  useEffect(() => {
    fetchEditCustomerData();
  }, [fetchEditCustomerData]);

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

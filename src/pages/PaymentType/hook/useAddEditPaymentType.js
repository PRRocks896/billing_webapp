import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import {
  createPaymentType,
  getPaymentTypeById,
  updatePaymentType,
} from "../../../service/paymentType";
import { showToast } from "../../../utils/helper";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import useLoader from "../../../hook/useLoader";

export const useAddEditPaymentType = (tag) => {
  const navigate = useNavigate();
  const { loading } = useLoader();
  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const { setValue, control, handleSubmit } = useForm({
    defaultValues: {
      payment_type: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      loading(true);
      if (tag === "add") {
        const payload = { name: data.payment_type, createdBy: loggedInUser.id };
        const response = await createPaymentType(payload);
        if (response.statusCode === 200) {
          showToast(response.message, true);
          navigate(-1);
        } else {
          showToast(response.messageCode, false);
        }
      } else if (tag === "edit") {
        const payload = { name: data.payment_type, updatedBy: loggedInUser.id };
        const response = await updatePaymentType(payload, id);

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

  const fetchEditPaymentTypeData = useCallback(async () => {
    try {
      loading(true);
      if (id) {
        const response = await getPaymentTypeById(id);
        if (response.statusCode === 200) {
          setValue("payment_type", response.data.name);
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
    fetchEditPaymentTypeData();
  }, [fetchEditPaymentTypeData]);

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

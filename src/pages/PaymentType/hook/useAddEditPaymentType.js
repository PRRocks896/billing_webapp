import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import {
  createPaymentType,
  getPaymentTypeById,
  updatePaymentType,
} from "../../../service/paymentType";
import { showToast } from "../../../utils/helper";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export const useAddEditPaymentType = (tag) => {
  const navigate = useNavigate();
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
    }
  };

  useEffect(() => {
    try {
      const fetchEditPaymentTypeData = async () => {
        if (id) {
          const response = await getPaymentTypeById(id);
          if (response.statusCode === 200) {
            setValue("payment_type", response.data.name);
          } else {
            showToast(response.message, false);
          }
        }
      };
      fetchEditPaymentTypeData();
    } catch (error) {
      showToast(error.message, false);
    }
  }, [id, setValue]);

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

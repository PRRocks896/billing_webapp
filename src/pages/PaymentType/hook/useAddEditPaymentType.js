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
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useAddEditPaymentType = (tag) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const { setValue, control, handleSubmit } = useForm({
    defaultValues: {
      name: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      dispatch(startLoading());
      const response =
        tag === "add"
          ? await createPaymentType({ ...data, createdBy: loggedInUser.id })
          : await updatePaymentType(
              { ...data, updatedBy: loggedInUser.id },
              id
            );
      if (response.statusCode === 200) {
        showToast(response.message, true);
        navigate("/payment-type");
      } else {
        showToast(response.messageCode, false);
      }

      // if (tag === "add") {
      //   const payload = { name: data.payment_type, createdBy: loggedInUser.id };
      //   const response = await createPaymentType(payload);
      //   if (response.statusCode === 200) {
      //     showToast(response.message, true);
      //     navigate("/payment-type");
      //   } else {
      //     showToast(response.messageCode, false);
      //   }
      // } else if (tag === "edit") {
      //   const payload = { name: data.payment_type, updatedBy: loggedInUser.id };
      //   const response = await updatePaymentType(payload, id);

      //   if (response.statusCode === 200) {
      //     showToast(response.message, true);
      //     navigate("/payment-type");
      //   } else {
      //     showToast(response.message, false);
      //   }
      // }
    } catch (error) {
      showToast(error.message, false);
    } finally {
      dispatch(stopLoading());
    }
  };

  const fetchEditPaymentTypeData = useCallback(async () => {
    try {
      if (id) {
        dispatch(startLoading());
        const response = await getPaymentTypeById(id);
        if (response.statusCode === 200) {
          setValue("name", response.data.name);
        } else {
          showToast(response.message, false);
        }
      }
    } catch (error) {
      showToast(error.message, false);
    } finally {
      dispatch(stopLoading());
    }
  }, [id, dispatch, setValue]);

  useEffect(() => {
    tag === "edit" && fetchEditPaymentTypeData();
  }, [tag, fetchEditPaymentTypeData]);

  const cancelHandler = () => {
    navigate("/payment-type");
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    cancelHandler,
  };
};

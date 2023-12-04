import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { showToast } from "../../../utils/helper";
import { useCallback, useEffect } from "react";
import { startLoading, stopLoading } from "../../../redux/loader";
import {
  getCustomerById,
  createCustomer,
  updateCustomer
} from "../../../service/customer";

export const useAddEditCustomer = (tag, flag = 1) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const { control, setValue, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      phoneNumber: "",
      dob: "",
      gender: tag === "add" ? "male" : "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      dispatch(startLoading());
      const payload = {
        userID: loggedInUser.id,
        isActive: true,
        ...data,
      };
      const response = tag === "add" ?
        await createCustomer({ ...payload, createdBy: loggedInUser.id })
      :
        await updateCustomer({ ...payload, updatedBy: loggedInUser.id }, id);
      if (response?.statusCode === 200 && response.success) {
        showToast(response?.messageCode || response?.messageCode, true);
        navigate("/customer");
      } else {
        showToast(response?.messageCode || response?.messageCode, false);
      }
    } catch (error) {
      showToast(error?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  };

  const fetchEditCustomerData = useCallback(async () => {
    try {
      if (id) {
        dispatch(startLoading());
        const response = await getCustomerById(id);
        if (response?.statusCode === 200) {
          setValue("name", response.data.name);
          setValue("phoneNumber", response.data.phoneNumber);
          setValue("gender", response.data.gender);
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
    tag === "edit" && fetchEditCustomerData();
  }, [tag, fetchEditCustomerData]);

  const cancelHandler = () => {
    navigate("/customer");
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    cancelHandler,
  };
};

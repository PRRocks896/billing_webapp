import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { showToast } from "../../../utils/helper";
import { useCallback, useEffect } from "react";
import { startLoading, stopLoading } from "../../../redux/loader";
import {
  Stores,
  addData,
  getSingleData,
  searchPhoneNumber,
  updateData,
} from "../../../utils/db";

const regex = /[a-zA-Z]+.*[0-9]+|[0-9]+.*[a-zA-Z]+/;

export const useAddEditCustomer = (tag, flag = 1) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const { control, setValue, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      phoneNumber: "",
      gender: tag === "add" ? "male" : "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      // dispatch(startLoading());
      const inputString = localStorage.getItem("latestCustomerNo");
      const numericPart = inputString.match(/\d+/)[0];
      const incrementedNumericPart = String(Number(numericPart) + 1).padStart(
        numericPart.length,
        "0"
      );
      const resultString = inputString.replace(/\d+/, incrementedNumericPart);
      const newID = resultString;

      const payload = {
        userID: loggedInUser.id,
        isActive: true,
        ...data,
      };
      if (tag === "add") {
        payload.id = newID;
      }
      const updateId = regex.test(id) ? id : parseInt(id);

      if (tag === "add") {
        const result = await searchPhoneNumber(data.phoneNumber);
        if (result.statusCode === 200) {
          showToast("Customer already exist", false);
          return;
        }
      }

      const response =
        tag === "add"
          ? // ? await createCustomer({ ...payload, createdBy: loggedInUser.id })
            await addData(Stores.Customer, {
              ...payload,
              flag: 0,
              createdBy: loggedInUser.id,
            })
          : // : await updateCustomer(
            //     { ...payload, updatedBy: loggedInUser.id },
            //     id
            //   );
            await updateData(Stores.Customer, updateId, {
              ...payload,
              flag: 1,
              updatedBy: loggedInUser.id,
            });

      if (response?.statusCode === 200) {
        // tag === "add"
        //   ? await addData(Stores.Customer, response.data)
        //   : await updateData(Stores.Customer, +id, payload);
        if (tag === "add") {
          localStorage.setItem("latestCustomerNo", newID);
        }
        showToast(response?.message, true);
        flag === 1 && navigate("/customer");
      } else {
        showToast(response?.messageCode, false);
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
        // const response = await getCustomerById(id);
        const response = await getSingleData(
          Stores.Customer,
          regex.test(id) ? id : parseInt(id)
        );

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

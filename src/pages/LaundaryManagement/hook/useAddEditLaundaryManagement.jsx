import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import { getLaundryItemList } from "../../../service/laundryItem";
import { getLaundryWasherList } from "../../../service/laundryWasher";
import { listPayload, showToast } from "../../../utils/helper";
import {
  createLaundaryManagement,
  updateLaundaryManagement,
  getLaundaryManagementById,
} from "../../../service/LaundaryManagement";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useAddEditLaundryManagement = (tag) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const [staffOption, setStaffOption] = useState([]);
  const [paymentOption, setPaymentOption] = useState([]);
  const [managerOption, setManagerOption] = useState([]);

  const {
    control,
    getValues,
    setValue,
    handleSubmit,
    reset,
    watch,
    // setError,
    clearErrors,
    formState: { isSubmitting, isValid },
  } = useForm({
    defaultValues: {
      userID: "",
      laundryWasherID: "",
      givenDate: new Date(),
      givenManagerID: "",
      detail: [
        {
          laundryItemID: 0,
          price: "",
          givenQty: "",
        },
      ],
      managerName: localStorage.getItem("managerName") || "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      dispatch(startLoading());
      let payload = { ...data };
      if (tag === "add") {
        payload = {
          ...payload,
          createdBy: loggedInUser.id,
        };
      } else {
        payload = {
          ...payload,
          updatedBy: loggedInUser.id,
        };
      }
      const response =
        tag !== "add"
          ? await updateLaundaryManagement(payload, id)
          : await createLaundaryManagement(payload);
      if (response && response.success) {
        showToast(response.message, true);
        navigate("/laundry-management");
      } else {
        showToast(response.message, false);
      }
    } catch (err) {
      showToast(err?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  };

  const fetchEditAdvance = async () => {
    try {
      dispatch(startLoading());
      const { success, message, data } = await getLaundaryManagementById(id);
      if (!success) {
        showToast(message, false);
        return;
      }
      setValue("staffID", data?.staff?.id);
      setValue("paymentID", data?.px_payment_type?.id);
      setValue("date", moment(new Date(data.date)).format("yyyy-MM-DD"));
      setValue("permissionName", data.permissionName);
      setValue("managerID", data?.manager?.id);
      setValue("amount", data.amount);
    } catch (err) {
      showToast(err.message, false);
    } finally {
      dispatch(stopLoading());
    }
  };

  const cancelHandler = () => {
    navigate("/laundry-management");
  };

  useEffect(() => {
    const fetchDropDownList = async () => {
      const whereCondition = {
        isActive: true,
        isDeleted: false,
      };
      const payload = listPayload(0, whereCondition, 100000);
      const [laundryWasherResponse, laundryItemResponse] = await Promise.all([
        getLaundryWasherList(
          listPayload(
            0,
            ["admin", "super admin"].includes(
              loggedInUser?.px_role?.name?.toLowerCase()
            )
              ? { ...whereCondition }
              : { ...whereCondition, createdBy: loggedInUser.id },
            100000
          )
        ),
        getLaundryItemList(payload),
        getLaundryWasherList(
          listPayload(
            0,
            ["admin", "super admin"].includes(
              loggedInUser?.px_role?.name?.toLowerCase()
            )
              ? { ...whereCondition, searchText: "MANAGER" }
              : {
                  ...whereCondition,
                  searchText: "MANAGER",
                  createdBy: loggedInUser.id,
                },
            100000
          )
        ),
      ]);
      if (
        laundryWasherResponse?.statusCode === 200 &&
        laundryWasherResponse?.success
      ) {
        setStaffOption(laundryWasherResponse.data?.rows);
      } else {
        setStaffOption([]);
      }
      if (
        laundryItemResponse?.statusCode === 200 &&
        laundryItemResponse?.success
      ) {
        setPaymentOption(laundryItemResponse.data?.rows);
      } else {
        setPaymentOption([]);
      }
    };
    fetchDropDownList();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    tag === "edit" && fetchEditAdvance();
    // eslint-disable-next-line
  }, [tag]);

  return {
    control,
    staffOption,
    isSubmitting,
    paymentOption,
    managerOption,
    onSubmit,
    handleSubmit,
    cancelHandler,
  };
};

export default useAddEditLaundryManagement;

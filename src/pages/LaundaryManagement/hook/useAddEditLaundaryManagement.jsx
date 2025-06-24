import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import { getLaundryItemDropdownList } from "../../../service/laundryItem";
import { getLaundryWasherDropdownList } from "../../../service/laundryWasher";
import { listPayload, showToast } from "../../../utils/helper";
import {
  bulkCreateLaundaryManagement,
  updateLaundaryManagement,
  getLaundaryManagementById,
} from "../../../service/LaundaryManagement";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useAddEditLaundryManagement = (tag) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const [laundryItemOption, setLaundryItemOption] = useState([]);
  const [laundryWasherOption, setLaundryWasherOption] = useState([]);

  const {
    control,
    formState: { isSubmitting },
    getValues,
    handleSubmit,
  } = useForm({
    defaultValues: {
      userID: "",
      laundryWasherID: "",
      givenDate: moment(new Date()).format('yyyy-MM-DD'),
      givenManagerID: localStorage.getItem("managerId") || "",
      detail: [{
        index: 0,
        laundryItemID: "",
        price: "",
        givenQty: "",
      }],
      managerName: localStorage.getItem("managerName") || "",
    },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    name: "detail",
    control: control,
  });

  const addLaundryItem = () => {
    const index = getValues("detail").length;
    append({
      index: index,
      laundryItemID: "",
      price: "",
      givenQty: "",
    });
  };

  const removeLaundryItem = (index) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      showToast("At least one laundry item is required.", false);
    }
  };

  const isEdit = useMemo(() => {
    return tag === "edit";
  }, [tag]);

  const onSubmit = async (data) => {
    try {
      dispatch(startLoading());
      let payload = { ...data };
      console.log("payload", payload);
      if (tag === "add") {
        payload = {
          ...payload,
          userID: loggedInUser.id,
          createdBy: loggedInUser.id,
          items: payload.detail.map((item) => ({
            laundryItemID: item.laundryItemID,
            price: item.price,
            givenQty: item.givenQty,
          })),
        };
      } else {
        payload = {
          ...payload,
          updatedBy: loggedInUser.id,
          userID: loggedInUser.id,
          laundryItemID: payload.detail[0].laundryItemID,
          price: payload.detail[0].price,
          givenQty: payload.detail[0].givenQty,
        };
      }
      delete payload.detail;
      const response =
        tag !== "add"
          ? await updateLaundaryManagement(payload, id)
          : await bulkCreateLaundaryManagement(payload);
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

  const fetchEditLaundryManagement = async () => {
    try {
      dispatch(startLoading());
      const { success, message, data } = await getLaundaryManagementById(id);
      if (!success) {
        showToast(message, false);
        return;
      }
      // setValue("staffID", data?.staff?.id);
      // setValue("paymentID", data?.px_payment_type?.id);
      // setValue("date", moment(new Date(data.date)).format("yyyy-MM-DD"));
      // setValue("permissionName", data.permissionName);
      // setValue("managerID", data?.manager?.id);
      // setValue("amount", data.amount);
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
      const [
        laundryWasherResponse,
        laundryItemResponse
      ] = await Promise.all([
        getLaundryWasherDropdownList(whereCondition),
        getLaundryItemDropdownList(whereCondition)
      ]);
      if (
        laundryWasherResponse?.statusCode === 200 &&
        laundryWasherResponse?.success
      ) {
        setLaundryWasherOption(laundryWasherResponse.data);
      } else {
        setLaundryWasherOption([]);
      }
      if (
        laundryItemResponse?.statusCode === 200 &&
        laundryItemResponse?.success
      ) {
        setLaundryItemOption(laundryItemResponse.data);
      } else {
        setLaundryItemOption([]);
      }
    };
    fetchDropDownList();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    tag === "edit" && fetchEditLaundryManagement();
    // eslint-disable-next-line
  }, [tag]);

  return {
    isEdit,
    control,
    fields,
    isSubmitting,
    laundryItemOption,
    laundryWasherOption,
    onSubmit,
    handleSubmit,
    cancelHandler,
    addLaundryItem,
    removeLaundryItem,
  };
};

export default useAddEditLaundryManagement;

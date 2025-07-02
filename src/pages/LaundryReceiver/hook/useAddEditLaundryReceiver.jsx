import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createStaff } from "../../../service/staff";
import moment from "moment";

import { getLaundryItemDropdownList } from "../../../service/laundryItem";
import { createLaundryManagementFind } from "../../../service/LaundaryManagement";
import { listPayload, showToast } from "../../../utils/helper";
import {
  bulkCreateLaundryReceiver,
  updateLaundryReceiver,
  getLaundryReceiverById,
} from "../../../service/laundryReceiver";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useAddEditLaundryManagement = (tag) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const [laundryItemOption, setLaundryItemOption] = useState([]);
  const [laundryMenagementOption, setLaundryManagementOption] = useState([]);

  const {
    control,
    formState: { isSubmitting },
    getValues,
    setValue,
    handleSubmit,
  } = useForm({
    defaultValues: {
      userID: "",
      laundryManagementID: "",
      givenDate: moment(new Date()).format('yyyy-MM-DD'),
      receiveDate: moment(new Date()).format('yyyy-MM-DD'),
      receiverManagerID: localStorage.getItem("receiverManagerID") || "",
      detail: [{
        index: 0,
        laundryItemID: "",
        price: "",
        // givenQty: "",
        receiveQty: "",
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
            receiveQty: item.receiveQty,
          })),
        };
      } else {
        payload = {
          ...payload,
          updatedBy: loggedInUser.id,
          userID: loggedInUser.id,
          laundryItemID: payload.detail[0].laundryItemID,
          price: payload.detail[0].price,
          receiveQty: payload.detail[0].receiveQty,
        };
      }
      delete payload.detail;
      
      const response =
        tag !== "add"
          ? await updateLaundryReceiver(payload, id)
          : await bulkCreateLaundryReceiver(payload);
      if (response && response.success) {
        showToast(response.message, true);
        navigate("/laundry-receiver");
      } else {
        showToast(response.message, false);
      }
    } catch (err) {
      showToast(err?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  };

  const fetchEditLaundryReceiver = async () => {
    try {
      dispatch(startLoading());
      const { success, message, data } = await getLaundryReceiverById(id);
      if (!success) {
        showToast(message, false);
        return;
      }
      setValue("userID", data?.userID);
      setValue("laundryManagementID", data?.laundryManagementID);
      setValue("givenDate", moment(new Date(data.givenDate)).format("yyyy-MM-DD"));
      setValue("receiveDate", moment(new Date(data.givenDate)).format("yyyy-MM-DD"));
      setValue("receiverManagerID", data?.managerName?.[0]?.nic || localStorage.getItem("receiverManagerID"));
      setValue("managerName", data?.managerName?.[0]?.nickName || localStorage.getItem("managerName"));
      setValue("detail", [{
        index: 0,
        laundryItemID: data?.laundryItemID,
        price: data?.price,
        receiveQty: data?.receiveQty,
      }]);
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
    navigate("/laundry-receiver");
  };

  useEffect(() => {
    const fetchDropDownList = async () => {
      const whereCondition = {
        isActive: true,
        isDeleted: false,
      };
      const [
        laundryManagementResponse,
        laundryItemResponse
      ] = await Promise.all([
        createLaundryManagementFind(whereCondition),
        getLaundryItemDropdownList(whereCondition)
      ]);
      if (
        laundryManagementResponse?.statusCode === 200 &&
        laundryManagementResponse?.success
      ) {
        setLaundryManagementOption(laundryManagementResponse.data);
      } else {
        setLaundryManagementOption([]);
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
    tag === "edit" && fetchEditLaundryReceiver();
    // eslint-disable-next-line
  }, [tag]);

  return {
    isEdit,
    control,
    fields,
    isSubmitting,
    laundryItemOption,
    laundryMenagementOption,
    onSubmit,
    handleSubmit,
    cancelHandler,
    addLaundryItem,
    removeLaundryItem,
  };
};

export default useAddEditLaundryManagement;

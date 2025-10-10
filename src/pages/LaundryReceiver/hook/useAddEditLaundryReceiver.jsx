import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import { getLaundryItemDropdownList } from "../../../service/laundryItem";
import { getLaundryWasherDropdownList } from "../../../service/laundryWasher";
import { fetchLaundryManagementViaPayload } from "../../../service/LaundaryManagement";
import { showToast } from "../../../utils/helper";
import {
  // bulkCreateLaundryReceiver,
  // updateLaundryReceiver,
  updateBulkReceiver,
  getLaundryReceiverById,
} from "../../../service/laundryReceiver";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useAddEditLaundryManagement = (tag) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const [laundryItemOption, setLaundryItemOption] = useState([]);
  const [laundryWasherOption, setLaundryWasherOption] = useState([]);
  const [laundryManagementOption, setLaundryManagementOption] = useState([]);

  const {
    control,
    formState: { isSubmitting },
    reset,
    watch,
    getValues,
    setValue,
    handleSubmit,
  } = useForm({
    defaultValues: {
      userID: "",
      laundryWasherID: "",
      givenDate: moment(new Date()).format('yyyy-MM-DD'),
      receiveDate: moment(new Date()).format('yyyy-MM-DD'),
      receiverManagerID: localStorage.getItem("managerId") || "",
      detail: [{
        index: 0,
        receiverId: "",
        laundryManagementID: "",
        laundryItemID: "",
        price: "",
        givenQty: "",
        receiveQty: "",
        pendingQty: ""
      }],
      managerName: localStorage.getItem("managerName") || "",
    },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    name: "detail",
    control: control,
  });

  const isAdmin = useMemo(() => {
    if(loggedInUser && loggedInUser.px_role && ['super admin', 'admin'].includes(loggedInUser.px_role.name.toLowerCase())) {
      return true;
    }
    return false;
  }, [loggedInUser]);

  const addLaundryItem = () => {
    const index = getValues("detail").length;
    append({
      index: index,
      laundryManagementID: "",
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
      if(data.receiverManagerID && data.receiverManagerID.length === 0) {
        showToast('Manager is not selected', false);
        return;
      }
      dispatch(startLoading());
      let payload = { ...data };
      // if (tag === "add") {
        payload = {
          // ...payload,
          // userID: loggedInUser.id,
          
          items: payload.detail.map((item) => ({
            receiverID: item.receiverId,
            // laundryManagementID: item.laundryManagementID,
            // laundryItemID: item.laundryItemID,
            receiveQty: item.receiveQty === 0 ? item.givenQty : item.pendingQty ? ((item.givenQty - item.pendingQty) + parseFloat(item.receiveQty)) : item.receiveQty,
            receiveDate: payload.receiveDate,
            receiverManagerID: payload.receiverManagerID,
            updatedBy: loggedInUser.id,
          })),
        };
      // } else {
      //   payload = {
      //     ...payload,
      //     updatedBy: loggedInUser.id,
      //     userID: loggedInUser.id,
      //     laundryManagementID: payload.detail[0].laundryManagementID,
      //     laundryItemID: payload.detail[0].laundryItemID,
      //     receiveQty: payload.detail[0].receiveQty,
      //   };
      // }
      delete payload.detail;
      const response = await updateBulkReceiver(payload);
      if (response && response.success) {
        showToast("Record Updated", true);
        // navigate("/laundry-receiver");
        reset();
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
      setValue("givenDate", moment(new Date(data?.px_laundry_management.givenDate)).format("yyyy-MM-DD"));
      setValue("laundryWasherID", data?.px_laundry_management?.laundryWasherID);
      setValue("receiveDate", moment(new Date(data.receiveDate)).format("yyyy-MM-DD"));
      setValue("receiverManagerID", data?.receiverManagerID || localStorage.getItem("managerId"));
      // setValue("managerName", data?.managerName?.[0]?.nickName || localStorage.getItem("managerName"));
      setValue("detail", [{
        index: 0,
        receiverId: data.receiverId,
        laundryManagementID: data?.laundryManagementID,
        laundryItemID: data?.laundryItemID,
        price: data?.px_laundry_management?.price,
        receiveQty: data?.receiveQty,
        givenQty: data?.px_laundry_management?.givenQty,
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

  const fetchLaundryManagementRecords = async () => {
    try {
      dispatch(startLoading());
      const payload = {
        userID: loggedInUser.id,
        isActive: true,
        isDeleted: false,
        // searchText: "",
        laundryWasherID: getValues('laundryWasherID'),
        givenDate: getValues('givenDate'),
      };
      const response = await fetchLaundryManagementViaPayload(payload);
      if (response && response.success) {
        if (response.data.length === 0) {
          showToast("No laundry management records found for the selected date and washer.", false);
          return;
        }
        setLaundryManagementOption(response.data);
        setValue("detail", response.data.map((item, index) => ({
          index: index,
          receiverId: item.receiverId,
          laundryManagementID: item.id,
          laundryItemID: item.laundryItemID,
          price: item.price,
          givenQty: item.givenQty,
          receiveQty: item.pendingQty === 0 ? 0 : '',
          pendingQty: item.pendingQty
        })));
      } else {
        setLaundryManagementOption([]);
      }
    } catch (err) {
      showToast(err.message, false);
    } finally {
      dispatch(stopLoading());
    }
  }

  useEffect(() => {
    if(tag === "add" && watch('givenDate') && watch('laundryWasherID')) {
      fetchLaundryManagementRecords();
    }
    // eslint-disable-next-line
  }, [tag, watch('givenDate'), watch('laundryWasherID')]);

  useEffect(() => {
    const fetchDropDownList = async () => {
      let whereCondition = {
        isActive: true,
        isDeleted: false,
      };
      const [
        laundryWasherResponse,
        laundryItemResponse
      ] = await Promise.all([
        getLaundryWasherDropdownList(isAdmin ? whereCondition : {
          ...whereCondition,
          createdBy: loggedInUser.id
        }),
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
  }, [isAdmin]);

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
    laundryWasherOption,
    laundryManagementOption,
    onSubmit,
    handleSubmit,
    cancelHandler,
    addLaundryItem,
    removeLaundryItem,
  };
};

export default useAddEditLaundryManagement;

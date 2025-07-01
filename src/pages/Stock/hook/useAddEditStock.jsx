import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { createMaterialDropdown } from "../../../service/material";
import { showToast } from "../../../utils/helper";
import { bulkcreateStock, updateStock, getStockById } from "../../../service/stock";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useAddEditLaundryManagement = (tag) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const [materialOption, setMaterialOption] = useState([]);

  const {
    control,
    formState: { isSubmitting },
    getValues,
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      userID: "",
      detail: [
        {
          index: 0,
          materialID: "",
          qty: "",
        },
      ],
    },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    name: "detail",
    control: control,
  });

  const addStock = () => {
    const index = getValues("detail").length;
    append({
      index: index,
      materialID: "",
      qty: "",
    });
  };

  const removeStock = (index) => {
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
      if (tag === "add") {
        payload = {
          ...payload,
          userID: loggedInUser.id,
          createdBy: loggedInUser.id,
          items: payload.detail.map((item) => ({
            materialID: item.materialID,
            qty: item.qty,
          })),
        };
      } else {
        payload = {
          ...payload,
          updatedBy: loggedInUser.id,
          userID: loggedInUser.id,
          materialID: payload.detail[0].materialID,
          qty: payload.detail[0].qty,
        };
      }
      delete payload.detail;
      const response =
        tag !== "add"
          ? await updateStock(payload, id)
          : await bulkcreateStock(payload);
      if (response && response.success) {
        showToast(response.message, true);
        navigate("/stock");
      } else {
        showToast(response.message, false);
      }
    } catch (err) {
      showToast(err?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  };

  const fetchEditStock = async () => {
    try {
      dispatch(startLoading());
      const { success, message, data } = await getStockById(id);
      if (!success) {
        showToast(message, false);
        return;
      }
      setValue("userID", data?.userID);
      setValue("detail", [
        {
          index: 0,
          materialID: data?.materialID,
          qty: data?.qty,
        },
      ]);
    } catch (err) {
      showToast(err.message, false);
    } finally {
      dispatch(stopLoading());
    }
  };

  const cancelHandler = () => {
    navigate("/stock");
  };

  useEffect(() => {
    const fetchDropDownList = async () => {
      const whereCondition = {
        isActive: true,
        isDeleted: false,
      };
      const [materialResponse] = await Promise.all([
        createMaterialDropdown(whereCondition),
      ]);
      if (materialResponse?.statusCode === 200 && materialResponse?.success) {
        setMaterialOption(materialResponse.data);
      } else {
        setMaterialOption([]);
      }
    };
    fetchDropDownList();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    tag === "edit" && fetchEditStock();
    // eslint-disable-next-line
  }, [tag]);

  return {
    isEdit,
    control,
    fields,
    isSubmitting,
    materialOption,
    onSubmit,
    handleSubmit,
    cancelHandler,
    addStock,
    removeStock,
  };
};

export default useAddEditLaundryManagement;

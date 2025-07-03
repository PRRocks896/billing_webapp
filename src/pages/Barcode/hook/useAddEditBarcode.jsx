import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { showToast } from "../../../utils/helper";
import { startLoading, stopLoading } from "../../../redux/loader";
import {
  createBarcode,
  updateBarcode,
  getBarcodeById,
} from "../../../service/barcodeService";

const useAddEditBarcode = (tag) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const { setValue, control, handleSubmit } = useForm({
    defaultValues: {
      userID: "",
      barcode: "",
      out: "true",
      in: "false",
      receiverID: "4",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      dispatch(startLoading());
      const payload = { ...data };
      const response =
        tag === "add"
          ? await createBarcode({ ...payload, createdBy: loggedInUser.id })
          : await updateBarcode({ ...payload, updatedBy: loggedInUser.id }, id);

      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        navigate("/Barcode");
      } else {
        showToast(response?.messageCode, false);
      }
    } catch (error) {
      showToast(error?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  };

  const fetchEditBarcodeData = useCallback(async () => {
    try {
      if (id) {
        dispatch(startLoading());
        const response = await getBarcodeById(id);
        if (response?.statusCode === 200) {
          setValue("userID", response.data.userID);
          setValue("barcode", response.data.barcode);
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
    tag === "edit" && fetchEditBarcodeData();
  }, [tag, fetchEditBarcodeData]);

  const cancelHandler = () => {
    navigate("/Barcode");
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    cancelHandler,
  };
};

export default useAddEditBarcode;

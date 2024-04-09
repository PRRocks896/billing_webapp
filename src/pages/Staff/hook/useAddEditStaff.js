import { useForm } from "react-hook-form";
import { showToast } from "../../../utils/helper";
import { createStaff, getStaffById, updateStaff } from "../../../service/staff";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "../../../redux/loader";

import {
  getEmployeeTypePayload
} from "../../../service/employeeType";

export const useAddEditStaff = (tag) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const [employeeTypeList, setEmployeeTypeList] = useState([]);

  const { control, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      employeeTypeID: "",
      name: "",
      nickName: "",
      phoneNumber: "",
      fatherName: "",
      fatherPhone: "",
      salary: "",
      pastWorking: "",
      experience: "",
      localAddress: "",
      permanentAddress: "",
      accountHolderName: "",
      accountNumber: "",
      reEnterAccountNumber: "",
      ifscCode: "",
      accountType: "saving",
      refName: "",
      refPhone: ""
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      dispatch(startLoading());
      const payload = {
        ...data,
        userID: loggedInUser.id,
        refName: data && data.refName && data.refName.length > 0 ? data.refName : null,
        refPhone: data && data.refPhone && data.refPhone.length > 0 ? data.refPhone : null
      };
      
      const response =
        tag === "add"
          ? await createStaff({ ...payload, createdBy: loggedInUser.id })
          : await updateStaff({ ...payload, updatedBy: loggedInUser.id }, id);

      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        navigate("/staff");
      } else {
        showToast(response?.messageCode, false);
      }
    } catch (error) {
      showToast(error?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  };

  const fetchEmployeeType = useCallback(async () => {
    try {
      dispatch(startLoading());
      const response = await getEmployeeTypePayload({isActive: true, isDeleted: false});
      if(response.success) {
          setEmployeeTypeList(response.data);
      } else {
          showToast(response?.message, false)    
      }
    } catch(err) {
      showToast(err?.message, false)
    } finally {
      dispatch(stopLoading());
    }
    // eslint-disable-next-line
  }, []);


  // edit logic - get single record
  const fetchEditStaffData = useCallback(async () => {
    try {
      if (id) {
        dispatch(startLoading());
        const response = await getStaffById(id);
        if (response?.statusCode === 200) {
          setValue("name", response.data.name);
          setValue("employeeTypeID", response.data.employeeTypeID);
          setValue("nickName", response.data.nickName);
          setValue("phoneNumber", response.data.phoneNumber);
          setValue("fatherName", response.data.fatherName);
          setValue("fatherPhone", response.data.fatherPhone);
          setValue("salary", response.data.salary);
          setValue("pastWorking", response.data.pastWorking);
          setValue("experience", response.data.experience);
          setValue("localAddress", response.data.localAddress);
          setValue("permanentAddress", response.data.permanentAddress);
          setValue("accountHolderName", response.data.accountHolderName);
          setValue("accountNumber", response.data.accountNumber);
          setValue("reEnterAccountNumber", response.data.accountNumber);
          setValue("ifscCode", response.data.ifscCode);
          setValue("accountType", response.data.accountType);
          setValue("refName", response.data.refName);
          setValue("refPhone", response.data.refPhone);
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
    fetchEmployeeType();
    tag === "edit" && fetchEditStaffData();
    // eslint-disable-next-line
  }, [tag, fetchEditStaffData, fetchEmployeeType]);

  const cancelHandler = () => {
    navigate("/staff");
  };

  return {
    control,
    employeeTypeList,
    onSubmit,
    getValues,
    handleSubmit,
    cancelHandler,
  };
};

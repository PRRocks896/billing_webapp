import { useForm } from "react-hook-form";
import { listPayload, showToast } from "../../../utils/helper";
import { sendOtp, verifyOtp, createStaff, getStaffById, updateStaff } from "../../../service/staff";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "../../../redux/loader";

import {
  getEmployeeTypePayload
} from "../../../service/employeeType";
import { getUserList } from "../../../service/users";

export const useAddEditStaff = (tag) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const [employeeTypeList, setEmployeeTypeList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [isShowBankDetail, setIsShowBankDetail] = useState(true);

  const [verifiedOtp, setVerifiedOtp] = useState(false);
  const [openVerifyOtpModal, setOpenVerifyOtpModal] = useState(false);

  const { control, handleSubmit, setValue, getValues, formState: { dirtyFields } } = useForm({
    defaultValues: {
      userID: loggedInUser.id,
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

  const isAdmin = useMemo(() => {
    if(loggedInUser && ['super admin', 'admin'].includes(loggedInUser.px_role?.name.toLowerCase())) {
      return true;
    }
    return false;
  }, [loggedInUser]);

  const isEditByBranch = useMemo(() => {
    if(id && !isAdmin) {
      return true;
    }
    return false;
  }, [id, isAdmin]);

  const onSubmit = async (data) => {
    try {
      dispatch(startLoading());
      let payload = {
        ...data,
        userID: isAdmin ? data.userID : loggedInUser.id,
        createdBy: isAdmin ? data.userID : loggedInUser.id,
        refName: data && data.refName && data.refName.length > 0 ? data.refName : null,
        refPhone: data && data.refPhone && data.refPhone.length > 0 ? data.refPhone : null,
        accountType: data && data.accountType && data.accountType.length > 0 ? data.accountType : null,
        accountNumber: data && data.accountNumber && data.accountNumber.length > 0 ? data.accountNumber : null,
        accountHolderName: data && data.accountHolderName && data.accountHolderName.length > 0 ? data.accountHolderName : null,
        ifscCode: data && data.ifscCode && data.ifscCode.length > 0 ? data.ifscCode : null,
      };

      if(tag !== "add" && (dirtyFields.accountHolderName || dirtyFields.accountNumber || dirtyFields.accountType || dirtyFields.ifscCode)) {
        payload = {
          ...payload,
          passbookPhoto: null
        }
      }
      
      const response =
        tag === "add"
          ? await createStaff({ ...payload, createdBy: isAdmin ? data.userID : loggedInUser.id })
          : await updateStaff({ ...payload, updatedBy: loggedInUser.id }, id);

      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        navigate("/staff");
      } else {
        setVerifiedOtp(false);
        showToast(response?.message || response?.messageCode, false);
      }
    } catch (error) {
      setVerifiedOtp(false);
      showToast(error?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  };

  const handleSendOtp = async (info) => {
    try {
      dispatch(startLoading());
      const {success, message} = await sendOtp({
        staffName: `${info.name} (${employeeTypeList.find((item) => item.id === parseInt(info.employeeTypeID))?.name}), Salary: ${info.salary}`,
        branchName: `${loggedInUser.lastName}`
      });
      if (success) {
        setOpenVerifyOtpModal(true);
      } else {
        showToast(message, false);
      }
    } catch(err) {
      showToast(err?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  }

  const handleVerifyOtp = async (otp) => {
    try {
      dispatch(startLoading());
      const { success, message } = await verifyOtp({
        otp
      });
      if(success) {
        setVerifiedOtp(true);
        setOpenVerifyOtpModal(false);
        onSubmit(getValues());
        showToast(message);
      } else {
        showToast(message, false);
      }
    } catch(err) {
      showToast(err?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  }

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

  useEffect(() => {
    if(isAdmin) {
    (async () => {
      const body = listPayload(0, {}, 1000);
      const {success, data} = await getUserList(body);
      if(success) {
        setBranchList(data.rows?.filter((item) => item.roleID !== 1));
      } else {
        setBranchList([]);
      }
    })();
    }
  }, [isAdmin]);

  // edit logic - get single record
  const fetchEditStaffData = useCallback(async () => {
    try {
      if (id) {
        dispatch(startLoading());
        const response = await getStaffById(id);
        if (response?.statusCode === 200) {
          setValue("userID", response.data.userID);
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
    isAdmin,
    branchList,
    verifiedOtp,
    isEditByBranch,
    isShowBankDetail,
    employeeTypeList,
    openVerifyOtpModal,
    onSubmit,
    getValues,
    handleSubmit,
    cancelHandler,
    handleSendOtp,
    setVerifiedOtp,
    handleVerifyOtp,
    setIsShowBankDetail,
    setOpenVerifyOtpModal,
  };
};

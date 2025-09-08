import { useForm } from "react-hook-form";
import { listPayload, showToast, countries } from "../../../utils/helper";
import { createLaundryWasher, getLaundryWasher, UpdateLaundryWasher } from "../../../service/laundryWasher";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "../../../redux/loader";

import {
  getEmployeeTypePayload
} from "../../../service/employeeType";
import { getUserList } from "../../../service/users";

export const useAddEditLaundryWasher = (tag) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const [employeeTypeList, setEmployeeTypeList] = useState([]);
  const [laundryWasherList, setLaundryWasherList] = useState([]);


  const [openVerifyOtpModal] = useState(false);
  const [isStaffNoOtpSend ] = useState(false);

  const countryCodeList = useMemo(() => {
    return countries?.map((country) => {
      return {
        label: `${country.phone} (${country.label})`,
        value: country.phone.split('+')[1]
      }
    })
  }, [countries]);

  const { control, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      userID: loggedInUser.id,
      name: "",
      countryCode: "",
      phoneNumber: "",
      address: ""
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
      };
      
      const response =
        tag === "add"
          ? await createLaundryWasher({ ...payload, createdBy: isAdmin ? data.userID : loggedInUser.id })
          : await UpdateLaundryWasher({ ...payload, updatedBy: loggedInUser.id }, id);

      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        navigate("/laundry-washer");
      } else {
        showToast(response?.message || response?.messageCode, false);
      }
    } catch (error) {
      showToast(error?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  };

  
  const fetchLaundryWasherType = useCallback(async () => {
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
        setLaundryWasherList(data.rows?.filter((item) => item.roleID !== 1));
      } else {
        setLaundryWasherList([]);
      }
    })();
    }
  }, [isAdmin]);

  // edit logic - get single record
  const fetchEditLaundryWasherData = useCallback(async () => {
    try {
      if (id) {
        dispatch(startLoading());
        const response = await getLaundryWasher(id);
        if (response?.statusCode === 200) {
          setValue("userID", response.data.userID);
          setValue("name", response.data.name);
          setValue("countryCode", response.data.countryCode);
          setValue("phoneNumber", response.data.phoneNumber);
          setValue("address", response.data.address);
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
    fetchLaundryWasherType();
    tag === "edit" && fetchEditLaundryWasherData();
    // eslint-disable-next-line
  }, [tag, fetchEditLaundryWasherData, fetchLaundryWasherType]);

  const cancelHandler = () => {
    navigate("/laundry-washer");
  };

  return {
    control,
    isAdmin,
    countryCodeList,
    laundryWasherList,
    isEditByBranch,
    employeeTypeList,
    isStaffNoOtpSend,
    openVerifyOtpModal,
    onSubmit,
    getValues,
    handleSubmit,
    cancelHandler,
  };
};

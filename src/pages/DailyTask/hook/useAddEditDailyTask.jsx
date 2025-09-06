import { useForm } from "react-hook-form";
import { listPayload, showToast } from "../../../utils/helper";
import { createDailyTask, updateDailyTask, getDailyTaskById } from "../../../service/dailyTask";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "../../../redux/loader";
import { getStaffList } from "../../../service/staff";

import { getUserList } from "../../../service/users";

export const useAddEditDailyTask = (tag) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const [branchList, setBranchList] = useState([]);
  const [staffOption, setStaffOption] = useState([]);


  const { control, handleSubmit, setValue, getValues, } = useForm({
    defaultValues: {
      userID: loggedInUser.id,
      branchID: "",
      supervisorID: "",
      note: "",
      photo: "",
      status: "",
    },
    mode: "onBlur",
  });

  const isAdmin = useMemo(() => {
    if (loggedInUser && loggedInUser.px_role && loggedInUser.px_role.name === 'Admin') {
      return true;
    }
    return false;
  }, [loggedInUser]);

  const isEditByBranch = useMemo(() => {
    if (id && !isAdmin) {
      return true;
    }
    return false;
  }, [id, isAdmin]);

  const onSubmit = async (data) => {
    try {
      dispatch(startLoading());
      const payload = { ...data };
      const formData = new FormData();
      if (tag === "add") {
        formData.append('createdBy', '' + loggedInUser?.id);
      } else {
        formData.append('updatedBy', '' + loggedInUser?.id);
      }
      (Object.keys(data)).forEach(key => {
        if (!['photo'].includes(key)) {
          formData.append(key, data[key]);
        }
      });
      if (payload && payload.photo && typeof payload.photo === 'object') {
        formData.append('photo', payload.photo[0]);
      }
      const response = tag === "add" ? await createDailyTask(formData) : await updateDailyTask(formData, id);
      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        navigate("/daily-task");
      } else {
        showToast(response?.message, false);
      }
    } catch (error) {
      showToast(error?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  }

  const fetchEdiDailyTaskDetails = useCallback(async () => {
    try {
      if (id) {
        dispatch(startLoading());
        const response = await getDailyTaskById(id);
        if (response?.statusCode === 200) {
          const data = response.data;
          setValue("userID", data.userID);
          setValue("branchID", data.branchID);
          setValue("supervisorID", data.supervisorID);
          setValue("note", data.note);
          setValue("status", data.status);
          setValue("photo", [data?.photo]);
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
    tag === "edit" && fetchEdiDailyTaskDetails();
    // eslint-disable-next-line
  }, [tag]);

  const fetchBranchList = useCallback(async () => {
    try {
      dispatch(startLoading());
      const response = await getUserList(listPayload(0, { isActive: true, isDeleted: false }, 1000));
      if (response?.statusCode === 200) {
        const payload = response?.data?.rows;
        const branchOption = payload.filter(item => item.roleID !== 1);
        setBranchList(branchOption);
      } else {
        showToast(response?.message, false);
      }
    } catch (error) {
      showToast(error?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  }, [dispatch]);

  useEffect(() => {
    // if (isAdmin) {
    fetchBranchList()
    // }
  }, [fetchBranchList])


  useEffect(() => {
    const fetchDropDownList = async () => {
      const whereCondition = {
        isActive: true,
        isDeleted: false
      };
      const [
        staffResponse,
      ] = await Promise.all([
        getStaffList(listPayload(0, ['admin', 'super admin'].includes(loggedInUser?.px_role?.name?.toLowerCase()) ? { ...whereCondition } : { ...whereCondition, createdBy: loggedInUser.id }, 100000)),
        getStaffList(listPayload(0, ['admin', 'super admin'].includes(loggedInUser?.px_role?.name?.toLowerCase()) ? { ...whereCondition, searchText: "MANAGER" } : { ...whereCondition, searchText: "MANAGER", createdBy: loggedInUser.id }, 100000))
      ]);
      if (staffResponse?.statusCode === 200 && staffResponse?.success) {
        setStaffOption(staffResponse.data?.rows);
      } else {
        setStaffOption([]);
      }
    }
    fetchDropDownList();
    // eslint-disable-next-line
  }, []);


  const cancelHandler = () => {
    navigate("/daily-task");
  };

  return {
    control,
    isAdmin,
    branchList,
    isEditByBranch,
    onSubmit,
    getValues,
    handleSubmit,
    cancelHandler,
    staffOption,
  };
};

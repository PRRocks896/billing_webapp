import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { listPayload, showToast } from "../../../utils/helper";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createUser, getUserById } from "../../../service/users";
import { getRolesList } from "../../../service/roles";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useAddEditUser = (tag) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const [roleOptions, setRoleOptions] = useState([]);
  const [roles, setRoles] = useState([]);

  const { setValue, handleSubmit, control, watch } = useForm({
    defaultValues: {
      roleID: "",
      firstName: "",
      lastName: "",
      branchName: "",
      userName: "",
      password: "",
      phoneNumber: "",
      email: "",
    },
    mode: "onBlur",
  });

  useMemo(() => {
    setValue("branchName", loggedInUser?.branchName);
  }, [loggedInUser, setValue]);

  const firstName = watch("firstName");
  const lastName = watch("lastName");
  useMemo(() => {
    const formattedFirstName =
      firstName.charAt(0).toUpperCase() + firstName.slice(1);
    const formattedLastName =
      lastName.charAt(0).toUpperCase() + lastName.slice(1);

    const newUserName = formattedFirstName + formattedLastName;
    setValue("userName", newUserName.replace(/\s+/g, ""));
  }, [firstName, lastName, setValue]);

  // genrate roles options for drop down
  useMemo(() => {
    const data = roles.map((item) => {
      return { value: item.id, label: item.name };
    });
    setRoleOptions([...data]);
  }, [roles]);

  // get role list
  useEffect(() => {
    try {
      const fetchRolesData = async () => {
        const body = listPayload(0, { isActive: true }, 1000);
        const response = await getRolesList(body);

        if (response.statusCode === 200) {
          const payload = response.data.rows;
          setRoles(payload);
        } else if (response.statusCode === 404) {
          const payload = [];
          setRoles(payload);
        }
      };
      fetchRolesData();
    } catch (error) {
      showToast(error.message, false);
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      dispatch(startLoading());
      if (tag === "add") {
        const payload = {
          roleID: data.roleID.value,
          firstName: data.firstName,
          lastName: data.lastName,
          branchName: data.branchName,
          userName: data.userName,
          password: data.password,
          phoneNumber: data.phoneNumber,
          email: data.email,
          createdBy: loggedInUser.id,
        };
        const response = await createUser(payload);
        if (response.statusCode === 200) {
          showToast(response.message, true);
          navigate(-1);
        } else {
          showToast(response.messageCode, false);
        }
      }
      dispatch(stopLoading());
    } catch (error) {
      showToast(error.message, false);
    } finally {
      dispatch(stopLoading());
    }
  };

  const fetchEditUserData = useCallback(async () => {
    try {
      if (id) {
        dispatch(startLoading());
        const response = await getUserById(id);
        if (response.statusCode === 200) {
          const role = {
            value: response.data.roleID,
            label: response.data.px_role.name,
          };

          setValue("firstName", response.data.firstName);
          setValue("lastName", response.data.lastName);
          setValue("userName", response.data.userName);
          setValue("roleID", role);
          // setValue("password", response.data.password);
          setValue("email", response.data.email);
          setValue("phoneNumber", response.data.phoneNumber);
        } else {
          showToast(response.message, false);
        }
      }
    } catch (error) {
      showToast(error.message, false);
    } finally {
      dispatch(stopLoading());
    }
  }, [id, dispatch, setValue]);

  useEffect(() => {
    fetchEditUserData();
  }, [fetchEditUserData]);

  const cancelHandler = () => {
    navigate(-1);
  };

  return {
    control,
    roleOptions,
    handleSubmit,
    onSubmit,
    cancelHandler,
    role: loggedInUser.px_role.name.toLowerCase(),
  };
};

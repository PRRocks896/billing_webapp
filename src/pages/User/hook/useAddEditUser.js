import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { listPayload, showToast } from "../../../utils/helper";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createUser, getUserById, updateUser } from "../../../service/users";
import { getRolesList } from "../../../service/roles";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useAddEditUser = (tag) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const [roles, setRoles] = useState([]);
  const [isNotAdmin, setIsNotAdmin] = useState(true);

  const { setValue, handleSubmit, control, watch } = useForm({
    defaultValues: {
      roleID: "",
      firstName: "",
      lastName: "",
      branchName: "",
      userName: "",
      password: "",
      billCode: "",
      billName: "",
      phoneNumber: "",
      phoneNumberSecond: "",
      address: "",
      email: "",
    },
    mode: "onBlur",
  });

  useMemo(() => {
    tag === "add" && setValue("branchName", loggedInUser?.branchName);
  }, [loggedInUser?.branchName, setValue, tag]);

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
  const roleOptions = useMemo(() => {
    const data = roles.map((item) => {
      return { value: item.id, label: item.name };
    });
    // setRoleOptions([...data]);
    return data;
  }, [roles]);

  // get role list
  useEffect(() => {
    try {
      const fetchRolesData = async () => {
        const body = listPayload(0, { isActive: true }, 1000);
        const response = await getRolesList(body);

        if (response.statusCode === 200) {
          const payload = response?.data?.rows;
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

  const selectedUser = watch("roleID");

  useEffect(() => {
    if (selectedUser?.value === 1) {
      setIsNotAdmin(false);
    } else {
      setIsNotAdmin(true);
    }
  }, [selectedUser]);

  const onSubmit = async (data) => {
    try {
      dispatch(startLoading());

      // const payload = {
      //   roleID: data.roleID.value,
      //   firstName: data.firstName,
      //   lastName: data.lastName,
      //   branchName: data.branchName,
      //   userName: data.userName,
      //   phoneNumber: data.phoneNumber,
      //   email: data.email,
      // };

      let payload;
      if (isNotAdmin) {
        payload = {
          roleID: data.roleID.value,
          firstName: data.firstName,
          lastName: data.lastName,
          branchName: data.branchName,
          userName: data.userName,
          phoneNumber: data.phoneNumber,
          phoneNumber2: data.phoneNumberSecond || null,
          billCode: data.billCode.toUpperCase(),
          billTitle: data.billName,
          address: data.address,
          email: data.email,
        };
      } else {
        payload = {
          roleID: data.roleID.value,
          firstName: data.firstName,
          lastName: data.lastName,
          branchName: data.branchName,
          userName: data.userName,
          phoneNumber: data.phoneNumber,
          email: data.email,
        };
      }
      const response =
        tag === "add"
          ? await createUser({
              ...payload,
              password: data.password,
              createdBy: loggedInUser.id,
            })
          : await updateUser({ ...payload, updatedBy: loggedInUser.id }, id);

      if (response?.statusCode === 200) {
        showToast(response.message, true);
        navigate("/user");
      } else {
        showToast(response?.messageCode, false);
      }

      // if (tag === "add") {
      //   const payload = {
      //     roleID: data.roleID.value,
      //     firstName: data.firstName,
      //     lastName: data.lastName,
      //     branchName: data.branchName,
      //     userName: data.userName,
      //     password: data.password,
      //     phoneNumber: data.phoneNumber,
      //     email: data.email,
      //     createdBy: loggedInUser.id,
      //   };
      //   const response = await createUser(payload);
      //   if (response.statusCode === 200) {
      //     showToast(response.message, true);
      //     navigate("/user");
      //   } else {
      //     showToast(response.messageCode, false);
      //   }
      // }
      // dispatch(stopLoading());
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
          setValue("branchName", response.data.branchName);
          setValue("roleID", role);
          setValue("email", response.data.email);
          setValue("phoneNumber", response.data.phoneNumber);
          if (response.data.roleID !== 1) {
            setValue("phoneNumberSecond", response?.data?.phoneNumber2);
            setValue("billName", response?.data?.billTitle);
            setValue("address", response?.data?.address);
            setValue("billCode", response?.data?.billCode);
          }
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
    tag === "edit" && fetchEditUserData();
  }, [tag, fetchEditUserData]);

  const cancelHandler = () => {
    navigate("/user");
  };

  return {
    control,
    roleOptions,
    handleSubmit,
    onSubmit,
    cancelHandler,
    role: loggedInUser?.px_role?.name.toLowerCase(),
    isNotAdmin,

    isChangePasswordOpen,
    setIsChangePasswordOpen,
    userId: id,
  };
};

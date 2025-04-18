import { set, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { listPayload, showToast } from "../../../utils/helper";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createUser, getUserById, updateUser } from "../../../service/users";
import { getRolesList } from "../../../service/roles";
import { getCompanyList } from "../../../service/company";
import { getCityByFind } from "../../../service/city";
import { startLoading, stopLoading } from "../../../redux/loader";


export const useAddEditUser = (tag) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const [roles, setRoles] = useState([]);
  const [company, setCompany] = useState([]);
  const [cities, setCities] = useState([]);
  const [isNotAdmin, setIsNotAdmin] = useState(true);

  const { setValue, handleSubmit, control, watch } = useForm({
    defaultValues: {
      roleID: "",
      companyID: "",
      cityID: "",
      firstName: "",
      lastName: "",
      slug: "",
      branchName: "",
      userName: "",
      password: "",
      billCode: "",
      billName: "",
      phoneNumber: "",
      phoneNumberSecond: "",
      address: "",
      email: "",
      gstNo: "",
      isShowGst: false,
      feedbackUrl: "",
      reviewUrl: "",
      areaName: "",
      description: "",
      mapUrl: "",
      images: "",
      thumbnilImage: "",
      iFrameMap: "",
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

  const companyOptions = useMemo(() => {
    const data = company.map((item) => {
      return { value: item.id, label: item.companyName };
    });
    return data;
  }, [company]);

  const cityOptions = useMemo(() => {
    const data = cities.map((item) => {
      return { value: item.id, label: item.name };
    });
    return data;
  }, [cities]);

  // get role list
  useEffect(() => {
    try {
      const fetchDropDownData = async () => {
        const body = listPayload(0, { isActive: true }, 1000);
        const [
          roleResponse,
          companyResponse,
          cityResponse
        ] = await Promise.all([
          getRolesList(body),
          getCompanyList(body),
          getCityByFind({isActive: true, isDeleted: false})
        ]);

        if (roleResponse.statusCode === 200) {
          const payload = roleResponse?.data?.rows;
          setRoles(payload);
        } else if (roleResponse.statusCode === 404) {
          const payload = [];
          setRoles(payload);
        }
        if(companyResponse.statusCode === 200){
          const payload = companyResponse?.data?.rows;
          setCompany(payload);
        } else {
          const payload = [];
          setCompany(payload);
        }
        if(cityResponse.statusCode === 200) {
          const payload = cityResponse?.data;
          setCities(payload);
        }
      };
      fetchDropDownData();
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
      let payload = {...data};
      console.log(payload);
      const formData = new FormData();
      if (tag === "add") {
        formData.append("createdBy", "" + loggedInUser?.id);
      } else {
        formData.append("updatedBy", "" + loggedInUser?.id);
      }
      if (isNotAdmin) {
        formData.append("companyID", data.companyID.value);
        formData.append("slug", data.slug);
        formData.append("roleID", data.roleID.value);
        formData.append("cityID", data.cityID.value);
        formData.append("password", data.password);
        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        formData.append("branchName", data.branchName);
        formData.append("userName", data.userName);
        formData.append("phoneNumber", data.phoneNumber);
        formData.append("email", data.email);
        formData.append("gstNo", data.gstNo);
        formData.append("isShowGst", data.isShowGst);
        formData.append("feedbackUrl", data.feedbackUrl);
        formData.append("reviewUrl", data.reviewUrl);
        formData.append("phoneNumber2", data.phoneNumberSecond || null);
        formData.append("billCode", data.billCode.toUpperCase());
        formData.append("billTitle", data.billName);
        formData.append("address", data.address);
        formData.append("areaName", data.areaName);
        formData.append("description", data.description);
        formData.append("mapUrl", data.mapUrl);
        formData.append("iFrameMap", data.iFrameMap);
        if(payload && payload.thumbnilImage) {
          formData.append('thumbnilImage', payload.thumbnilImage[0]);
        }
        if(payload && payload.images && Array.isArray(payload.images)){
          payload.images.filter((image) => typeof image === 'object').forEach((image) => {
            formData.append('images', image);
          });
          const stringImgs = payload.images.filter((image) => typeof image === 'string');
          if(stringImgs.length > 0) {
            formData.append('images', JSON.stringify(stringImgs));
          }
        }
        // payload = {
        //   companyID: data.companyID.value,
        //   roleID: data.roleID.value,
        //   firstName: data.firstName,
        //   lastName: data.lastName,
        //   branchName: data.branchName,
        //   userName: data.userName,
        //   phoneNumber: data.phoneNumber,
        //   phoneNumber2: data.phoneNumberSecond || null,
        //   billCode: data.billCode.toUpperCase(),
        //   billTitle: data.billName,
        //   address: data.address,
        //   email: data.email,
        //   gstNo: data.gstNo,
        //   isShowGst: data.isShowGst,
        //   feedbackUrl: data.feedbackUrl,
        //   reviewUrl: data.reviewUrl
        // };
      } else {
        formData.append("companyID", loggedInUser?.companyID);
        formData.append("roleID", data.roleID.value);
        formData.append("cityID", data.cityID.value);
        formData.append("slug", data.slug);
        formData.append("password", data.password);
        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        formData.append("branchName", data.branchName);
        formData.append("userName", data.userName);
        formData.append("phoneNumber", data.phoneNumber);
        formData.append("email", data.email);
        formData.append("gstNo", data.gstNo);
        formData.append("isShowGst", data.isShowGst);
        // payload = {
        //   companyID: data.companyID.value,
        //   roleID: data.roleID.value,
        //   firstName: data.firstName,
        //   lastName: data.lastName,
        //   branchName: data.branchName,
        //   userName: data.userName,
        //   phoneNumber: data.phoneNumber,
        //   email: data.email,
        //   gstNo: data.gstNo,
        //   isShowGst: data.isShowGst
        // };
      }
      const response =
        tag === "add"
          ? await createUser(formData)
          : await updateUser(formData, id);

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
          const company = {
            value: response.data.companyID,
            label: response.data.px_company.companyName,
          }
          const city = {
            value: response.data.cityID,
            label: response.data.px_city.name,
          }

          setValue("firstName", response.data.firstName);
          setValue("lastName", response.data.lastName);
          setValue("userName", response.data.userName);
          setValue("branchName", response.data.branchName);
          setValue("roleID", role);
          setValue("companyID", company);
          setValue("cityID", city);
          setValue("slug", response.data.slug);
          setValue("email", response.data.email);
          setValue("phoneNumber", response.data.phoneNumber);
          setValue("gstNo", response.data.gstNo);
          setValue("isShowGst", response.data.isShowGst);
          setValue("feedbackUrl", response.data.feedbackUrl);
          setValue("reviewUrl", response.data.reviewUrl);
          setValue("areaName", response.data.areaName);
          setValue("description", response.data.description);
          setValue("mapUrl", response.data.mapUrl);
          setValue("images", response.data.images ? response.data.images : '');
          setValue("thumbnilImage", response.data.thumbnilImage ? [response.data.thumbnilImage] : '');
          setValue("iFrameMap", response.data.iFrameMap);
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
    setValue,
    onSubmit,
    cancelHandler,
    cityOptions,
    companyOptions,
    company: loggedInUser?.px_company?.companyName.toLowerCase(),
    role: loggedInUser?.px_role?.name.toLowerCase(),
    isNotAdmin,

    isChangePasswordOpen,
    setIsChangePasswordOpen,
    userId: id,
  };
};

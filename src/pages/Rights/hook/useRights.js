import { useEffect, useMemo, useState } from "react";
import { getModuleList } from "../../../service/module";
import { getRolesList } from "../../../service/roles";
import { showToast } from "../../../utils/helper";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import useLoader from "../../../hook/useLoader";
import { createRight } from "../../../service/rights";
import { useSelector } from "react-redux";

export const useRights = () => {
  const navigate = useNavigate();
  const { loading } = useLoader();

  const [roleOptions, setRoleOptions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [moduleList, setModuleList] = useState([]);

  const { handleSubmit, control } = useForm({
    defaultValues: {
      roleID: "",
      modules: [
        {
          moduleID: "",
          view: false,
          add: false,
          edit: false,
          delete: false,
        },
      ],
    },
    mode: "onBlur",
  });

  // const { fields } = useFieldArray({
  //   name: "modules",
  //   control: control,
  // });

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
      loading(true);
      const fetchRolesData = async () => {
        const body = {
          where: {
            isActive: true,
            isDeleted: false,
          },
          pagination: {
            sortBy: "createdAt",
            descending: true,
            rows: 1000,
            page: 1,
          },
        };
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
    } finally {
      loading(false);
    }
  }, []);

  // get module list
  useEffect(() => {
    try {
      loading(true);
      const fetchModuleData = async () => {
        const body = {
          where: {
            isActive: true,
            isDeleted: false,
          },
          pagination: {
            sortBy: "createdAt",
            descending: true,
            rows: 1000,
            page: 1,
          },
        };

        const response = await getModuleList(body);

        if (response.statusCode === 200) {
          const payload = response.data.rows;
          setModuleList(payload);
        } else if (response.statusCode === 404) {
          const payload = [];
          setModuleList(payload);
        }
      };
      fetchModuleData();
    } catch (error) {
      showToast(error.message, false);
    } finally {
      loading(false);
    }
  }, []);

  const onSubmit = async (data) => {
    console.log("rights data", data);
    // try {
    //   loading(true);
    //   const payload = data.modules;
    //   const response = await createRight(payload);

    //   if (response.statusCode === 200) {
    //     showToast(response.message, true);
    //   } else {
    //     showToast(response.messageCode, false);
    //   }
    //   loading(false);
    // } catch (error) {
    //   showToast(error.message, false);
    // } finally {
    //   loading(false);
    // }
  };

  const cancelHandler = () => {
    navigate(-1);
  };

  return {
    // fields,
    control,
    handleSubmit,
    onSubmit,
    cancelHandler,
    roleOptions,
    moduleList,
  };
};

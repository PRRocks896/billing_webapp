import { useEffect, useMemo, useState } from "react";
import { getModuleList } from "../../../service/module";
import { getRolesList } from "../../../service/roles";
import { getRightList, createBulkRight } from "../../../service/rights";
import { showToast } from "../../../utils/helper";
import { useForm, useFieldArray } from "react-hook-form";
import { startLoading, stopLoading } from "../../../redux/loader";
import { useDispatch, useSelector } from "react-redux";

export const useRights = () => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const [roleOptions, setRoleOptions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [moduleList, setModuleList] = useState([]);

  const { handleSubmit, control, getValues, reset } = useForm({
    defaultValues: {
      roleID: "",
      modules: [
        // {
        //   moduleID: "",
        //   view: false,
        //   add: false,
        //   edit: false,
        //   delete: false,
        // },
      ],
    },
    mode: "onBlur",
  });

  const { fields, append } = useFieldArray({
    name: "modules",
    control: control,
  });

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
      dispatch(startLoading());
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
      dispatch(stopLoading());
    }
  }, [dispatch]);

  const fetchRightsModuleData = async (roleID) => {
    reset({
      roleID: getValues('roleID'),
      modules: []
    })
    const body = {
      where: {
        roleID: roleID,
        isActive: true,
        isDeleted: false,
      },
      pagination: {
        sortBy: "createdAt",
        descending: true,
        rows: 10000,
        page: 1
      }
    };
    const response = await getRightList(body);
    if(response.statusCode === 200) {
      const { data } = response;
      const { rows } = data;
      if(rows && rows.length > 0) {
        rows.forEach((res) => {
          const index = getValues('modules').length;
          append({
            index: index,
            rightID: res?.id,
            moduleID: res?.moduleID,
            moduleName: res?.px_module?.name,
            view: res?.view,
            add: res?.add,
            edit: res?.edit,
            delete: res?.delete,
          })
        })
      }
    } else if(response.statusCode === 404) {
      reset({
        roleID: getValues('roleID'),
        modules: []
      })
      fetchModuleData();
    } else {
      reset({
        roleID: getValues('roleID'),
        modules: []
      })
      showToast(response.message, false);
    }
  }

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
      const { data } = response;
      const { rows } = data;
      if(rows && rows.length > 0) {
        rows.forEach((res) => {
          const index = getValues('modules').length;
          append({
            index: index,
            rightID: null,
            moduleID: res?.id,
            moduleName: res?.name,
            view: false,
            add: false,
            edit: false,
            delete: false
          });
        })
      } else {

      }
    } else if (response.statusCode === 404) {
      const payload = [];
      setModuleList(payload);
    }
  };

  const onSubmit = async (info) => {
    try {
      const body = info?.modules?.map(res => {
        let data = {
          id: res.rightID,
          roleID: info.roleID,
          moduleID: res.moduleID,
          add: res.add,
          view: res.view,
          edit: res.edit,
          delete: res.delete
        }
        if(res.rightID !== null) {
          data['updatedBy'] = loggedInUser.id;
        } else {
          data['createdBy'] = loggedInUser.id;
        }
        return data;
      });
      const response = await createBulkRight(body);
      if(response.statusCode === 200) {
        reset({
          roleID: '',
          modules: []
        })
        showToast(response.message, true);
      } else {
        showToast(response.message, false);
      }
    } catch(error) {
      showToast(error.message, false);
    } finally {
      dispatch(stopLoading());
    }
  };

  const cancelHandler = () => {
    // navigate(-1);
    reset({
      roleID: '',
      modules: []
    })
  };

  return {
    fields,
    control,
    handleSubmit,
    onSubmit,
    cancelHandler,
    roleOptions,
    moduleList,
    fetchRightsModuleData
  };
};

import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserList } from "../../../service/users";
import { listPayload } from "../../../utils/helper";

export const useAddEditDailyTask = () => {
  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const [branchList, setBranchList] = useState([]);

  const { control } = useForm({
    defaultValues: {
      note: ""
    }
  })

  const isAdmin = useMemo(() => {
    if (loggedInUser && ['super admin', 'admin'].includes(loggedInUser.px_role?.name.toLowerCase())) {
      return true;
    }
    return false;
  }, [loggedInUser]);

  useEffect(() => {
    if (isAdmin) {
      (async () => {
        const body = listPayload(0, {}, 1000);
        const { success, data } = await getUserList(body);
        if (success) {
          setBranchList(data.rows?.filter((item) => item.roleID !== 1));
        } else {
          setBranchList([]);
        }
      })();
    }
  }, [isAdmin]);

  return {
    control,

  }
};
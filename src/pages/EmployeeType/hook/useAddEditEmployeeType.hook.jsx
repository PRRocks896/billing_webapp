import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { showToast } from "../../../utils/helper";

import {
    createEmployeeType,
    updateEmployeeType,
    getEmployeeTypeById
} from "../../../service/employeeType";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useAddEditEmployeeType = (tag) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const loggedInUser = useSelector((state) => state.loggedInUser);

    const { setValue, control, handleSubmit } = useForm({
        defaultValues: {
            name: "",
        },
        mode: "onBlur",
    });

    const onSubmit = async (data) => {
        try {
            dispatch(startLoading());
            const response = tag === "add"
                ? await createEmployeeType({ ...data, createdBy: loggedInUser.id })
                : await updateEmployeeType({ ...data, updatedBy: loggedInUser.id }, id);

            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                navigate("/employee-type");
            } else {
                showToast(response?.messageCode, false);
            }
        } catch (error) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    };

    const fetchEditEmployeeTypeData = useCallback(async () => {
        try {
            if (id) {
                dispatch(startLoading());
                const response = await getEmployeeTypeById(id);

                if (response?.statusCode === 200) {
                    setValue("name", response.data.name);
                } else {
                    showToast(response?.message, false);
                }
            }
        } catch (error) {
          showToast(error?.message, false);
        } finally {
          dispatch(stopLoading());
        }
    }, [id, setValue, dispatch]);

    useEffect(() => {
        tag === "edit" && fetchEditEmployeeTypeData();
      }, [tag, fetchEditEmployeeTypeData]);

    const cancelHandler = () => {
        navigate("/employee-type");
    };
    return {
        control,
        onSubmit,
        handleSubmit,
        cancelHandler,
    }
}
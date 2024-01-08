import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { showToast } from "../../../utils/helper";

import {
    createMembershipPlan,
    updateMembershipPlan,
    getMembershipPlanById
} from "../../../service/membershipPlan";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useAddEditMembershipPlan = (tag) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const loggedInUser = useSelector((state) => state.loggedInUser);

    const { setValue, control, handleSubmit } = useForm({
        defaultValues: {
            planName: "",
            hours: "",
            price: "",
        },
        mode: "onBlur",
    });

    const onSubmit = async (data) => {
        try {
            dispatch(startLoading());
            const response = tag === "add"
                ? await createMembershipPlan({ ...data, createdBy: loggedInUser.id })
                : await updateMembershipPlan({ ...data, updatedBy: loggedInUser.id }, id);

            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                navigate("/membership-plan");
            } else {
                showToast(response?.messageCode, false);
            }
        } catch (error) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    };

    const fetchEditModuleData = useCallback(async () => {
        try {
            if (id) {
                dispatch(startLoading());
                const response = await getMembershipPlanById(id);

                if (response?.statusCode === 200) {
                    setValue("planName", response.data.planName);
                    setValue("hours", response.data.hours);
                    setValue("price", response.data.price);
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
        tag === "edit" && fetchEditModuleData();
      }, [tag, fetchEditModuleData]);

    const cancelHandler = () => {
        navigate("/membership-plan");
    };
    return {
        control,
        onSubmit,
        handleSubmit,
        cancelHandler,
    }
}
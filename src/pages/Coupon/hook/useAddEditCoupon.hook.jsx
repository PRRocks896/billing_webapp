import { useCallback, useEffect } from "react";
import { set, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { showToast } from "../../../utils/helper";

import {
    createCoupon,
    updateCoupon,
    getCouponById
} from "../../../service/coupon";

import { startLoading, stopLoading } from "../../../redux/loader";

const useAddEditCouponHook = (tag) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const loggedInUser = useSelector((state) => state.loggedInUser);

    const { setValue, control, handleSubmit } = useForm({
        defaultValues: {
            name: "",
            code: "",
            type: "",
            value: "",
            maxPrice: "",
        },
        mode: "onBlur",
    });
    const onSubmit = async (data) => {
        try {
            dispatch(startLoading());
            const response = tag === "add"
                ? await createCoupon({ ...data, createdBy: loggedInUser.id })
                : await updateCoupon({ ...data, updatedBy: loggedInUser.id }, id);

            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                navigate("/coupon");
            } else {
                showToast(response?.messageCode, false);
            }
        } catch (error) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    };

    const fetchEditCouponData = useCallback(async () => {
        try {
            if (id) {
                dispatch(startLoading());
                const response = await getCouponById(id);
                if (response?.statusCode === 200) {
                    setValue("name", response.data.name);
                    setValue("code", response.data.code);
                    setValue("type", response.data.type);
                    setValue("value", response.data.value);
                    setValue("maxPrice", response.data.maxPrice);
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
        tag === "edit" && fetchEditCouponData();
    }, [tag, fetchEditCouponData]);

    const cancelHandler = () => {
        navigate("/coupon");
    };
    return {
        control,
        onSubmit,
        handleSubmit,
        cancelHandler,
    }
};

export default useAddEditCouponHook;
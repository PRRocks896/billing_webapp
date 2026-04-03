import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { showToast } from "../../../utils/helper";

import {
    createWebSetting,
    updateWebSetting,
    getWebSettingById
} from "../../../service/webSetting";
import { startLoading, stopLoading } from "../../../redux/loader";


const useAddEditWebSetting = (tag) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const loggedInUser = useSelector((state) => state.loggedInUser);

    const { setValue, control, handleSubmit, getValues, watch } = useForm({
        defaultValues: {
            identifier: "",
            slug: "",
            value: "",
            image: "",
        },
        mode: "onBlur",
    });

    const onSubmit = async (data) => {
        try {
            dispatch(startLoading());
            const payload = { ...data };
            console.log(payload);
            const formData = new FormData();
            if (tag === "add") {
                formData.append('createdBy', '' + loggedInUser?.id);
            } else {
                formData.append('updatedBy', '' + loggedInUser?.id);
            }
            (Object.keys(data)).forEach(key => {
                if (!['image', 'value'].includes(key)) {
                    formData.append(key, data[key]);
                }
            });

            // Mutually exclusive: send only one
            if (payload.value && payload.value.length > 0) {
                formData.append('value', payload.value);
            } else if (payload.image && typeof payload.image === 'object') {
                formData.append('image', payload.image);
            }

            const response = tag === "add" ? await createWebSetting(formData) : await updateWebSetting(formData, id);
            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                navigate("/web-setting");
            } else {
                showToast(response?.message, false);
            }
        } catch (error) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    }

    const fetchEditWebSettingData = useCallback(async () => {
        try {
            dispatch(startLoading());
            const response = await getWebSettingById(id);
            if (response?.statusCode === 200) {
                const payload = response?.data;
                setValue("identifier", payload?.identifier);
                setValue("slug", payload?.slug);
                setValue("value", payload?.value || "");
                setValue("image", payload?.image ? [payload.image] : []);
            } else {
                showToast(response?.message, false);
            }
        } catch (error) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    }, [id, setValue, dispatch]);

    useEffect(() => {
        tag === "edit" && fetchEditWebSettingData();
    }, [tag, fetchEditWebSettingData]);

    const cancelHandler = () => {
        navigate("/web-setting");
    };
    return {
        control,
        setValue,
        getValues,
        watch,
        onSubmit,
        handleSubmit,
        cancelHandler,
    }
}

export default useAddEditWebSetting;
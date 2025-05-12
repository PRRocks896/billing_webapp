import { useCallback, useEffect } from "react";
import { set, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { showToast } from "../../../utils/helper";

import {
    createHomePage,
    updateHomePage,
    getHomePageById
} from "../../../service/homePage";

import { startLoading, stopLoading } from "../../../redux/loader";

const useAddEditHomePageHook = (tag) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const loggedInUser = useSelector((state) => state.loggedInUser);

    const { setValue, control, handleSubmit } = useForm({
        defaultValues: {
            title: "",
            description: "",
            image: "",
            video: "",
            detail: "",
            tag: "",
        },
        mode: "onBlur",
    });

    const onSubmit = async (data) => {
        try {
            dispatch(startLoading());
            const payload = { ...data };
            const formData = new FormData();
            if (tag === "add") {
                formData.append('createdBy', '' + loggedInUser?.id);
            } else {
                formData.append('updatedBy', '' + loggedInUser?.id);
            }
            (Object.keys(data)).forEach(key => {
                if (!['image', 'video'].includes(key)) {
                    formData.append(key, data[key]);
                }
            });
            if (payload && payload.image && typeof payload.image === 'object') {
                formData.append('image', payload.image[0]);
            }
            if(payload && payload.video && typeof payload.video === 'object') {
                formData.append('video', payload.video[0]);
            }
            const response = tag === "add" ? await createHomePage(formData) : await updateHomePage(formData, id);
            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                navigate("/home-page");
            } else {
                showToast(response?.message, false);
            }
        } catch (error) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    }

    const fetchEditHomePageData = useCallback(async () => {
        try {
            dispatch(startLoading());
            const response = await getHomePageById(id);
            if (response?.statusCode === 200) {
                const payload = response?.data;
                setValue("title", payload?.title);
                setValue("description", payload?.description);
                setValue("image", [payload?.image]);
                setValue("video", payload.video && payload.video.length > 0 ? [payload?.video] : "");
                setValue("detail", payload?.detail);
                setValue("tag", payload?.tag);
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
        tag === "edit" && fetchEditHomePageData();
    }, [tag, fetchEditHomePageData]);

    const cancelHandler = () => {
        navigate("/home-page");
    };
    return {
        control,
        setValue,
        onSubmit,
        handleSubmit,
        cancelHandler,
    }
}

export default useAddEditHomePageHook;
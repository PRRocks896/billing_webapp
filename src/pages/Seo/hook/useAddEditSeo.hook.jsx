import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { showToast } from "../../../utils/helper";

import {
    createSeo,
    updateSeo,
    getSeoById
} from "../../../service/seo";

import { startLoading, stopLoading } from "../../../redux/loader";

const useAddEditSeoHook = (tag) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const loggedInUser = useSelector((state) => state.loggedInUser);

    const { setValue, control, handleSubmit } = useForm({
        defaultValues: {
            title: "",
            description: "",
            slug: "",
            image: "",
            keywords: "",
            tags: "",
            pagePath: ""
        },
        mode: "onBlur",
    });
    const onSubmit = async (data) => {
        try {
            dispatch(startLoading());
            const response = tag === "add"
                ? await createSeo({ ...data, createdBy: loggedInUser.id })
                : await updateSeo({ ...data, updatedBy: loggedInUser.id }, id);

            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                navigate("/seo");
            } else {
                showToast(response?.messageCode, false);
            }
        } catch (error) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    };

    const fetchEditSeoData = useCallback(async () => {
        try {
            if (id) {
                dispatch(startLoading());
                const response = await getSeoById(id);
                console.log(response);
                if (response?.statusCode === 200) {
                    setValue("title", response.data.title);
                    setValue("description", response.data.description);
                    setValue("slug", response.data.slug);
                    setValue("image", response.data.image);
                    setValue("keywords", response.data.keywords);
                    setValue("tags", response.data.tags);
                    setValue("pagePath", response.data.pagePath);
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
        tag === "edit" && fetchEditSeoData();
    }, [tag, fetchEditSeoData]);

    const cancelHandler = () => {
        navigate("/seo");
    };
    return {
        control,
        setValue,
        onSubmit,
        handleSubmit,
        cancelHandler,
    }
};

export default useAddEditSeoHook;
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
            keywords: [],
            tags: [],
            pagePath: ""
        },
        mode: "onBlur",
    });
    const onSubmit = async (data) => {
        try {
            dispatch(startLoading());
            const payload = {...data};
            const formData = new FormData();
            if(tag === "add") {
                formData.append('createdBy', '' + loggedInUser?.id);
            } else {
                formData.append('updatedBy', '' + loggedInUser?.id);
            }
            (Object.keys(data)).forEach(key => {
                if(!['image', 'keywords', 'tags'].includes(key)) {
                  formData.append(key, data[key]);
                }
            });
            if(payload && payload.keywords && Array.isArray(payload.keywords)){
                // payload.keywords = payload.keywords.join(',');
                formData.append('keywords', payload.keywords.join(','));
            }
            if(payload && payload.tags && Array.isArray(payload.tags)){
                // payload.tags = payload.tags.join(',');
                formData.append('tags', payload.tags.join(','));
            }
            if (payload && payload.image && typeof data.image === 'object') {
                formData.append('image', payload.image);
            }
            const response = tag === "add"
                ? await createSeo(formData)
                : await updateSeo(formData, id);

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
                if (response?.statusCode === 200) {
                    setValue("title", response.data.title);
                    setValue("description", response.data.description);
                    setValue("slug", response.data.slug);
                    setValue("image", response.data.image);
                    setValue("keywords", response.data.keywords.split(','));
                    setValue("tags", response.data.tags.split(','));
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
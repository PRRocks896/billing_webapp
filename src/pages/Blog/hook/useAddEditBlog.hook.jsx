import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { showToast } from "../../../utils/helper";

import {
    createBlog,
    updateBlog,
    getBlogById
} from "../../../service/blog";

import { startLoading, stopLoading } from "../../../redux/loader";

const useAddEditBlogHook = (tag) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const loggedInUser = useSelector((state) => state.loggedInUser);

    const { setValue, control, handleSubmit } = useForm({
        defaultValues: {
            title: "",
            description: "",
            slug: "",
            shortDescription: "",
            thumbnilImage: "",
            metaKeywords: [],
            metaTags: [],
            metaDescription: ""
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
                if(!['thumbnilImage', 'metaKeywords', 'metaTags'].includes(key)) {
                    formData.append(key, data[key]);
                }
            });
            if(payload && payload.metaKeywords && Array.isArray(payload.metaKeywords)){
                formData.append('metaKeywords', payload.metaKeywords.join(','));
            }
            if(payload && payload.metaTags && Array.isArray(payload.metaTags)){
                formData.append('metaTags', payload.metaTags.join(','));
            }
            console.log('payload', typeof payload.thumbnilImage);
            if (payload && payload.thumbnilImage && typeof payload.thumbnilImage === 'object') {
                formData.append('thumbnilImage', payload.thumbnilImage[0]);
            }
            const response = tag === "add"
                ? await createBlog(formData)
                : await updateBlog(formData, id);

            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                navigate("/blog");
            } else {
                showToast(response?.messageCode, false);
            }
        } catch (error) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    };

    const fetchEditBlogData = useCallback(async () => {
        try {
            if (id) {
                dispatch(startLoading());
                const response = await getBlogById(id);
                if (response?.statusCode === 200) {
                    setValue("title", response.data.title);
                    setValue("description", response.data.description);
                    setValue("slug", response.data.slug);
                    setValue("thumbnilImage", [response.data.thumbnilImage]);
                    setValue("metaKeywords", response.data.metaKeywords.split(','));
                    setValue("metaTags", response.data.metaTags.split(','));
                    setValue("shortDescription", response.data.shortDescription);
                    setValue("metaDescription", response.data.metaDescription);
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
        tag === "edit" && fetchEditBlogData();
    }, [tag, fetchEditBlogData]);

    const cancelHandler = () => {
        navigate("/blog");
    };

    return {
        control,
        setValue,
        onSubmit,
        handleSubmit,
        cancelHandler,
    }
}

export default useAddEditBlogHook;
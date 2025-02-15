import { useCallback, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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

    const { setValue, getValues, control, handleSubmit } = useForm({
        defaultValues: {
            planName: "",
            hours: "",
            price: "",
            validity: "",
            images: [],
            featureList: [{
                index: 0,
                value: ""
            }],
        },
        mode: "onBlur",
    });

    const { fields, append, remove } = useFieldArray({
        name: "featureList",
        control: control,
    });

    const addRow = () => {
        const index = getValues("featureList").length;
        append({
            index: index,
            value: ""
        });
    }

    const removeRow = (index) => {
        remove(index);
    }

    const onSubmit = async (data) => {
        try {
            dispatch(startLoading());
            console.log('Data: ', data);
            const payload = { ...data };
            const formData = new FormData();
            if(tag === "add") {
                formData.append('createdBy', '' + loggedInUser?.id);
            } else {
                formData.append('updatedBy', '' + loggedInUser?.id);
            }
            (Object.keys(data)).forEach(key => {
                if(!['images', 'featureList'].includes(key)) {
                  formData.append(key, data[key]);
                }
            });
            if(payload && payload.images && Array.isArray(payload.images)){
                payload.images.filter((image) => typeof image === 'object').forEach((image) => {
                    formData.append(tag === "add" ? 'images' : 'newImages', image);
                });
                const stringImgs = payload.images.filter((image) => typeof image === 'string');
                if(stringImgs.length > 0) {
                    formData.append('images', JSON.stringify(stringImgs));
                }
            }
            if(payload && payload.featureList && Array.isArray(payload.featureList)){
                formData.append('featureList', JSON.stringify(payload.featureList.map((feature) => feature.value)));
            }
            const response = tag === "add"
                ? await createMembershipPlan(formData)
                : await updateMembershipPlan(formData, id);

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
                    setValue("validity", response.data.validity);
                    setValue("images", response.data.images);
                    setValue("featureList", response.data.featureList.map((feature, index) => ({index, value: feature})));
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
        fields,
        control,
        addRow,
        onSubmit,
        removeRow,
        handleSubmit,
        cancelHandler,
    }
}
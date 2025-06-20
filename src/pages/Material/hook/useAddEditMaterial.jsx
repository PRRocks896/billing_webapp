import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { set, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import { listPayload, showToast } from "../../../utils/helper";
import { createMaterial, updateMaterial, getMaterialById } from "../../../service/material";
import { startLoading, stopLoading } from "../../../redux/loader";

const useAddEditMaterial = (tag) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const loggedInUser = useSelector((state) => state.loggedInUser);

    const { 
        control,
        formState: { isSubmitting },
        handleSubmit,
        setValue
    } = useForm({
        defaultValues: {
            name: "",
            uom: "", 
        }
    });

    const onSubmit = async (data) => {
        try {
            dispatch(startLoading());
            let payload = { ...data };
            if (tag === 'add') {
                payload = {
                    ...payload,
                    userID: loggedInUser.id,
                    createdBy: loggedInUser.id
                };
            } else {
                payload = {
                    ...payload,
                    updatedBy: loggedInUser.id
                };
            }
            const response = tag !== 'add' ? await updateMaterial(payload, id) : await createMaterial(payload);
            if (response && response.success) {
                showToast(response.message, true);
                navigate('/material');
            } else {
                showToast(response.message, false);
            }
        } catch (error) {
            console.error("Error in submitting form:", error);
        } finally {
            dispatch(stopLoading());
        }
    };

    const fetchEditMaterial = async () => {
        try {
            dispatch(startLoading());
            const { success, message, data } = await getMaterialById(id);
            if(!success) {
                showToast(message, false);
                return;
            }
            setValue("name", data.name);
            setValue("uom", data.uom);
        } catch(err) {
            showToast(err.message, false);
        } finally {
            dispatch(stopLoading());
        }
    }

    const cancelHandler = () => {
        navigate("/material");
    };

    useEffect(() => {
        tag === 'edit' && fetchEditMaterial()
        // eslint-disable-next-line
    }, [tag]);

    return {
        control,
        isSubmitting,
        handleSubmit,
        onSubmit,
        cancelHandler,
        listPayload,
    };
};

export default useAddEditMaterial;
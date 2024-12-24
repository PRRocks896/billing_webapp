import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { showToast } from "../../../utils/helper";
import { startLoading, stopLoading } from "../../../redux/loader";
import { createRoom, getRoomById, updateRoom } from "../../../service/room";

const useAddEditRoomHook = (tag) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { id } = useParams();
    const loggedInUser = useSelector((state) => state.loggedInUser);

    const { setValue, control, handleSubmit } = useForm({
        defaultValues: {
            roomName: "",
        },
        mode: "onBlur",
    });
    const onSubmit = async (data) => {
        try {
            dispatch(startLoading());
            const payload = { ...data };
            const response =
                tag === "add"
                    ? await createRoom({ ...payload, userID: loggedInUser.id, createdBy: loggedInUser.id })
                    : await updateRoom({ ...payload, userID: loggedInUser.id, updatedBy: loggedInUser.id }, id);

            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                navigate("/room");
            } else {
                showToast(response?.messageCode, false);
            }
        } catch (error) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    };

    const fetchEditRoomData = useCallback(async () => {
        try {
            if (id) {
                dispatch(startLoading());
                const response = await getRoomById(id);
                if (response?.statusCode === 200) {
                    setValue("roomName", response.data.roomName);
                } else {
                    showToast(response?.message, false);
                }
            }
        } catch (error) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    }, [id, dispatch, setValue]);

    useEffect(() => {
        tag === "edit" && fetchEditRoomData();
    }, [tag, fetchEditRoomData]);

    const cancelHandler = () => {
        navigate("/room");
    };

    return {
        control,
        onSubmit,
        handleSubmit,
        cancelHandler,
    };
};

export default useAddEditRoomHook;
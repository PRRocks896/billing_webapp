import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { createRoom, getRoomById, updateRoom } from "service/room";

export type RoomType = {
    roomName: string;
}

const defaultValues: RoomType = {
    roomName: "",
}

const UseAddEditRoom = () => {
    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { user } = useAuth();

    const {
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting }
    } = useForm<RoomType>({
        defaultValues,
        mode: "onChange",
    });

    const handleBack = () => {
        navigate("/room");
    }

    const fetch = async () => {
        try {
            const { success, message, data }: any = await getRoomById(Number(id));
            if (success) {
                setValue("roomName", data.roomName);
            } else {
                openSnackbar({
                    open: true,
                    message: message,
                    variant: 'alert',
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                });
            }
        } catch (error: any) {
            openSnackbar({
                open: true,
                message: error?.message || error?.messageCode || (error as Error).message || 'Something went wrong',
                variant: 'alert',
                alert: {
                    color: 'error'
                }
            })
        }
    }

    const onSubmit = async (data: RoomType) => {
        try {
            let payload: any = {
                ...data
            }
            if (mode && mode === 'edit' && id) {
                payload = {
                    ...payload,
                    updatedBy: user?.id
                }
            } else {
                payload = {
                    ...payload,
                    createdBy: user?.id
                }
            }
            const { success, message }: any = mode && mode === 'edit' && id ? await updateRoom(payload, Number(id)) : await createRoom(payload);
            if (success) {
                openSnackbar({
                    open: true,
                    message: message,
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    }
                });
                handleBack();
            } else {
                openSnackbar({
                    open: true,
                    message: message,
                    variant: 'alert',
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                });
            }
        } catch (error: any) {
            openSnackbar({
                open: true,
                message: error?.message || error?.messageCode || (error as Error).message || 'Something went wrong',
                variant: 'alert',
                severity: 'error',
                alert: {
                    color: 'error'
                }
            })
        }
    }

    const title: string = useMemo(() => {
        if (mode && mode === 'edit' && id) {
            return 'Edit Room';
        }
        return 'Add Room';
    }, [mode, id]);

    useEffect(() => {
        if (mode && mode === 'edit' && id) {
            fetch();
        }
    }, [mode, id]);

    return {
        mode,
        title,
        control,
        isSubmitting,
        onSubmit,
        handleBack,
        handleSubmit,
    }
}

export default UseAddEditRoom;
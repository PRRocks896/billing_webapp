import { useEffect  } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {  useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
// import moment from "moment";

import { listPayload, showToast } from "../../../utils/helper";
import { createLaundryItem, UpdateLaundryItem, getLaundryItem} from "../../../service/laundryItem";
import { startLoading, stopLoading } from "../../../redux/loader";

const useAddEditLaundryItem = (tag) => {
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
            itemName: "",
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
                    createBy: loggedInUser.id
                };
            } else {
                payload = {
                    ...payload,
                    updatEBy: loggedInUser.id
                };
            }
            const response = tag !== 'add' ? await UpdateLaundryItem(payload, id) : await createLaundryItem(payload);
            if (response && response.success) {
                showToast(response.message, true);
                navigate('/laundry-item');
            } else {
                showToast(response.message, false);
            }
        } catch (error) {
            console.error("Error in Submitting Form:", error);
        } finally {
            dispatch(stopLoading());
        }
    };

    const fetchEditLaundryItem = async () => {
        try {
            dispatch(startLoading());
            const { success, message, data } = await getLaundryItem(id);
            if(!success) {
                showToast(message, false);
                return;
            }
            setValue("itemName", data.itemName);
        } catch(err) {
            showToast(err.message, false);
        } finally {
            dispatch(stopLoading());
        }
    }

    const cancelHandler = () => {
        navigate("/laundry-item");
    };

    useEffect(() => {
        tag === 'edit' && fetchEditLaundryItem()
        //eslint-disable-next-line
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

export default useAddEditLaundryItem;
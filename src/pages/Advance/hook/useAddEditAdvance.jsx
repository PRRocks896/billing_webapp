import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import { getPaymentTypeList } from "../../../service/paymentType";
import { getStaffList } from "../../../service/staff";
import { listPayload, showToast } from "../../../utils/helper";
import { createAdvance, updateAdvance, getAdvanceById } from "../../../service/advance";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useAddEditAdvance = (tag) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const loggedInUser = useSelector((state) => state.loggedInUser);
    
    const [ staffOption, setStaffOption ] = useState([]);
    const [ paymentOption, setPaymentOption ] = useState([]);
    const [ managerOption, setManagerOption] = useState([]);

    const {
        control,
        formState: { isSubmitting },
        setValue,
        getValues,
        handleSubmit,
    } = useForm({
        defaultValues: {
            staffID: "",
            paymentID: "",
            managerID: parseInt(localStorage.getItem("managerId")) || "",
            date: moment(new Date()).format('yyyy-MM-DD'),
            amount: "",
            permissionName: "",
        }
    });

    const onSubmit = async (data) => {
        try {
            dispatch(startLoading());
            let payload = {...data};
            if(tag === 'add') {
                payload = {
                    ...payload,
                    createdBy: loggedInUser.id
                }
            } else {
                payload = {
                    ...payload,
                    updatedBy: loggedInUser.id
                }
            }
            const response = tag !== 'add' ? await updateAdvance(payload, id) : await createAdvance(payload);
            if(response && response.success) {
                showToast(response.message, true);
                navigate('/advance');
            } else {
                showToast(response.message, false);
            }
        } catch(err) {
            showToast(err?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    }

    const fetchEditAdvance = async () => {
        try {
            dispatch(startLoading());
            const { success, message, data } = await getAdvanceById(id);
            if(!success) {
                showToast(message, false);
                return;
            }
            setValue("staffID", data?.staff?.id);
            setValue("paymentID", data?.px_payment_type?.id);
            setValue("date", moment(new Date(data.date)).format('yyyy-MM-DD'));
            setValue("permissionName", data.permissionName);
            setValue("managerID", data?.manager?.id);
            setValue("amount", data.amount);
        } catch(err) {
            showToast(err.message, false);
        } finally {
            dispatch(stopLoading());
        }
    }

    const cancelHandler = () => {
        navigate("/advance");
    };

    useEffect(() => {
        const fetchDropDownList = async () => {
            const whereCondition = {
                isActive: true,
                isDeleted: false
            };
            const payload = listPayload(0, whereCondition, 100000);
            const [
                staffResponse,
                paymentResponse,
                managerResponse
            ] = await Promise.all([
                getStaffList(listPayload(0, ['admin', 'super admin'].includes(loggedInUser?.px_role?.name?.toLowerCase()) ? {...whereCondition} : {...whereCondition, createdBy: loggedInUser.id}, 100000)),
                getPaymentTypeList(payload),
                getStaffList(listPayload(0, ['admin', 'super admin'].includes(loggedInUser?.px_role?.name?.toLowerCase()) ? {...whereCondition, searchText: "MANAGER"} : {...whereCondition, searchText: "MANAGER", createdBy: loggedInUser.id}, 100000))
            ]);
            if(staffResponse?.statusCode === 200 && staffResponse?.success) {
                setStaffOption(staffResponse.data?.rows);
            } else {
                setStaffOption([]);
            }
            if(paymentResponse?.statusCode === 200 && paymentResponse?.success) {
                setPaymentOption(paymentResponse.data?.rows);
            } else {
                setPaymentOption([]);
            }
            if(managerResponse?.statusCode === 200 && managerResponse?.success) {
                setManagerOption(managerResponse.data?.rows);
            } else {
                setManagerOption([]);
            }
        }
        fetchDropDownList();
    // eslint-disable-next-line
    }, []);

    useEffect(() => {
        tag === 'edit' && fetchEditAdvance()
        // eslint-disable-next-line
    }, [tag]);

    return {
        control,
        staffOption,
        isSubmitting,
        paymentOption,
        managerOption,
        onSubmit,
        handleSubmit,
        cancelHandler
    }
}

export default useAddEditAdvance;
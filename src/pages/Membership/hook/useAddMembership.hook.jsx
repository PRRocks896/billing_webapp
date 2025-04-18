import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import moment from "moment";
import { useDispatch } from "react-redux";

import { listPayload, showToast } from "../../../utils/helper";
import { startLoading, stopLoading } from "../../../redux/loader";
import { getCustomerList } from "../../../service/customer";
import { getPaymentTypeList } from "../../../service/paymentType";
import { getMembershipPlanList } from "../../../service/membershipPlan";
import { getUserList } from "../../../service/users";
import { addPastMembership } from "../../../service/membership";

export const useAddMembership = () => {
    const dispatch = useDispatch();
    // const loggedInUser = useSelector((state) => state.loggedInUser);
    
    const [paymentType, setPaymentType] = useState([]);
    const [customer, setCustomer] = useState([]);
    const [membershipPlan, setMembershipPlan] = useState([]);
    const [user, setUser] = useState([]);
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

    const { setValue, control, handleSubmit, watch, getValues, reset, formState: { isSubmitting } } = useForm({
        defaultValues: {
            userID: "",
            createdAt: moment(new Date()).format('DD/MM/yyyy'),
            customerID: "",
            paymentID: "",
            membershipPlanID: "",
            managerName: localStorage.getItem("managerName") || '',
            registerPhoto: null,
            billNo: "", //localStorage.getItem('latestBillNo'),
            extraHours: "0",
            minutes: "",
            validity: "6",
            cardNo: "",
        },
        mode: "onBlur",
    });

    const fetchDropDownList = async () => {
        try {
            const whereCondition = {
                isActive: true,
                isDeleted: false
            };
            const payload = listPayload(0, whereCondition, 100000);
            const [
                paymentResponse,
                membershipPlanResponse,
                userResponse
            ] = await Promise.all([
                getPaymentTypeList(payload),
                getMembershipPlanList(payload),
                getUserList(payload)
            ]);
            if (paymentResponse.success) {
                setPaymentType(paymentResponse.data?.rows);
            } else {
                setPaymentType([]);
            }
            if (membershipPlanResponse.success) {
                setMembershipPlan(membershipPlanResponse.data?.rows);
            } else {
                setMembershipPlan([])
            }
            if(userResponse.success) {
                setUser(userResponse.data?.rows);
            } else {
                setUser([]);
            }
        } catch (err) {
            showToast(err?.message, false);
        }
    }

    const onSubmit = async (info) => {
        try {
            dispatch(startLoading());
            const selectedMemberShipPlan = membershipPlan.find(item => item.id === info.membershipPlanID);
            const billDetail = {
                billNo: localStorage.getItem('latestBillNo'),
                staffID: 1,
                userID: info.userID,
                paymentID: info.paymentID,
                customerID: info.customerID,
                detail: JSON.stringify([{
                    discount: 0,
                    quantity: 1,
                    rate: selectedMemberShipPlan.price,
                    membershipPlanID: selectedMemberShipPlan.id,
                    total: selectedMemberShipPlan.price
                }]),
                cardNo: info.cardNo,
                grandTotal: selectedMemberShipPlan.price,
                managerName: info.managerName,
                createdBy: info.userID,
                updatedBy: info.userID
            }
            const payload = new FormData();
            payload.append('userID', info.userID);
            payload.append('createdAt', info.createdAt);
            payload.append('customerID', info.customerID);
            payload.append('paymentID', info.paymentID);
            payload.append('membershipPlanID', info.membershipPlanID);
            payload.append('managerName', info.managerName);
            payload.append('billNo', info.billNo);
            payload.append('extraHours', info.extraHours);
            payload.append('minutes', info.minutes);
            payload.append('validity', info.validity);
            payload.append('cardNo', info.cardNo);
            payload.append('createdBy', info.userID);
            payload.append('updatedBy', info.userID);
            payload.append('billDetail', JSON.stringify(billDetail));
            if(typeof info.registerPhoto === 'object') {
                payload.append('image', info.registerPhoto);
            }
            const { success, message } = await addPastMembership(payload);
            if(success) {
                showToast(message, true);
                reset();
            } else {
                showToast(message, false);
            }
        } catch(error) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    }

    const searchCustomer = async (customerPhone) => {
        try {
            startLoading();
            if (customerPhone.length === 10) {
                const whereCondition = {
                    searchText: customerPhone,
                    isActive: true,
                    isDeleted: false
                };
                const payload = listPayload(0, whereCondition, 1000000);
                const { success, data } = await getCustomerList(payload);
                if (success) {
                    setCustomer(data?.rows);
                } else {
                    setCustomer([]);
                    showToast('Customer Not Found', false)
                }
            } else if (customerPhone.length === 0) {
                setCustomer([]);
            }
        } catch (err) {
            showToast(err?.message, false);
        } finally {
            stopLoading();
        }
    }

    const setCustomerSelectedHandler = (id, phone, name, custNo) => {
        setValue('customerID', id);
        searchCustomer(phone);
    };

    const cancelHandler = () => {
        reset();
    }

    const isCardSelected = useMemo(() => {
        const selectedPaymentType = paymentType.find((item) => item.id === getValues('paymentID'));
        return selectedPaymentType && selectedPaymentType.name.toLowerCase() === 'card' ? true : false;
        // eslint-disable-next-line
    }, [watch('paymentID'), getValues, paymentType]);

    useEffect(() => {
        fetchDropDownList();
    }, []);

    return {
        user,
        control,
        customer,
        paymentType,
        isSubmitting,
        membershipPlan,
        isCardSelected,
        isCustomerModalOpen,
        onSubmit,
        getValues,
        handleSubmit,
        cancelHandler,
        searchCustomer,
        setIsCustomerModalOpen,
        setCustomerSelectedHandler
    }
}
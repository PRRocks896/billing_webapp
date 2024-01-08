import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { listPayload, showToast } from "../../../utils/helper";

import {
    addExtraHours,
    createMembership,
    updateMembership,
    getMembershipById,
} from "../../../service/membership";
import {
    fetchLoggedInUserData
} from "../../../service/loggedInUser";
import { startLoading, stopLoading } from "../../../redux/loader";
import { loggedInUserAction } from "../../../redux/loggedInUser";

import { verifyOTP } from "../../../service/login";
import { getCustomerList, sendMembershipOtp, verifyMembershipOtp } from "../../../service/customer";
import { getPaymentTypeList } from "../../../service/paymentType";
import { getMembershipPlanList } from "../../../service/membershipPlan";

export const useAddEditMembership = (tag) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const loggedInUser = useSelector((state) => state.loggedInUser);

    const [paymentType, setPaymentType] = useState([]);
    const [customer, setCustomer] = useState([]);
    const [membershipPlan, setMembershipPlan] = useState([]);
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [isOtpSend, setIsOtpSend] = useState(false);
    const [otp, setOtp] = useState(null);
    const [verifiedOtp, setVerifiedOtp] = useState(false);
    const [verifyCustomerMembership, setVerifyCustomerMembership] = useState(false);
    const [openVerifyMembershipModal, setOpenVerifyMembershipModal] = useState(false);

    const { setValue, control, handleSubmit, watch, getValues, formState: { isSubmitting } } = useForm({
        defaultValues: {
            userID: loggedInUser.id,
            customerID: "",
            paymentID: "",
            membershipPlanID: "",
            managerName: "",
            customerPhoto: "",
            billNo: localStorage.getItem('latestBillNo'),
            extraHours: "0",
            validity: "6",
            cardNo: ""
        },
        mode: "onBlur",
    });

    const onSubmit = async (data) => {
        try {
            dispatch(startLoading());
            const selectedMemberShipPlan = membershipPlan.find(item => item.id === data.membershipPlanID);
            const totalMinutes = (selectedMemberShipPlan.hours + parseInt(data.extraHours)) * 60 || 0;
            console.log(totalMinutes);
            const payload = {
                ...data,
                billDetail: {
                    billNo: localStorage.getItem('latestBillNo'),
                    staffID: 1,
                    userID: loggedInUser.id,
                    paymentID: data.paymentID,
                    customerID: data.customerID,
                    detail: JSON.stringify([{
                        discount: 0,
                        quantity: 1,
                        rate: selectedMemberShipPlan.price,
                        membershipPlanID: selectedMemberShipPlan.id,
                        total: selectedMemberShipPlan.price
                    }]),
                    cardNo: data.cardNo,
                    grandTotal: selectedMemberShipPlan.price,
                    managerName: data.managerName,
                    createdBy: loggedInUser.id,
                    minutes: totalMinutes,
                }
            };
            const response = tag === "add"
                ? await createMembership({ ...payload, createdBy: loggedInUser.id })
                : await updateMembership({ ...data, updatedBy: loggedInUser.id }, id);
            if (response?.statusCode === 200) {
                const { success, data} = await fetchLoggedInUserData();
                if (success) {
                    const latestBillNo = data.latestBillNo;
                    const latestCustomerNo = data.latestCustomerNo;
                    localStorage.setItem('latestBillNo', latestBillNo);
                    localStorage.setItem("latestCustomerNo", latestCustomerNo);
                    dispatch(loggedInUserAction.storeLoggedInUserData(data));
                } else {
                    showToast(response.message, false);
                }
                showToast(response?.message, true);
                navigate("/membership");
            } else {
                showToast(response?.messageCode, false);
            }
        } catch (error) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    };

    const fetchDropDownList = async () => {
        try {
            const whereCondition = {
                isActive: true,
                isDeleted: false
            };
            const payload = listPayload(0, whereCondition, 100000);
            const [
                paymentResponse,
                membershipPlanResponse
            ] = await Promise.all([
                getPaymentTypeList(payload),
                getMembershipPlanList(payload)
            ]);
            if(paymentResponse.success) {
                setPaymentType(paymentResponse.data?.rows);
            } else {
                setPaymentType([]);
            }
            if(membershipPlanResponse.success) {
                setMembershipPlan(membershipPlanResponse.data?.rows);
            } else {
                setMembershipPlan([])
            }
        } catch(err) {
            showToast(err?.message, false);
        }
    }

    const fetchEditMembershipData = useCallback(async () => {
        try {
            if (id) {
                dispatch(startLoading());
                const response = await getMembershipById(id);

                if (response?.statusCode === 200) {
                    console.log(response?.data);
                    // setValue("planName", response.data.planName);
                    // setValue("hours", response.data.hours);
                    // setValue("price", response.data.price);
                } else {
                    showToast(response?.message, false);
                }
            }
        } catch (error) {
          showToast(error?.message, false);
        } finally {
          dispatch(stopLoading());
        }
    }, [id, dispatch]);

    const searchCustomer = async (customerPhone) => {
        try {
            startLoading();
            if(customerPhone.length === 10) {
                const whereCondition = {
                    searchText: customerPhone,
                    isActive: true,
                    isDeleted: false
                };
                const payload = listPayload(0, whereCondition, 1000000);
                const { success, data } = await getCustomerList(payload);
                if(success) {
                    setCustomer(data?.rows);
                } else {
                    setCustomer([]);
                    showToast('Customer Not Found', false)
                }
            } else if(customerPhone.length === 0) {
                setCustomer([]);
            }
        } catch(err) {
          showToast(err?.message, false);
        } finally {
            stopLoading();
        }
    }

    const getOtp = async () => {
        try {
            startLoading();
            const { success, message } = await addExtraHours({
                extraHours: getValues('extraHours')
            });
            if(success) {
                setIsOtpSend(true);
            } else {
                showToast(message, true);
            }
        } catch(err) {
            showToast(err?.message, false);
        } finally {
            stopLoading();
        }
    }

    const verifyOtp = async () => {
        try {
            startLoading();
            const { success, message } = await verifyOTP({
                phoneNumber: loggedInUser.phoneNumber,
                otp: otp
            });
            if(success) {
                setIsOtpSend(false);
                setVerifiedOtp(true);
                setOtp(null);
            } else {
                showToast(message, false);
            }
        } catch(err) {
            showToast(err?.message, false);
        } finally {
            stopLoading();
        }
    }

    const isCardSelected = useMemo(() => {
        const selectedPaymentType = paymentType.find((item) => item.id === getValues('paymentID'));
        return selectedPaymentType && selectedPaymentType.name.toLowerCase() === 'card' ? true : false;
        // eslint-disable-next-line
    }, [watch('paymentID'), getValues, paymentType]);

    const setCustomerSelectedHandler = (id, phone, name, custNo) => {
        setValue('customerID', id);
        searchCustomer(phone);
    };

    const handleSendOtpForMembership = async (info) => {
        try {
            startLoading();
            const { success, message } = await sendMembershipOtp({
                customerID: info.customerID,
                membershipPlanID: info.membershipPlanID,
                validity: info.validity,
                extraHours: info.extraHours || 0
            });
            if(success) {
                setOpenVerifyMembershipModal(true);
            } else {
                showToast(message, false);
            }
        } catch(err) {
            showToast(err?.message, false);
        } finally {
            stopLoading();
        }
    }

    const handleVerifyMembership = async (otp) => {
        try {
            startLoading();
            const { success, message } = await verifyMembershipOtp({
                otp: otp,
                customerID: getValues('customerID')
            });
            if(success) {
                setOpenVerifyMembershipModal(false);
                setVerifyCustomerMembership(true);
                showToast('Verified, You can Save', true);
            } else {
                showToast(message, false);
            }
        } catch(err) {
            showToast(err?.message, false);
        } finally {
            stopLoading();
        }
    }

    const disabledButton = useMemo(() => {
        if(isSubmitting) {
            return true;
        }
        const extraHours = parseInt(getValues('extraHours'));
        if(extraHours > 0 && !verifiedOtp) {
            return true;
        } else {
            return false;
        }
    // eslint-disable-next-line
    }, [watch('extraHours'), isSubmitting, isOtpSend, verifiedOtp]);

    useEffect(() => {
        tag === "edit" && fetchEditMembershipData();
    }, [tag, fetchEditMembershipData]);

    useEffect(() => {
        fetchDropDownList();
    }, []);

    const cancelHandler = () => {
        navigate("/membership");
    };
    return {
        otp,
        control,
        customer,
        isOtpSend,
        verifiedOtp,
        paymentType,
        isSubmitting,
        disabledButton,
        isCardSelected,
        membershipPlan,
        isCustomerModalOpen,
        verifyCustomerMembership,
        openVerifyMembershipModal,
        getOtp,
        setOtp,
        onSubmit,
        verifyOtp,
        setIsOtpSend,
        handleSubmit,
        cancelHandler,
        setVerifiedOtp,
        searchCustomer,
        handleVerifyMembership,
        setIsCustomerModalOpen,
        setCustomerSelectedHandler,
        handleSendOtpForMembership,
        setOpenVerifyMembershipModal,
    }
}
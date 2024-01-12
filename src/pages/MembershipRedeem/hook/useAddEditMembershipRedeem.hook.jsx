import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { listPayload, showToast } from "../../../utils/helper";

import {
    createMembershipRedeem,
    updateMembershipRedeem,
    getMembershipRedeemById,
    getMembershipRedeemList
} from "../../../service/membershipRedeem";
import { getMembership } from "../../../service/membership";
import { getCustomerList, sendMembershipRedeemOtp, verifyMembershipRedeemOtp } from "../../../service/customer";
import { getStaffList } from "../../../service/staff";

import { startLoading, stopLoading } from "../../../redux/loader";
import { loggedInUserAction } from "../../../redux/loggedInUser";

export const useAddEditMembershipRedeem = (tag) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const loggedInUser = useSelector((state) => state.loggedInUser);

    const [isOtpSend, setIsOtpSend] = useState(false);
    const [otp, setOtp] = useState(null);

    const [staff, setStaff] = useState([]);
    const [customer, setCustomer] = useState(null);
    const [membership, setMembership] = useState(null);
    const [membershipRedeemList, setMembershipRedeemList] = useState([]);
    
    const [verifiedOtp, setVerifiedOtp] = useState(false);
    const [openVerifyMembershipModal, setOpenVerifyMembershipModal] = useState(false);

    const { setValue, control, handleSubmit, watch, getValues, formState: { isSubmitting } } = useForm({
        defaultValues: {
            userID: loggedInUser.id,
            customerID: "",
            membershipID: "",
            staffID: "",
            roomNo: "",
            serviceName: "",
            billNo: localStorage.getItem('latestBillNo'),
            minutes: "",
            managerName: "",
        },
        mode: "onBlur",
    });

    const searchCustomer = async () => {
        try {
            const customerPhone = getValues('customerID');
            if (customerPhone.length === 10) {
                const whereCondition = {
                    searchText: customerPhone,
                    isActive: true,
                    isDeleted: false
                };
                const payload = listPayload(0, whereCondition, 1000000);
                const { success, data } = await getCustomerList(payload);
                if (success) {
                    setCustomer(data?.rows[0]);
                    const customerID = data?.rows[0]?.id;
                    const takenMemberShipResponse = await getMembership({ customerID: customerID});
                    if(takenMemberShipResponse.success) {
                        setMembership(takenMemberShipResponse.data);
                    } else {
                        setMembership(null);
                    }
                } else {
                    setCustomer(null);
                }
            } else if (customerPhone.length === 0) {
                setCustomer(null);
            }
        } catch (err) {
            showToast(err?.message, false);
        }
    }

    const handleSendOtpFormMembershipRedeem = async (info) => {
        try {
            startLoading();
            const { success, message } = await sendMembershipRedeemOtp({
                customerID: customer?.id,
                membershipID: membership?.id,
                serviceName: info?.serviceName,
                minutes: info?.minutes
            });
            if(success) {
                setIsOtpSend(true);
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
            const { success, message } = await verifyMembershipRedeemOtp({
                otp: otp,
                customerID: customer?.id
            });
            if(success) {
                setVerifiedOtp(true);
                setOpenVerifyMembershipModal(false);
                showToast('Verified, You can Redeem', true);
            } else {
                showToast(message, false);
            }
        } catch(err) {
            showToast(err?.message, false);
        } finally {
            stopLoading();
        }
    }

    const onSubmit = (info) => {
        console.log(info);
        try {
            dispatch(startLoading());
            const payload = {
                billDetail: {
                    billNo: localStorage.getItem('latestBillNo'),
                    staffID: info.staffID?.id,
                    userID: loggedInUser.id,
                    paymentID: 1,
                    customerID: customer?.id,
                    detail: JSON.stringify([{
                        discount: 0,
                        quantity: 1,
                        rate: 0,
                        serviceID: 1,
                        // membershipPlanID: selectedMemberShipPlan.id,
                        total: 0
                    }]),
                    cardNo: data.cardNo,
                    grandTotal: selectedMemberShipPlan.price,
                    managerName: data.managerName,
                    createdBy: loggedInUser.id,
                    minutes: totalMinutes,
                }
            }
        } catch(err) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    }

    // useEffect(() => {
    //     if(customer && membership && loggedInUser) {
    //         const fetchMembershipRedeemHistory = async () => {
    //             try {
    //                 const whereCondition = {
    //                     userID: loggedInUser.id,
    //                     customerID: customer?.id,
    //                     membershipID: membership?.id,
    //                     isActive: true,
    //                     isDeleted: false
    //                 };
    //                 const payload = listPayload(0, whereCondition, 100000);
    //                 const { success, message, data } = await getMembershipRedeemList(payload);
    //                 if(success) {
    //                     setMembershipRedeemList(data?.rows)
    //                     console.log(data);
    //                 } 
    //             } catch(err) {
    //                 showToast(err?.message, false);
    //             }
    //         }
    //         fetchMembershipRedeemHistory();
    //     }
    // }, [customer, membership, loggedInUser]);

    useEffect(() => {
        const fetchDropDownList = async () => {
            const whereCondition = {
                isActive: true,
                isDeleted: false
            };
            const payload = listPayload(0, whereCondition, 100000);
            const [
                staffResponse,
            ] = await Promise.all([
                getStaffList(listPayload(0, loggedInUser?.px_role?.name?.toLowerCase() === 'admin' ? whereCondition : { ...whereCondition, createdBy: loggedInUser.id }, 100000)),
            ]);
            if (staffResponse?.statusCode === 200 && staffResponse?.success) {
                setStaff(staffResponse.data?.rows);
            } else {
                setStaff([]);
            }
        };
        fetchDropDownList();
    }, [tag]);

    const cancelHandler = () => {
        navigate('/membership-redeem');
    }

    return {
        otp,
        staff,
        control,
        customer,
        isOtpSend,
        membership,
        verifiedOtp,
        isSubmitting,
        openVerifyMembershipModal,
        setOtp,
        onSubmit,
        handleSubmit,
        cancelHandler,
        searchCustomer,
        handleVerifyMembership,
        setOpenVerifyMembershipModal,
        handleSendOtpFormMembershipRedeem
    }

}
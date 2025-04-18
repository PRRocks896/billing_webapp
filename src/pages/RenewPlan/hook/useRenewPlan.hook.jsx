import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { listPayload, showToast, showTwoDecimalWithoutRound } from "../../../utils/helper";

import {
    addExtraHours,
    getMembershipById,
} from "../../../service/membership";
import {
    createRenewPlan,
    getRenewPlanById
} from "../../../service/renewPlan";
import {
    fetchLoggedInUserData
} from "../../../service/loggedInUser";
import { startLoading, stopLoading } from "../../../redux/loader";
import PrintContent from "../../../components/PrintContent";
import { loggedInUserAction } from "../../../redux/loggedInUser";

import { verifyOTP } from "../../../service/login";
import { sendMembershipOtp, verifyMembershipOtp } from "../../../service/customer";
import { getPaymentTypeList } from "../../../service/paymentType";
import { getMembershipPlanList } from "../../../service/membershipPlan";

export const useRenewPlan = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { membershipID, customerID } = useParams();
    const loggedInUser = useSelector((state) => state.loggedInUser);

    const [membershipDetail, setMembershipDetail] = useState(null);

    const [ currentDate, setCurrentDate] = useState(moment(new Date()).format('DD/MM/yyyy'));
    const [paymentType, setPaymentType] = useState([]);
    const [membershipPlan, setMembershipPlan] = useState([]);
    const [isOtpSend, setIsOtpSend] = useState(false);
    const [otp, setOtp] = useState(null);
    const [verifiedOtp, setVerifiedOtp] = useState(false);
    const [verifyCustomerMembership, setVerifyCustomerMembership] = useState(false);
    const [openVerifyMembershipModal, setOpenVerifyMembershipModal] = useState(false);
    const [openVerifyMembershipByMerchantModal, setOpenVerifyMembershipByMerchantModal] = useState(false);

    const { setValue, control, handleSubmit, watch, getValues, formState: { isSubmitting } } = useForm({
        defaultValues: {
            userID: loggedInUser.id,
            customerID: customerID,
            membershipID: membershipID,
            paymentID: "",
            membershipPlanID: "",
            managerName: localStorage.getItem("managerName") || "",
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
            const cardNo = data.cardNo;
            const payload = {
                ...data,
                membershipID: parseInt(membershipID),
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
                },
                minutes: totalMinutes,
                updatedMembershipMinutes: (membershipDetail.minutes + totalMinutes),
                createdBy: loggedInUser?.id,
                // updatedBy: loggedInUser?.id,
            };
            const response = await createRenewPlan(payload);
            if (response?.statusCode === 200) {
                handlePrint(response.data?.id, cardNo);
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

    const handlePrint = async (id, cardNo = 0) => {
        try {
            startLoading();
            const { success, message, data } = await getRenewPlanById(id); //getMembershipById(id);
            console.log(data);
            if (success) {
                const tempTotal = loggedInUser?.isShowGst ? showTwoDecimalWithoutRound(parseFloat((data?.px_membership_plan?.price / 118) * 100).toString()) : data?.px_membership_plan?.price;
                const cgst = loggedInUser?.isShowGst ? (parseFloat(tempTotal) * 0.09).toFixed(2) : 0; 
                const sgst = loggedInUser?.isShowGst ? (parseFloat(tempTotal) * 0.09).toFixed(2) : 0;
                const billData = {
                    subTotal: tempTotal,
                    total: loggedInUser?.isShowGst ? parseFloat(tempTotal) + parseFloat(cgst) + parseFloat(sgst) : data?.px_membership_plan?.price,
                    billNo: data?.billNo,
                    payment: data?.px_payment_type?.name,
                    cardNo: cardNo,
                    date: new Date(data?.createdAt),
                    customer: membershipDetail?.px_customer?.name, //data?.px_customer?.name,
                    customerID: data?.customerID,
                    phone: membershipDetail?.px_customer?.phoneNumber, //data?.px_customer?.phoneNumber,
                    detail: [{
                        item: data?.px_membership_plan?.planName,
                        quantity: 1,
                        rate: tempTotal,
                        total: tempTotal
                    }],
                    phoneNumber: loggedInUser.phoneNumber, //body?.px_customer?.phoneNumber,
                    billTitle: loggedInUser.billTitle,
                    address: loggedInUser.address,
                    phoneNumber2: loggedInUser.phoneNumber2,
                    roleID: loggedInUser.roleID,
                    gstNo: loggedInUser?.gstNo,
                    isShowGst: loggedInUser?.isShowGst,
                    cgst: cgst,
                    sgst: sgst,
                    reviewUrl: loggedInUser.reviewUrl && loggedInUser.reviewUrl.length ? loggedInUser.reviewUrl : null 
                }
                const branchData = {
                    title: billData.billTitle
                        ? billData.billTitle
                        : "green health spa and saloon",
                    address: billData.address
                        ? billData.address
                        : "NO, 52 HUDA COLONY, MANIKONDA HYDERABAD, TELANGANA - 500089",
                    phone1: billData.phoneNumber,
                    phone2: billData.phoneNumber2 ? billData.phoneNumber2 : "",
                    reviewUrl: billData.reviewUrl
                };
                const printWindow = window.open("", "_blank", "popup=yes");
                printWindow.document.write(PrintContent(billData, branchData, false));
                printWindow.document.close();
                printWindow.onload = () => {
                    printWindow.print();
                    printWindow.close();
                };
            } else {
                showToast(message, false);
            }
        } catch(error) {
            showToast(error.message, false);
        } finally {
            stopLoading();
        }
    }

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
            if (membershipID) {
                dispatch(startLoading());
                const { success, message, data } = await getMembershipById(membershipID);
                if (success) {
                    setMembershipDetail(data);
                    setValue('customerID', data.customerID);
                    // setValue('paymentID', data.paymentID);
                    // setValue('membershipPlanID', data.membershipPlanID);
                    // setValue('extraHours', '' + data.extraHours);
                    // setValue('validity', data.validity);
                    // setValue('managerName', data.managerName);
                    // setValue('billNo', data.billNo);
                    // setValue('cardNo', data.cardNo);
                    // setCurrentDate(moment(data.createdAt).format('DD/MM/yyyy'))
                } else {
                    showToast(message, false);
                }
            }
        } catch (error) {
          showToast(error?.message, false);
        } finally {
          dispatch(stopLoading());
        }
        // eslint-disable-next-line
    }, [membershipID, dispatch, setCurrentDate, setValue]);

    const getOtp = async () => {
        try {
            startLoading();
            const { success, message } = await addExtraHours({
                customerID: customerID,
                membershipPlanID: getValues('membershipPlanID'),
                validity: getValues('validity'),
                extraHours: getValues('extraHours') || 0
            });
            if(success) {
                setIsOtpSend(true);
                setOpenVerifyMembershipByMerchantModal(true);
            } else {
                showToast(message, true);
            }
        } catch(err) {
            showToast(err?.message, false);
        } finally {
            stopLoading();
        }
    }

    const verifyOtp = async (otp) => {
        try {
            startLoading();
            const { success, message } = await verifyOTP({
                phoneNumber: loggedInUser.phoneNumber,
                otp: otp
            });
            if(success) {
                handleSendOtpForMembership({
                    customerID: getValues('customerID'),
                    membershipPlanID: getValues('membershipPlanID'),
                    validity: getValues('validity'),
                    extraHours: getValues('extraHours') || 0
                })
                setIsOtpSend(false);
                setVerifiedOtp(true);
                setOtp(null);
                setOpenVerifyMembershipByMerchantModal(false);
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

    const isCardSelected = useMemo(() => {
        const selectedPaymentType = paymentType.find((item) => item.id === getValues('paymentID'));
        return selectedPaymentType && selectedPaymentType.name.toLowerCase() === 'card' ? true : false;
        // eslint-disable-next-line
    }, [watch('paymentID'), getValues, paymentType]);

    const setCustomerSelectedHandler = (id, phone, name, custNo) => {
        setValue('customerID', id);
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
                onSubmit(getValues());
                // showToast('Verified, You can Save', true);
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
        // const extraHours = parseInt(getValues('extraHours'));
        // if(extraHours > 0 && !verifiedOtp) {
        //     return true;
        // } else {
            return false;
        // }
    // eslint-disable-next-line
    }, [watch('extraHours'), isSubmitting, isOtpSend, verifiedOtp]);

    useEffect(() => {
        fetchEditMembershipData();
    }, [membershipID, fetchEditMembershipData]);

    useEffect(() => {
        fetchDropDownList();
    }, []);

    const cancelHandler = () => {
        navigate("/membership");
    };
    const handleCancelVerifyPermission = () => {
        setIsOtpSend(false);
        setVerifiedOtp(false);
        setOtp(null);
        setOpenVerifyMembershipByMerchantModal(false);
        setOpenVerifyMembershipModal(false);
    }
    return {
        otp,
        control,
        isOtpSend,
        currentDate,
        verifiedOtp,
        paymentType,
        isSubmitting,
        disabledButton,
        isCardSelected,
        membershipPlan,
        membershipDetail,
        verifyCustomerMembership,
        openVerifyMembershipModal,
        openVerifyMembershipByMerchantModal,
        getOtp,
        setOtp,
        onSubmit,
        verifyOtp,
        setIsOtpSend,
        handleSubmit,
        cancelHandler,
        setVerifiedOtp,
        handleVerifyMembership,
        setCustomerSelectedHandler,
        handleSendOtpForMembership,
        handleCancelVerifyPermission,
        setOpenVerifyMembershipModal,
        setOpenVerifyMembershipByMerchantModal,
    }
}
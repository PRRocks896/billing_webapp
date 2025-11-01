import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { listPayload, showToast, showTwoDecimalWithoutRound, convertGstStringToNumber, getBaseAmountFromGST } from "../../../utils/helper";

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
    const [isPayment, setIsPayment] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const { setValue, control, handleSubmit, watch, getValues, formState: { isSubmitting } } = useForm({
        defaultValues: {
            userID: loggedInUser.id,
            customerID: customerID,
            membershipID: membershipID,
            paymentID: null,
            membershipPlanID: "",
            managerName: localStorage.getItem("managerName") || "",
            customerPhoto: "",
            billNo: localStorage.getItem('latestBillNo'),
            extraHours: "0",
            validity: "6",
            cardNo: "",
            paymentDetail: [],
        },
        mode: "onBlur",
    });

    const gstValue = useMemo(() => {
        if(loggedInUser && loggedInUser.px_company && loggedInUser.px_company.CGST && loggedInUser.px_company.SGST) {
            return {
                CGST: loggedInUser.px_company.CGST,
                SGST: loggedInUser.px_company.SGST
            }
        }
        return {
            CGST: 0,
            SGST: 0
        }
    }, [loggedInUser]);

    const togglePaymentModal = () => {
        setIsPaymentModalOpen(!isPaymentModalOpen);
    }

    const onSubmit = async (data) => {
        try {
            dispatch(startLoading());
            const selectedMemberShipPlan = membershipPlan.find(item => item.id === data.membershipPlanID);
            const totalMinutes = (selectedMemberShipPlan.hours + parseInt(data.extraHours)) * 60 || 0;
            const payload = {
                ...data,
                membershipID: parseInt(membershipID),
                managerName: localStorage.getItem('managerId'),
                billDetail: data.paymentDetail.map((payment) => {
                    let total = parseFloat(payment.amount || '0');
                    const cgst = (total * convertGstStringToNumber(gstValue.CGST).numeric).toFixed(2);
                    const sgst = (total * convertGstStringToNumber(gstValue.SGST).numeric).toFixed(2);
                    total = total - cgst - sgst;
                    return {
                        staffID: 1,
                        userID: loggedInUser.id,
                        roomID: 1,
                        paymentID: payment.id,
                        customerID: data.customerID,
                        detail: [{
                            discount: 0,
                            quantity: 1,
                            rate: total,
                            membershipPlanID: selectedMemberShipPlan.id,
                            hsnCode: selectedMemberShipPlan?.hsnCode || '',
                            total: total
                        }],
                        cardNo: payment.cardNo || '',
                        grandTotal: (total + parseFloat(cgst) + parseFloat(sgst)),
                        managerName: localStorage.getItem('managerId'),
                        createdBy: loggedInUser.id,
                        cgst: cgst,
                        sgst: sgst,
                    }
                }),
                minutes: totalMinutes,
                updatedMembershipMinutes: (membershipDetail.minutes + totalMinutes),
                createdBy: loggedInUser?.id,
                // updatedBy: loggedInUser?.id,
            };
            const response = await createRenewPlan(payload);
            if (response?.statusCode === 200) {
                handlePrint(response.data?.id);
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
            if (success) {
                const tableData = data.billDetail?.map((payment) => {
                    const tempTotal = loggedInUser?.isShowGst ? showTwoDecimalWithoutRound(getBaseAmountFromGST(payment?.grandTotal, (parseFloat(gstValue.CGST) + parseFloat(gstValue.SGST)))).toString() : payment?.grandTotal;
                    const cgst = loggedInUser?.isShowGst ? (parseFloat(tempTotal) * convertGstStringToNumber(gstValue.CGST).numeric).toFixed(2) : 0; 
                    const sgst = loggedInUser?.isShowGst ? (parseFloat(tempTotal) * convertGstStringToNumber(gstValue.SGST).numeric).toFixed(2) : 0;
                    return {
                        item: data?.px_membership_plan?.planName,
                        hsnCode: data?.px_membership_plan?.hsnCode,
                        quantity: 1,
                        total: tempTotal,
                        subTotal: tempTotal,
                        cgst: cgst,
                        sgst: sgst,
                        payment: payment?.px_payment_type?.name,
                        paymentId: payment.id,
                        cardNo: payment.cardNo,
                        billNo: payment.billNo,
                        grandTotal: Math.round(parseFloat(tempTotal) + parseFloat(cgst) + parseFloat(sgst))
                    }
                });
                const billData = {
                    date: new Date(data?.createdAt),
                    customer: membershipDetail?.px_customer?.name, //data?.px_customer?.name,
                    customerID: data?.customerID,
                    phone: membershipDetail?.px_customer?.phoneNumber, //data?.px_customer?.phoneNumber,
                    phoneNumber: loggedInUser.phoneNumber, //body?.px_customer?.phoneNumber,
                    billTitle: loggedInUser.billTitle,
                    address: loggedInUser.address,
                    phoneNumber2: loggedInUser.phoneNumber2,
                    roleID: loggedInUser.roleID,
                    gstNo: loggedInUser?.gstNo,
                    isShowGst: loggedInUser?.isShowGst,
                    tableData: tableData,
                    cgstPercentage: gstValue.CGST,
                    sgstPercentage: gstValue.SGST,
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
                if (printWindow && printWindow.document) {
                    printWindow.document.write(PrintContent(billData, branchData, false));
                    printWindow.document.close();
                    printWindow.onload = () => {
                        printWindow.print();
                        printWindow.close();
                    };
                }
            } else {
                showToast(message, false);
            }
        } catch(error) {
            showToast(error.message, false);
        } finally {
            stopLoading();
        }
    }

    const handlePaymentDetail = (detail) => {
        setValue('paymentDetail', detail);
        togglePaymentModal()
        setIsPayment(true);
        getOtp();
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

    const selectedMemberShipPlan = useMemo(() => {
        const selectedMemberShip = getValues('membershipPlanID');
        if(selectedMemberShip && membershipPlan && membershipPlan.length > 0) {
            return membershipPlan.find(item => item.id === selectedMemberShip);
        }
    }, [watch('membershipPlanID'), membershipPlan]);

    return {
        otp,
        control,
        isOtpSend,
        isPayment,
        currentDate,
        verifiedOtp,
        paymentType,
        isSubmitting,
        disabledButton,
        isCardSelected,
        membershipPlan,
        membershipDetail,
        isPaymentModalOpen,
        selectedMemberShipPlan,
        verifyCustomerMembership,
        openVerifyMembershipModal,
        openVerifyMembershipByMerchantModal,
        getOtp,
        setOtp,
        onSubmit,
        getValues,
        verifyOtp,
        setIsOtpSend,
        handleSubmit,
        cancelHandler,
        setVerifiedOtp,
        togglePaymentModal,
        handlePaymentDetail,
        handleVerifyMembership,
        setCustomerSelectedHandler,
        handleSendOtpForMembership,
        handleCancelVerifyPermission,
        setOpenVerifyMembershipModal,
        setOpenVerifyMembershipByMerchantModal,
    }
}
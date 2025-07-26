import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { listPayload, showToast, showTwoDecimalWithoutRound, showTwoDecimal } from "../../../utils/helper";

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
import PrintContent from "../../../components/PrintContent";
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

    const [currentDate, setCurrentDate] = useState(moment(new Date()).format('DD/MM/yyyy'));
    const [paymentType, setPaymentType] = useState([]);
    const [customer, setCustomer] = useState([]);
    const [membershipPlan, setMembershipPlan] = useState([]);
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
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
            customerID: "",
            paymentID: "",
            membershipPlanID: "",
            managerName: localStorage.getItem("managerName") || '',
            customerPhoto: "",
            billNo: localStorage.getItem('latestBillNo'),
            extraHours: "0",
            validity: "6",
            cardNo: "",
            paymentDetail: [],
        },
        mode: "onBlur",
    });

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
                billDetail: data.paymentDetail.map((payment) => {
                    let total = parseFloat(payment.amount || '0');
                    const cgst = (total * 0.09).toFixed(2);
                    const sgst = (total * 0.09).toFixed(2);
                    total = total - cgst - sgst;
                    return {
                        staffID: 1,
                        userID: loggedInUser.id,
                        roomID: 1,
                        paymentID: payment.id,
                        customerID: data.customerID,
                        detail: JSON.stringify([{
                            discount: 0,
                            quantity: 1,
                            rate: total,
                            membershipPlanID: selectedMemberShipPlan.id,
                            total: total
                        }]),
                        cardNo: payment.cardNo || '',
                        grandTotal: (total + parseFloat(cgst) + parseFloat(sgst)),
                        managerName: data.managerName,
                        createdBy: loggedInUser.id,
                        cgst: cgst,
                        sgst: sgst,
                    }
                }),
                minutes: totalMinutes,
            };
            const response = tag === "add"
                ? await createMembership({ ...payload, createdBy: loggedInUser.id, updatedBy: loggedInUser.id, managerName: localStorage.getItem('managerId') })
                : await updateMembership({ ...data, updatedBy: loggedInUser.id }, id);
            if (response?.statusCode === 200) {
                tag === "add" && handlePrint(response.data?.id);
                const { success, data } = await fetchLoggedInUserData();
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
            console.error(error);
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    };

    const handlePaymentDetail = (detail) => {
        setValue('paymentDetail', detail);
        togglePaymentModal()
        setIsPayment(true);
        getOtp();
    }

    const handlePrint = async (id, cardNo = 0) => {
        try {
            startLoading()
            const { success, message, data } = await getMembershipById(id);
            if (success) {
                const tableData = data.billDetail?.map((payment) => {
                    const tempTotal = loggedInUser?.isShowGst ? showTwoDecimalWithoutRound(parseFloat((payment?.grandTotal / 118) * 100).toString()) : payment?.grandTotal;
                    const cgst = loggedInUser?.isShowGst ? (parseFloat(tempTotal) * 0.09).toFixed(2) : 0; 
                    const sgst = loggedInUser?.isShowGst ? (parseFloat(tempTotal) * 0.09).toFixed(2) : 0;
                    return {
                        item: data?.px_membership_plan?.planName,
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
                    customer: data?.px_customer?.name,
                    customerID: data?.customerID,
                    phone: data?.px_customer?.phoneNumber,
                    phoneNumber: loggedInUser.phoneNumber, //body?.px_customer?.phoneNumber,
                    billTitle: loggedInUser.billTitle,
                    address: loggedInUser.address,
                    phoneNumber2: loggedInUser.phoneNumber2,
                    roleID: loggedInUser.roleID,
                    gstNo: loggedInUser?.gstNo,
                    isShowGst: loggedInUser?.isShowGst,
                    tableData: tableData,
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
        } catch (error) {
            console.error(error);
            showToast(error.message, false);
        } finally {
            stopLoading()
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
        } catch (err) {
            showToast(err?.message, false);
        }
    }

    const fetchEditMembershipData = useCallback(async () => {
        try {
            if (id) {
                dispatch(startLoading());
                const { success, message, data } = await getMembershipById(id);

                if (success) {
                    const { managerName } = data;
                    searchCustomer(data.px_customer?.phoneNumber);
                    setValue('customerID', data.customerID);
                    setValue('paymentID', data.paymentID);
                    setValue('membershipPlanID', data.membershipPlanID);
                    setValue('extraHours', '' + data.extraHours);
                    setValue('validity', data.validity);
                    setValue('managerName', Array.isArray(managerName) ? managerName.map((manager) => manager?.name).join(',') : managerName?.name);
                    setValue('billNo', data.billNo);
                    setValue('cardNo', data.billDetail && data.billDetail.cardNo ? data.billDetail.cardNo : null);
                    setCurrentDate(moment(data.createdAt).format('DD/MM/yyyy'))
                } else {
                    showToast(message, false);
                }
            }
        } catch (error) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    }, [id, dispatch, setCurrentDate, setValue]);

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

    const getOtp = async () => {
        try {
            startLoading();
            const { success, message } = await addExtraHours({
                customerID: getValues('customerID'),
                membershipPlanID: getValues('membershipPlanID'),
                validity: getValues('validity'),
                extraHours: getValues('extraHours') || 0
            });
            if (success) {
                setIsOtpSend(true);
                setOpenVerifyMembershipByMerchantModal(true);
            } else {
                showToast(message, true);
            }
        } catch (err) {
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
            if (success) {
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
        } catch (err) {
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
            if (success) {
                setOpenVerifyMembershipModal(true);
            } else {
                showToast(message, false);
            }
        } catch (err) {
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
            if (success) {
                setOpenVerifyMembershipModal(false);
                setVerifyCustomerMembership(true);
                onSubmit(getValues());
                // showToast('Verified, You can Save', true);
            } else {
                showToast(message, false);
            }
        } catch (err) {
            showToast(err?.message, false);
        } finally {
            stopLoading();
        }
    }

    const disabledButton = useMemo(() => {
        if (isSubmitting) {
            return true;
        }
        // const extraHours = parseInt(getValues('extraHours'));
        // if (extraHours > 0 && !verifiedOtp) {
        //     return true;
        // } else {
            return false;
        // }
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
        customer,
        isPayment,
        isOtpSend,
        currentDate,
        verifiedOtp,
        paymentType,
        isSubmitting,
        disabledButton,
        isCardSelected,
        membershipPlan,
        isPaymentModalOpen,
        isCustomerModalOpen,
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
        searchCustomer,
        togglePaymentModal,
        handlePaymentDetail,
        handleVerifyMembership,
        setIsCustomerModalOpen,
        setCustomerSelectedHandler,
        handleSendOtpForMembership,
        handleCancelVerifyPermission,
        setOpenVerifyMembershipModal,
        setOpenVerifyMembershipByMerchantModal
    }
}
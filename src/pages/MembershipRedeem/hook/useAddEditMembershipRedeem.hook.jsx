import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { listPayload, showToast } from "../../../utils/helper";

import {
    createMembershipRedeem,
    getMembershipRedeemById,
    getMembershipRedeemList
} from "../../../service/membershipRedeem";
import { fetchLoggedInUserData } from "../../../service/loggedInUser";
import { getMembershipList } from "../../../service/membership";
import { getCustomerList, sendMembershipRedeemOtp, verifyMembershipRedeemOtp } from "../../../service/customer";
import { getStaffList } from "../../../service/staff";
import { getServiceList } from "../../../service/service";

import { startLoading, stopLoading } from "../../../redux/loader";
import { loggedInUserAction } from "../../../redux/loggedInUser";
import PrintContent from "../../../components/PrintContent";

export const useAddEditMembershipRedeem = (tag) => {
    // const navigate = useNavigate();
    const dispatch = useDispatch();
    const loggedInUser = useSelector((state) => state.loggedInUser);

    const [isOtpSend, setIsOtpSend] = useState(false);
    const [otp, setOtp] = useState(null);

    const [staff, setStaff] = useState([]);
    const [service, setService] = useState([]);
    const [customer, setCustomer] = useState(null);
    const [membership, setMembership] = useState([]);
    const [membershipRedeemList, setMembershipRedeemList] = useState([]);

    const [verifiedOtp, setVerifiedOtp] = useState(false);
    const [openVerifyMembershipModal, setOpenVerifyMembershipModal] = useState(false);

    const { setValue, control, handleSubmit, watch, getValues, reset, formState: { isSubmitting } } = useForm({
        defaultValues: {
            userID: loggedInUser.id,
            customerID: "",
            membershipID: "",
            staffID: "",
            roomNo: "",
            serviceID: "",
            serviceName: "",
            billNo: localStorage.getItem('latestBillNo'),
            minutes: "",
            managerName: "",
        },
        mode: "onBlur",
    });

    const searchCustomer = async () => {
        try {
            dispatch(startLoading());
            setValue('membershipID', "");
            const customerPhone = getValues('customerID');
            if (customerPhone.length === 10) {
                const whereCondition = {
                    searchText: customerPhone,
                    isActive: true,
                    isDeleted: false
                };
                const payload = listPayload(0, whereCondition, 1000000);
                const { success, message, data } = await getCustomerList(payload);
                if (success) {
                    setCustomer(data?.rows[0]);
                    const customerID = data?.rows[0]?.id;
                    const takenMemberShipResponse = await getMembershipList(listPayload(0, { customerID: customerID, isActive: true, isDeleted: false }, 1000000, {}, false));
                    if (takenMemberShipResponse.success) {
                        if(takenMemberShipResponse.data?.rows?.length === 1) {
                            setValue('membershipID', takenMemberShipResponse.data?.rows[0])
                            fetchMembershipRedeemHistory();
                        }
                        setMembership(takenMemberShipResponse.data?.rows);
                    } else {
                        setMembership([]);
                        showToast(takenMemberShipResponse.message, false);
                    }
                } else {
                    setCustomer(null);
                    showToast(message, false);
                }
            } else if (customerPhone.length === 0) {
                setCustomer(null);
            }
        } catch (err) {
            showToast(err?.message, false);
        } finally {
            setMembershipRedeemList([]);
            dispatch(stopLoading());
        }
    }

    const handleSendOtpFormMembershipRedeem = async (info) => {
        try {
            if(info.membershipID?.minutes === 0) {
                showToast(`Minutes not Available`, false);
                return;
            }
            if(parseInt(info.minutes) > info.membershipID?.minutes) {
                showToast(`Only ${info.membershipID?.minutes} Minutes Available`, false);
                return;
            }
            dispatch(startLoading());
            const { success, message } = await sendMembershipRedeemOtp({
                customerID: customer?.id,
                membershipID: info?.membershipID?.id,
                serviceName: service.find((item) => item.id === info.serviceID)?.name,
                minutes: info?.minutes
            });
            if (success) {
                setIsOtpSend(true);
                setOpenVerifyMembershipModal(true);
            } else {
                showToast(message, false);
            }
        } catch (err) {
            showToast(err?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    }

    const handleVerifyMembership = async (otp) => {
        try {
            dispatch(startLoading());
            const { success, message } = await verifyMembershipRedeemOtp({
                otp: otp,
                customerID: customer?.id
            });
            if (success) {
                setOtp(null);
                setVerifiedOtp(true);
                setOpenVerifyMembershipModal(false);
                onSubmit(getValues());
                // showToast('Verified, You can Redeem', true);
            } else {
                showToast(message, false);
            }
        } catch (err) {
            showToast(err?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    }

    const onSubmit = async (info) => {
        try {
            // console.log(info);
            dispatch(startLoading());
            const payload = {
                userID: loggedInUser?.id,
                customerID: customer?.id,
                membershipID: info?.membershipID?.id,
                membershipPurchaseUserID: info?.membershipID?.userID,
                staffID: info.staffID,
                serviceID: info.serviceID,
                billNo: info.billNo,
                minutes: info.minutes,
                remainMinutes: parseInt(info?.membershipID?.minutes) > 0 ? (parseInt(info?.membershipID?.minutes) - parseInt(info.minutes)) : 0,
                managerName: info.managerName,
                createdBy: loggedInUser?.id,
                updatedBy: loggedInUser?.id,
                billDetail: {
                    roomNo: info.roomNo,
                    billNo: info.billNo,
                    staffID: info.staffID,
                    userID: loggedInUser.id,
                    paymentID: 1,
                    customerID: customer?.id,
                    detail: JSON.stringify([{
                        discount: 1,
                        quantity: 1,
                        rate: 1,
                        total: 1,
                        serviceID: info.serviceID,
                    }]),
                    cardNo: "",
                    grandTotal: 1,
                    managerName: info.managerName,
                    createdBy: loggedInUser.id,
                }
            }
            const { success, message, data } = await createMembershipRedeem(payload)
            if (success) {
                showToast(message, true);
                handlePrint(data?.id);
                const loginUserResponse = await fetchLoggedInUserData();
                if (success) {
                    const latestBillNo = loginUserResponse.data.latestBillNo;
                    const latestCustomerNo = loginUserResponse.data.latestCustomerNo;
                    localStorage.setItem('latestBillNo', latestBillNo);
                    localStorage.setItem("latestCustomerNo", latestCustomerNo);
                    dispatch(loggedInUserAction.storeLoggedInUserData(loginUserResponse.data));
                    setValue('billNo', latestBillNo);
                }
                reset();
                setMembership([]);
                setVerifiedOtp(false);
                setMembershipRedeemList([]);
            } else {
                showToast(message, false);
            }
        } catch (err) {
            showToast(err?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    }

    const handlePrint = async (id) => {
        try {
            const { success, message, data } = await getMembershipRedeemById(id);
            if(success) {
                const billData = {
                    subTotal: 1,
                    total: 1,
                    billNo: data?.billNo,
                    payment: 'CASH',
                    cardNo: '',
                    date: new Date(data?.createdAt),
                    customer: data?.px_customer?.name,
                    customerID: data?.customerID,
                    phone: data?.px_customer?.phoneNumber,
                    staff: data?.px_staff?.nickName,
                    roomNo: getValues('roomNo') || '',
                    detail: [{
                        item: data?.px_service?.name,
                        quantity: 1,
                        rate: 1,
                        total: 1
                    }],
                    phoneNumber: loggedInUser.phoneNumber, //body?.px_customer?.phoneNumber,
                    billTitle: loggedInUser.billTitle,
                    address: loggedInUser.address,
                    phoneNumber2: loggedInUser.phoneNumber2,
                    roleID: loggedInUser.roleID,
                    gstNo: loggedInUser?.gstNo,
                    isShowGst: false
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
                };
                const printWindow = window.open("", "_blank", "popup=yes");
                printWindow.document.write(PrintContent(billData, branchData));
                printWindow.document.close();
                printWindow.print();
                printWindow.close();
            } else {
                showToast(message, false);
            }
        } catch (error) {
            showToast(error.message, false);
        }
    }

    const isSelectedMembership = useMemo(() => {
        if(typeof getValues('membershipID') === 'object') {
            return true;
        }
        return false;
        // eslint-disable-next-line
    }, [watch('membershipID')]);

    const filterService = useMemo(() => {
        const selectedMinutes = parseInt(getValues('minutes'));
        return service?.filter((item) => item.minutes === selectedMinutes);
        // eslint-disable-next-line
    }, [service, watch('minutes')]);

    const fetchMembershipRedeemHistory = async () => {
        try {
            const whereCondition = {
                // userID: loggedInUser.id,
                customerID: customer?.id,
                membershipID: getValues('membershipID')?.id,
                isActive: true,
                isDeleted: false
            };
            const payload = listPayload(0, whereCondition, 100000);
            const { success, data } = await getMembershipRedeemList(payload);
            if(success) {
                setMembershipRedeemList(data?.rows)
            } 
        } catch(err) {
            showToast(err?.message, false);
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
                serviceResponse
            ] = await Promise.all([
                getStaffList(listPayload(0, loggedInUser?.px_role?.name?.toLowerCase() === 'admin' ? {...whereCondition, searchText: "THERAPIST"} : { ...whereCondition, searchText: "THERAPIST", createdBy: loggedInUser.id }, 100000)),
                getServiceList(payload),
            ]);
            if (staffResponse?.statusCode === 200 && staffResponse?.success) {
                setStaff(staffResponse.data?.rows);
            } else {
                setStaff([]);
            }
            if (serviceResponse.success) {
                // const { rows } = serviceResponse.data;
                // const filterRow = rows?.filter((item) => [60, 120].includes(item.minutes));
                setService(serviceResponse.data?.rows);
            } else {
                setService([]);
            }
        };
        fetchDropDownList();
        // eslint-disable-next-line
    }, [tag]);

    const cancelHandler = () => {
        // navigate('/membership-redeem');
        searchCustomer();
    }

    const filterMembershipList = useMemo(() => {
        const filterData = [];
        let isMinutesZero = false;
        membership.forEach((item) => {
            // if(item.userID === loggedInUser.id) {
                if(item.minutes > 0) {
                    filterData.push(item);
                } else {
                    isMinutesZero = true;
                }
            // }
            if(isMinutesZero) {
                filterData.push(item);
            }
        })
        return filterData;
    }, [/*loggedInUser,*/ membership]);

    return {
        otp,
        staff,
        control,
        service,
        customer,
        isOtpSend,
        membership,
        verifiedOtp,
        loggedInUser,
        isSubmitting,
        filterService,
        filterMembershipList,
        isSelectedMembership,
        membershipRedeemList,
        openVerifyMembershipModal,
        setOtp,
        onSubmit,
        setValue,
        getValues,
        handleSubmit,
        cancelHandler,
        searchCustomer,
        handleVerifyMembership,
        fetchMembershipRedeemHistory,
        setOpenVerifyMembershipModal,
        handleSendOtpFormMembershipRedeem
    }

}
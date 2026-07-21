import { openSnackbar } from "api/snackbar";
import countries from "data/countries";
import useAuth from "hooks/useAuth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { getEmployeeTypePayload } from "service/employee-type";
import { createStaff, getStaffById, getStaff, updateStaff, staffTransferRequest, staffTransferVerify, verifyIfscCode } from "service/staff";
import { getStatesList } from "service/state";
import { getUserList } from "service/user";
import { convertToFormData } from "utils/helper";

export type StaffFormValue = {
    userID: number | null;
    stateID: number | null;
    employeeTypeID: number | null;
    name: string;
    nickName: string;
    countryCode: string;
    phoneNumber: string;
    fatherName: string;
    fatherPhone: string;
    // fatherIdNumber: string;
    fatherAddress: string;
    // fatherIdPhoto: any;
    // motherIdNumber: string;
    // motherAddress: string;
    // motherIdPhoto: any;
    gender: 'Male' | 'Female' | null;
    salary: string;
    pastWorking: string;
    experience: string;
    localAddress: string;
    permanentAddress: string;
    accountHolderName: string;
    accountNumber: string;
    reEnterAccountNumber: string;
    ifscCode: string;
    bankBranch: string;
    accountType: string;
    refName: string;
    refPhone: string;
    isMarriage: boolean;
    qualification: string;
    husbandName: string;
    dob: string;
    email: string;
};

const defaultValues: StaffFormValue = {
    userID: null,
    employeeTypeID: null,
    stateID: null,
    name: "",
    nickName: "",
    countryCode: "",
    phoneNumber: "",
    fatherName: "",
    fatherPhone: "",
    // fatherIdNumber: "",
    fatherAddress: "",
    // fatherIdPhoto: null,
    // motherIdNumber: "",
    // motherAddress: "",
    // motherIdPhoto: null,
    salary: "",
    gender: null,
    pastWorking: "",
    experience: "",
    localAddress: "",
    permanentAddress: "",
    accountHolderName: "",
    accountNumber: "",
    bankBranch: "",
    reEnterAccountNumber: "",
    ifscCode: "",
    accountType: "saving",
    refName: "",
    refPhone: "",
    isMarriage: false,
    qualification: "",
    husbandName: "",
    dob: "",
    email: ""
};

const UseAddEditStaff = () => {
    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { user, isAdmin, startLoading, stopLoading } = useAuth();

    const [employeeTypeList, setEmployeeTypeList] = useState<any[]>([]);
    const [branchList, setBranchList] = useState<any[]>([]);
    const [isShowBankDetail, setIsShowBankDetail] = useState<boolean>(true);
    const [verifiedOtp, setVerifiedOtp] = useState<boolean>(false);
    const [openVerifyOtpModal, setOpenVerifyOtpModal] = useState<boolean>(false);
    const [isStaffNoOtpSend, setIsStaffNoOtpSend] = useState<boolean>(false);

    const [isStaffFound, setIsStaffFound] = useState<boolean | null>(null);
    const [staffPhoneNumber, setStaffPhoneNumber] = useState<string>('');
    const [staffData, setStaffData] = useState<any>(null);

    const [statesList, setStatesList] = useState<any[]>([]);

    const countryCodeList = useMemo(() => {
        return countries?.map((country) => {
            return {
                label: `${country.phone} (${country.label})`,
                value: country.phone.split('+')[1]
            }
        })
    }, [countries]);

    const [ifscVerified, setIfscVerified] = useState<boolean | null>(null);

    const {
        control,
        formState: { isSubmitting },
        watch,
        setValue,
        getValues,
        setError,
        clearErrors,
        handleSubmit,
    } = useForm<StaffFormValue>({
        defaultValues,
        mode: 'onChange'
    });

    const isMarriage = useMemo(() => watch('isMarriage'), [watch('isMarriage')]);

    const isSameBranchStaff = useMemo(() => {
        if (staffData && user) {
            return staffData.userID === user.id;
        }
        return false;
    }, [staffData, user])

    const toggleIsStaffFound = useCallback(() => setIsStaffFound((prev: boolean | null) => prev === null ? false : !prev), []);

    const handleBack = () => navigate("/staff");

    /**
     * Verifies an IFSC code against the backend API.
     * Called via react-hook-form's async `validate` rule on the ifscCode field.
     * Returns `true` on success, or an error message string on failure.
     */
    const handleIfscVerify = useCallback(async (ifsc: string): Promise<true | string> => {
        const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        // Skip API call if the format is already invalid (the `pattern` rule handles that message)
        if (!ifsc || !IFSC_REGEX.test(ifsc)) {
            setIfscVerified(null);
            return true; // Let the `pattern` rule display the format error
        }
        try {
            const { success, message, data }: any = await verifyIfscCode({ ifscCode: ifsc });
            if (success) {
                setValue("bankBranch", (data?.data?.detail?.BRANCH || data?.detail?.BRANCH || ''))
                setIfscVerified(true);
                clearErrors('ifscCode');
                return true;
            } else {
                setIfscVerified(false);
                return message || 'IFSC Code not found. Please check and try again.';
            }
        } catch (error: any) {
            setIfscVerified(false);
            return error?.message || 'Failed to verify IFSC Code. Please try again.';
        }
    }, [clearErrors]);

    const fetch = async () => {
        try {
            startLoading();
            const { success, message, data }: any = await getStaffById(Number(id));
            if (success) {
                setValue("name", data.name);
                setValue("employeeTypeID", data.employeeTypeID);
                setValue("nickName", data.nickName);
                setValue("phoneNumber", data.phoneNumber);
                setValue("fatherName", data.fatherName);
                setValue("fatherPhone", data.fatherPhone);
                setValue("salary", data.salary);
                setValue("pastWorking", data.pastWorking);
                setValue("experience", data.experience);
                setValue("localAddress", data.localAddress);
                setValue("permanentAddress", data.permanentAddress);
                setValue("accountHolderName", data.accountHolderName);
                setValue("accountNumber", data.accountNumber);
                setValue("reEnterAccountNumber", data.accountNumber);
                setValue("ifscCode", data.ifscCode);
                setValue("accountType", data.accountType);
                setValue("refName", data.refName);
                setValue("refPhone", data.refPhone);
                setValue("countryCode", data.countryCode);
                // setValue("fatherIdNumber", data.fatherIdNumber);
                setValue("fatherAddress", data.fatherAddress);
                // setValue("fatherIdPhoto", data.fatherIdPhoto);
                // setValue("motherIdNumber", data.motherIdNumber);
                // setValue("motherAddress", data.motherAddress);
                // setValue("motherIdPhoto", data.motherIdPhoto);
                setValue("gender", data.gender);
                setValue("isMarriage", data.isMarriage);
                setValue("qualification", data.qualification);
                setValue("husbandName", data.husbandName);
                setValue("dob", data.dob);
                setValue("email", data.email);
                setValue("bankBranch", data.bankBranch);
                setValue("stateID", data.stateID);
                // setIsStaffFound(true);
                // setStaffPhoneNumber(data.phoneNumber);
                setStaffData(data);
                setIsShowBankDetail(true);
            } else {
                openSnackbar({
                    open: true,
                    message: message || 'Something went Wrong',
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
        } finally {
            stopLoading();
        }
    }

    const onSubmit = async (data: StaffFormValue) => {
        try {
            startLoading();
            let payload: any = {
                ...data,
                phoneNumber: Number(data.phoneNumber)
            };
            delete payload['reEnterAccountNumber'];
            if (mode && mode === 'edit' && id) {
                payload = {
                    ...payload,
                    updatedBy: user?.id
                };
            } else {
                payload = {
                    ...payload,
                    createdBy: user?.id
                };
                if (!isAdmin) {
                    payload = {
                        ...payload,
                        isActive: false,
                    }
                }
            }

            // if ((data.fatherIdPhoto || data.motherIdPhoto) && (typeof data.fatherIdPhoto !== 'string' || typeof data.motherIdPhoto !== 'string')) {
            //     payload = convertToFormData(payload, false);
            // }

            // if (data.fatherIdPhoto && typeof data.fatherIdPhoto !== 'string') {
            //     payload.append("fatherIdPhoto", data.fatherIdPhoto);
            // } else {
            //     delete payload.fatherIdPhoto;
            // }
            // if (data.motherIdPhoto && typeof data.motherIdPhoto !== 'string') {
            //     payload.append("motherIdPhoto", data.motherIdPhoto);
            // } else {
            //     delete payload.motherIdPhoto;
            // }

            const { success, message }: any = mode && mode === 'edit' && id ? await updateStaff(payload, Number(id)) : await createStaff(payload);
            if (success) {
                openSnackbar({
                    open: true,
                    message: message || 'Staff saved successfully',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    }
                });
                navigate('/staff');
            } else {
                openSnackbar({
                    open: true,
                    message: message || 'Something went Wrong',
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
        } finally {
            stopLoading();
        }
    }

    const findStaff = async () => {
        try {
            if (!staffPhoneNumber) {
                openSnackbar({
                    open: true,
                    message: 'Please enter staff phone number',
                    variant: 'alert',
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                });
                return;
            }
            startLoading();
            const { success, message, data }: any = await getStaff({ phoneNumber: staffPhoneNumber });
            if (success) {
                // openSnackbar({
                //     open: true,
                //     message: message || 'Staff found successfully',
                //     variant: 'alert',
                //     severity: 'success',
                //     alert: {
                //         color: 'success'
                //     }
                // });
                setIsStaffFound(true);
                setStaffData(data);
            } else {
                setValue('phoneNumber', staffPhoneNumber);
                setIsStaffFound(false);
                openSnackbar({
                    open: true,
                    message: message || 'Something went Wrong',
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
        } finally {
            stopLoading();
        }
    }

    const handleStaffTransferVerify = async (otp: string) => {
        try {
            startLoading();
            const { success, message }: any = await staffTransferVerify({
                staffID: staffData.id,
                userID: user?.id,
                otp
            });
            if (success) {
                openSnackbar({
                    open: true,
                    message: 'Staff successfully transferred.',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    }
                });
                setOpenVerifyOtpModal(false);
                setStaffData(null);
                setStaffPhoneNumber('');
                setIsStaffFound(null);
            } else {
                openSnackbar({
                    open: true,
                    message: message || 'Something went Wrong',
                    variant: 'alert',
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
        } finally {
            stopLoading();
        }
    }

    const handleStaffTransferRequest = async () => {
        try {
            startLoading();
            const { success, message }: any = await staffTransferRequest({
                staffID: staffData.id,
                userID: user?.id
            });
            if (success) {
                setOpenVerifyOtpModal(true);
                openSnackbar({
                    open: true,
                    message: message || 'Staff transfer request sent successfully',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    }
                });
            } else {
                openSnackbar({
                    open: true,
                    message: message || 'Something went Wrong',
                    variant: 'alert',
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
        } finally {
            stopLoading();
        }
    }

    useEffect(() => {
        (async () => {
            try {
                startLoading();
                const [employeeTypeResponse, stateResponse]: any = await Promise.all([
                    getEmployeeTypePayload({ isActive: true, isDeleted: false }),
                    getStatesList({
                        where: {
                            isDeleted: false,
                        },
                        pagination: {
                            page: 1,
                            rows: 1000,
                            sortBy: "createdAt",
                            descending: true,
                        },
                    })
                ]);
                if (stateResponse?.success && stateResponse?.data && stateResponse?.data?.rows) {
                    setStatesList(stateResponse?.data?.rows || []);
                } else {
                    setStatesList([]);
                    openSnackbar({
                        open: true,
                        message: stateResponse?.message || 'Something went Wrong',
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        }
                    });
                }
                if (employeeTypeResponse?.success) {
                    setEmployeeTypeList(employeeTypeResponse?.data || []);
                } else {
                    setEmployeeTypeList([]);
                    openSnackbar({
                        open: true,
                        message: employeeTypeResponse?.message || 'Something went Wrong',
                        variant: 'alert',
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
            } finally {
                stopLoading();
            }
        })();
    }, []);

    useEffect(() => {
        if (user) {
            setValue("userID", user.id);
        }
    }, [user]);

    useEffect(() => {
        if (isAdmin) {
            (async () => {
                try {
                    startLoading();
                    const payload = {
                        where: {
                            isDeleted: false,
                        },
                        pagination: {
                            page: 1,
                            rows: 1000,
                            sortBy: "createdAt",
                            descending: true,
                        },
                    };
                    const { success, data, message }: any = await getUserList(payload);
                    if (success) {
                        setBranchList(data.rows.filter((item: any) => !['admin', 'super admin'].includes(item.px_role?.name.toLowerCase())));
                    } else {
                        setBranchList([]);
                        openSnackbar({
                            open: true,
                            message: message || 'Something went Wrong',
                            variant: 'alert',
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
                } finally {
                    stopLoading();
                }
            })();
        }
    }, [isAdmin]);

    const isEdit: boolean = useMemo(() => {
        return mode && mode === 'edit' ? true : false;
    }, [mode]);

    const title: string = useMemo(() => {
        if (mode && mode === 'edit' && id) {
            return 'Edit Staff';
        }
        return 'Add Staff';
    }, [mode, id]);

    useEffect(() => {
        if (mode && mode === 'edit' && id) {
            fetch();
        }
    }, [mode, id]);

    return {
        mode,
        title,
        isEdit,
        isAdmin,
        control,
        staffData,
        branchList,
        isMarriage,
        statesList,
        verifiedOtp,
        isStaffFound,
        isSubmitting,
        ifscVerified,
        staffPhoneNumber,
        countryCodeList,
        isStaffNoOtpSend,
        employeeTypeList,
        isSameBranchStaff,
        isShowBankDetail,
        openVerifyOtpModal,
        onSubmit,
        setValue,
        getValues,
        findStaff,
        handleBack,
        handleSubmit,
        setIsStaffFound,
        toggleIsStaffFound,
        setStaffPhoneNumber,
        setIsShowBankDetail,
        setOpenVerifyOtpModal,
        handleIfscVerify,
        handleStaffTransferVerify,
        handleStaffTransferRequest
    }
}

export default UseAddEditStaff;
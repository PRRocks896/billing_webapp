import { useNavigate, useParams } from "react-router-dom";

import useAuth from "hooks/useAuth";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import countries, { CountryType } from "data/countries";
import { openSnackbar } from "api/snackbar";
import { getRoleList } from "service/role";
import { getCompanyList } from "service/company";
import { getCityByFind } from "service/city";
import { createUser, getUserById, updateUser } from "service/user";
import { convertToFormData } from "utils/helper";

export type BranchFormValue = {
    roleID: number | null,
    companyID: number | null,
    cityID: number | null,
    firstName: string,
    lastName: string,
    slug: string,
    branchName: string,
    userName: string,
    password: string,
    billCode: string,
    billTitle: string,
    countryCode: string,
    phoneNumber: string,
    phoneNumberSecond: string,
    address: string,
    email: string,
    gstNo: string,
    isShowGst: boolean,
    feedbackUrl: string,
    reviewUrl: string,
    //website
    isWebDisplay: boolean;
    areaName: string;
    description: string;
    mapUrl: string;
    iFrameMap: string;
    images: any[];
    thumbnilImage: any[];
    h1Tag: string;
}

const defaultValues: BranchFormValue = {
    roleID: null,
    companyID: null,
    cityID: null,
    firstName: '',
    lastName: '',
    slug: '',
    branchName: '',
    userName: '',
    password: '',
    billCode: '',
    billTitle: '',
    countryCode: '',
    phoneNumber: '',
    phoneNumberSecond: '',
    address: '',
    email: '',
    gstNo: '',
    isShowGst: false,
    feedbackUrl: '',
    reviewUrl: '',
    //website
    isWebDisplay: false,
    areaName: '',
    description: '',
    mapUrl: '',
    iFrameMap: '',
    images: [],
    thumbnilImage: [],
    h1Tag: '',
}

const UseAddEditBranch = () => {

    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { user, isAdmin, startLoading, stopLoading } = useAuth();

    const [roles, setRoles] = useState<any[]>([]);
    const [company, setCompany] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);

    const {
        control,
        formState: { isSubmitting },
        watch,
        setValue,
        getValues,
        handleSubmit,
    } = useForm<BranchFormValue>({
        defaultValues,
        mode: 'onChange'
    });

    const countryCodeList = useMemo(() => {
        return countries?.map((country: CountryType) => {
            return {
                label: `${country.phone} (${country.label})`,
                value: country.phone.split('+')[1]
            }
        })
    }, [countries]);

    // genrate roles options for drop down
    const roleOptions = useMemo(() => {
        const data = roles.map((item) => {
            return { value: item.id, label: item.name };
        });
        // setRoleOptions([...data]);
        return data;
    }, [roles]);

    const companyOptions = useMemo(() => {
        const data = company.map((item) => {
            return { value: item.id, label: item.companyName };
        });
        return data;
    }, [company]);

    const cityOptions = useMemo(() => {
        const data = cities.map((item) => {
            return { value: item.id, label: item.name };
        });
        return data;
    }, [cities]);

    const handleBack = () => {
        navigate("/branch");
    }

    const fetch = async () => {
        try {
            startLoading();
            const { success, message, data }: any = await getUserById(Number(id));
            if (success) {
                setValue("roleID", data?.roleID);
                setValue("companyID", data?.companyID);
                setValue("cityID", data?.cityID);
                setValue("firstName", data?.firstName);
                setValue("lastName", data?.lastName);
                setValue("slug", data?.slug);
                setValue("branchName", data?.branchName);
                setValue("userName", data?.userName);
                setValue("password", data?.password);
                setValue("billCode", data?.billCode);
                setValue("billTitle", data?.billTitle);
                setValue("countryCode", data?.countryCode);
                setValue("phoneNumber", data?.phoneNumber);
                setValue("phoneNumberSecond", data?.phoneNumberSecond);
                setValue("address", data?.address);
                setValue("email", data?.email);
                setValue("gstNo", data?.gstNo);
                setValue("isShowGst", data?.isShowGst);
                setValue("feedbackUrl", data?.feedbackUrl);
                setValue("reviewUrl", data?.reviewUrl);
                //website
                if (data && data.isWebDisplay) {
                    setValue("isWebDisplay", data?.isWebDisplay);
                    setValue("areaName", data?.areaName);
                    setValue("description", data?.description);
                    setValue("mapUrl", data?.mapUrl);
                    setValue("iFrameMap", data?.iFrameMap);
                    setValue("images", data.images && Array.isArray(data.images) ? data.images : data.images ? [data.images] : []);
                    setValue("thumbnilImage", data.thumbnilImage);
                    setValue("h1Tag", data?.h1Tag);
                }
            } else {
                openSnackbar({
                    open: true,
                    message: message || 'Something went wrong',
                    variant: 'alert',
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                })
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

    const onSubmit = async (data: BranchFormValue) => {
        try {
            startLoading();
            let payload: any = {
                ...data,
                images: JSON.stringify(data.images),
                thumbnilImage: JSON.stringify(data.thumbnilImage)
            }
            if (mode && mode === 'edit' && id) {
                payload = {
                    ...payload,
                    updatedBy: user?.id
                }
            } else {
                payload = {
                    ...payload,
                    createdBy: user?.id
                }
            }
            if (data &&
                (
                    (data.images && Array.isArray(data.images) && data.images.length > 0 && typeof data.images[0] === 'object') ||
                    (data.thumbnilImage && typeof data.thumbnilImage === 'object')
                )
            ) {
                payload = convertToFormData(payload);
                if (data && data.images && data.images.length > 0) {
                    for (let i = 0; i < data.images.length; i++) {
                        if (typeof data.images[i] === 'object') {
                            payload.append('images', data.images[i]);
                        }
                    }
                }

                if (data && data.thumbnilImage) {
                    if (typeof data.thumbnilImage === 'object') {
                        payload.append('thumbnilImage', data.thumbnilImage);
                    }
                }
            }

            const { success, message }: any = mode && mode === 'edit' && id ? await updateUser(payload, Number(id)) : await createUser(payload);
            if (success) {
                openSnackbar({
                    open: true,
                    message: message || 'Branch created successfully',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    }
                })
                navigate('/branch');
            } else {
                openSnackbar({
                    open: true,
                    message: message || 'Something went wrong',
                    variant: 'alert',
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                })
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
    }

    const isWebDisplay: boolean = useMemo(() => {
        return getValues('isWebDisplay');
    }, [watch('isWebDisplay')])

    useEffect(() => {
        const formattedFirstName = watch('firstName')?.charAt(0).toUpperCase() + watch('firstName')?.slice(1);
        const formattedLastName = watch('lastName')?.charAt(0).toUpperCase() + watch('lastName')?.slice(1);

        const newUserName = formattedFirstName + formattedLastName;
        setValue("userName", newUserName.replace(/\s+/g, ""));
    }, [watch('firstName'), watch('lastName')]);

    useEffect(() => {
        if (mode && mode === 'add' && user && user.branchName) {
            setValue("branchName", user.branchName);
        }
    }, [mode, user]);

    useEffect(() => {
        (async () => {
            try {
                startLoading();
                const payload = {
                    where: {
                        isDeleted: false,
                    },
                    pagination: {
                        page: 1,
                        rows: 10000,
                        sortBy: "createdAt",
                        descending: true,
                    },
                };
                const [
                    roleResponse,
                    companyResponse,
                    cityResponse
                ]: [any, any, any] = await Promise.all([
                    getRoleList(payload),
                    getCompanyList(payload),
                    getCityByFind({ isActive: true, isDeleted: false })
                ]);
                if (roleResponse.success) {
                    setRoles(roleResponse.data?.rows);
                } else {
                    setRoles([]);
                }
                if (companyResponse.success) {
                    setCompany(companyResponse.data?.rows);
                } else {
                    setCompany([]);
                }
                if (cityResponse.success) {
                    setCities(cityResponse.data);
                } else {
                    setCities([]);
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

    const title: string = useMemo(() => {
        if (mode && mode === 'edit' && id) {
            return 'Edit Branch';
        }
        return 'Add Branch';
    }, [mode, id]);

    useEffect(() => {
        if (mode && mode === 'edit' && id) {
            fetch();
        }
    }, [mode, id]);

    return {
        mode,
        title,
        isAdmin,
        control,
        roleOptions,
        cityOptions,
        isSubmitting,
        isWebDisplay,
        companyOptions,
        countryCodeList,
        setValue,
        onSubmit,
        handleBack,
        handleSubmit,
    };
};

export default UseAddEditBranch;
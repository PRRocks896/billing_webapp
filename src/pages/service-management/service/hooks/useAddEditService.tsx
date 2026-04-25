import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getServiceCategoryList } from "service/service-category";
import { openSnackbar } from "api/snackbar";
import useAuth from "hooks/useAuth";
import { useFieldArray, useForm } from "react-hook-form";
import { createService, getServiceById, updateService } from "service/service";
import { generateSlug } from 'utils/helper';

export type ServiceFormValue = {
    name: string;
    amount: string;
    minutes: string;
    slug: string;
    hsnCode: string;
    displayName: string;
    description: string;
    webPrice: string;
    video: string;
    thumbnilImage: string;
    h1Tag: string;
    images: any;
    backgrandImage: string;
    isWebDisplay: boolean;
    service_category_id: number | null;
    featureList: {
        index: number;
        value: string;
    }[],
    recommended: {
        index: number;
        value: string;
    }[],
    scrubs: {
        index: number;
        value: string;
    }[],
    therapyOptions: {
        index: number;
        value: string;
    }[],
    faq: {
        index: number;
        title: string;
        description: string;
    }[],
    durationAndPrice: {
        index: number;
        duration: string;
        price: string;
        discountedPrice: string;
    }[]
}

const defaultValues: ServiceFormValue = {
    name: '',
    amount: '',
    minutes: '',
    slug: '',
    hsnCode: '9997',
    service_category_id: null,
    displayName: '',
    description: '',
    webPrice: '',
    video: '',
    thumbnilImage: '',
    isWebDisplay: false,
    h1Tag: '',
    images: [],
    backgrandImage: '',
    featureList: [{
        index: 0,
        value: ""
    }],
    recommended: [{
        index: 0,
        value: ""
    }],
    scrubs: [{
        index: 0,
        value: ""
    }],
    therapyOptions: [{
        index: 0,
        value: ""
    }],
    faq: [{
        index: 0,
        title: "",
        description: ""
    }],
    durationAndPrice: [{
        index: 0,
        duration: "",
        price: "",
        discountedPrice: ""
    }]
}

const UseAddEditService = () => {
    const navigate = useNavigate();
    const { mode, id } = useParams();
    const { user, startLoading, stopLoading } = useAuth();

    const [serviceCategories, setServiceCategories] = useState<any[]>([]);

    const {
        control,
        formState: { isSubmitting },
        watch,
        setValue,
        getValues,
        handleSubmit,
    } = useForm<ServiceFormValue>({
        defaultValues,
        mode: 'onChange'
    });

    const featureListFields = useFieldArray({
        control,
        name: 'featureList',
    });

    const recommendedFields = useFieldArray({
        control,
        name: 'recommended',
    });

    const scrubsFields = useFieldArray({
        control,
        name: 'scrubs',
    });

    const therapyOptionsFields = useFieldArray({
        control,
        name: 'therapyOptions',
    });

    const faqFields = useFieldArray({
        control,
        name: 'faq',
    });

    const durationAndPriceFields = useFieldArray({
        control: control,
        name: 'durationAndPrice'
    });

    const addDurationAndPriceRow = () => {
        const index = getValues("durationAndPrice").length;
        durationAndPriceFields.append({
            index: index,
            duration: "",
            price: "",
            discountedPrice: ""
        });
    }

    const removeDurationAndPriceRow = (index: number) => {
        durationAndPriceFields.remove(index);
    }

    const addRow = () => {
        const index = getValues("featureList").length;
        featureListFields.append({
            index: index,
            value: ""
        });
    }

    const removeRow = (index: number) => {
        featureListFields.remove(index);
    }

    const addFaqRow = () => {
        const index = getValues("faq").length;
        faqFields.append({
            index: index,
            title: "",
            description: ""
        });
    }

    const removeFaqRow = (index: number) => {
        faqFields.remove(index);
    }

    const addRecommendedRow = () => {
        const index = getValues("recommended").length;
        recommendedFields.append({
            index: index,
            value: ""
        });
    }

    const removeRecommendedRow = (index: number) => {
        recommendedFields.remove(index);
    }

    const addScrubsRow = () => {
        const index = getValues("scrubs").length;
        scrubsFields.append({
            index: index,
            value: ""
        });
    }

    const removeScrubsRow = (index: number) => {
        scrubsFields.remove(index);
    }

    const addTherapyOptionsRow = () => {
        const index = getValues("therapyOptions").length;
        therapyOptionsFields.append({
            index: index,
            value: ""
        });
    }

    const removeTherapyOptionsRow = (index: number) => {
        therapyOptionsFields.remove(index);
    }

    const handleBack = () => {
        navigate("/service");
    }

    const fetch = async () => {
        try {
            startLoading();
            const { success, message, data }: any = await getServiceById(Number(id));
            if (success) {
                setValue("isWebDisplay", data.isWebDisplay);
                setValue("name", data.name);
                setValue("service_category_id", data.service_category_id);
                setValue("amount", data.amount);
                setValue("slug", data.slug || generateSlug(data.name));
                setValue("minutes", data.minutes);
                setValue("hsnCode", data.hsnCode || '9997');
                if (data.isWebDisplay) {
                    setValue("h1Tag", data.h1Tag);
                    setValue("displayName", data.displayName);
                    setValue("webPrice", data.webPrice);
                    setValue("description", data.description);
                    setValue("video", data.video ? data.video : "");
                    setValue("thumbnilImage", data.thumbnilImage ? data.thumbnilImage : "");
                    setValue("backgrandImage", data.backgrandImage ? data.backgrandImage : "");
                    setValue("images", data.images && Array.isArray(data.images) ? data.images : []);
                    setValue("featureList", Array.isArray(data.featureList) ? data.featureList?.map((feature: any, index: number) => ({ index, value: feature })) : data.featureList?.length > 0 ? JSON.parse(data.featureList).map((feature: any, index: number) => ({ index, value: feature })) : [{ index: 0, value: "" }]);
                    setValue("recommended", Array.isArray(data.recommended) ? data.recommended?.map((recommended: any, index: number) => ({ index, value: recommended })) : data.recommended?.length > 0 ? JSON.parse(data.recommended).map((recommended: any, index: number) => ({ index, value: recommended })) : [{ index: 0, value: "" }]);
                    setValue("scrubs", Array.isArray(data.scrubs) ? data.scrubs?.map((scrubs: any, index: number) => ({ index, value: scrubs })) : data.scrubs?.length > 0 ? JSON.parse(data.scrubs).map((scrubs: any, index: number) => ({ index, value: scrubs })) : [{ index: 0, value: "" }]);
                    setValue("therapyOptions", Array.isArray(data.therapyOptions) ? data.therapyOptions?.map((therapyOptions: any, index: number) => ({ index, value: therapyOptions })) : data.therapyOptions?.length > 0 ? JSON.parse(data.therapyOptions).map((therapyOptions: any, index: number) => ({ index, value: therapyOptions })) : [{ index: 0, value: "" }]);
                    setValue("faq", Array.isArray(data.faq) ? data.faq?.map((faq: any, index: number) => ({ index, title: faq.title, description: faq.description })) : data.faq?.length > 0 ? JSON.parse(data.faq).map((faq: any, index: number) => ({ index, title: faq.title, description: faq.description })) : [{ index: 0, title: "", description: "" }]);
                    setValue("durationAndPrice", Array.isArray(data.durationAndPrice) ? data.durationAndPrice?.map((durationAndPrice: any, index: number) => ({ index, duration: durationAndPrice.duration, price: durationAndPrice.price, discountedPrice: durationAndPrice.discountedPrice })) : data?.durationAndPrice?.length > 0 ? JSON.parse(data.durationAndPrice).map((durationAndPrice: any, index: number) => ({ index, duration: durationAndPrice.duration, price: durationAndPrice.price, discountedPrice: durationAndPrice.discountedPrice })) : [{ index: 0, duration: "", price: "", discountedPrice: "" }]);
                }
            } else {
                openSnackbar({
                    open: true,
                    message: message,
                    variant: 'alert',
                    severity: 'error',
                    alert: {
                        color: 'error'
                    }
                });
            }
        } catch (error: any) {
            console.error(error);
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
                        rows: 1000,
                        sortBy: "createdAt",
                        descending: true,
                    },
                };
                const { success, message, data }: any = await getServiceCategoryList(payload);
                if (success) {
                    const payload = data?.rows;
                    setServiceCategories(payload);
                } else {
                    setServiceCategories([]);
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

    const onSubmit = async (data: ServiceFormValue) => {
        try {
            startLoading();
            let payload: any;
            const formData = new FormData();
            if (data.isWebDisplay) {
                payload = {
                    ...data
                };
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
                (Object.keys(payload)).forEach(key => {
                    if (!['durationAndPrice', 'faq', 'recommended', 'scrubs', 'therapyOptions', 'thumbnilImage', 'backgrandImage', 'video', 'images', 'featureList'].includes(key)) {
                        formData.append(key, payload[key]);
                    }
                });
                if (payload && payload.video && typeof payload.video === 'object') {
                    formData.append('video', payload.video);
                }
                if (payload && payload.thumbnilImage && typeof payload.thumbnilImage === 'object') {
                    formData.append('thumbnilImage', payload.thumbnilImage);
                }
                if (payload && payload.backgrandImage && typeof payload.backgrandImage === 'object') {
                    formData.append('backgrandImage', payload.backgrandImage);
                }
                if (payload && payload.images && Array.isArray(payload.images)) {
                    payload.images.filter((image: any) => typeof image === 'object').forEach((image: any) => {
                        formData.append('images', image);
                    });
                    // const stringImgs = payload.images.filter((image: any) => typeof image === 'string');
                    // if (stringImgs.length > 0) {
                    //     formData.append('images', JSON.stringify(stringImgs));
                    // }
                }
                if (payload && payload.featureList && Array.isArray(payload.featureList)) {
                    formData.append('featureList', JSON.stringify(payload.featureList.map((feature: any) => feature.value)));
                }
                if (payload && payload.recommended && Array.isArray(payload.recommended)) {
                    formData.append('recommended', JSON.stringify(payload.recommended.map((recommended: any) => recommended.value)));
                }
                if (payload && payload.scrubs && Array.isArray(payload.scrubs)) {
                    formData.append('scrubs', JSON.stringify(payload.scrubs.map((scrubs: any) => scrubs.value)));
                }
                if (payload && payload.therapyOptions && Array.isArray(payload.therapyOptions)) {
                    formData.append('therapyOptions', JSON.stringify(payload.therapyOptions.map((therapyOptions: any) => therapyOptions.value)));
                }
                if (payload && payload.faq && Array.isArray(payload.faq)) {
                    const faqData = payload.faq.map((faq: any) => ({ title: faq.title, description: faq.description }));
                    formData.append('faq', JSON.stringify(faqData));
                }
                if (payload && payload.durationAndPrice && Array.isArray(payload.durationAndPrice)) {
                    const durationAndPriceData = payload.durationAndPrice.map((durationAndPrice: any) => ({ duration: durationAndPrice.duration, price: durationAndPrice.price, discountedPrice: durationAndPrice.discountedPrice }));
                    formData.append('durationAndPrice', JSON.stringify(durationAndPriceData));
                }
            } else {
                payload = {
                    name: data.name,
                    service_category_id: data.service_category_id,
                    amount: data.amount,
                    minutes: data.minutes,
                    isWebDisplay: data.isWebDisplay,
                    slug: data.slug,
                    ...((mode && mode === 'edit' && id) ? { updatedBy: user?.id } : { createdBy: user?.id })
                }
            }
            const { success, message }: any = mode && mode === 'edit' && id ? await updateService(data.isWebDisplay ? formData : payload, Number(id)) : await createService(data.isWebDisplay ? formData : payload);
            if (success) {
                openSnackbar({
                    open: true,
                    message: message,
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    }
                });
                handleBack();
            } else {
                openSnackbar({
                    open: true,
                    message: message,
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

    const isWebDisplay: boolean = useMemo(() => {
        return getValues('isWebDisplay');
    }, [watch('isWebDisplay')])

    const title: string = useMemo(() => {
        if (mode && mode === 'edit' && id) {
            return 'Edit Service';
        }
        return 'Add Service';
    }, [mode, id]);

    useEffect(() => {
        if (mode && mode === 'edit' && id) {
            fetch();
        }
    }, [mode, id]);

    return {
        mode,
        title,
        control,
        faqFields,
        isSubmitting,
        isWebDisplay,
        scrubsFields,
        featureListFields,
        recommendedFields,
        serviceCategories,
        therapyOptionsFields,
        durationAndPriceFields,
        addRow,
        setValue,
        onSubmit,
        getValues,
        removeRow,
        addFaqRow,
        handleBack,
        removeFaqRow,
        handleSubmit,
        addScrubsRow,
        removeScrubsRow,
        addRecommendedRow,
        addTherapyOptionsRow,
        removeRecommendedRow,
        addDurationAndPriceRow,
        removeTherapyOptionsRow,
        removeDurationAndPriceRow,
    }
}

export default UseAddEditService;
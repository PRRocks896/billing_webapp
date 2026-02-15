import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { listPayload, showToast } from "../../../utils/helper";
import { createPaymentBank, getPaymentBank, updatePaymentBank } from "../../../service/paymentBank";
import { getCompanyList } from "../../../service/company";
import { startLoading, stopLoading } from "../../../redux/loader";

const UseAddEditPaymentBank = (tag) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { id } = useParams();
    const loggedInUser = useSelector((state) => state.loggedInUser);

    const [companyList, setCompanyList] = useState([]);

    const {
        control,
        formState: { isSubmitting },
        reset,
        setValue,
        getValues,
        handleSubmit,
    } = useForm({
        defaultValues: {
            bankName: "",
            companyID: "",
            value: [{
                index: 0,
                key: '',
                value: ''
            }]
        },
        mode: 'onChange'
    });

    const { fields, append, remove } = useFieldArray({
        name: 'value',
        control: control,
    });

    const handleAdd = () => {
        const index = getValues('value').length;
        append({
            index: index,
            key: '',
            value: ''
        })
    }

    const handleRemove = (index) => {
        remove(index)
    }

    const fetchEditPaymentBankData = async () => {
        try {
            dispatch(startLoading());
            const { success, message, data } = await getPaymentBank(id);
            if (success) {
                setValue("bankName", data.bankName);
                setValue("companyID", data.companyID);
                const formattedValue = data.value && data.value.length > 0
                    ? Object.entries(data.value[0]).map(([key, value], index) => ({
                        index: index,
                        key: key,
                        value: value
                    }))
                    : [];
                setValue("value", formattedValue);
            } else {
                showToast(message, false);
            }
        } catch (error) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    };

    const fetchCompany = useCallback(async () => {
        try {
            dispatch(startLoading());
            const body = listPayload(0, { isActive: true, isDeleted: false }, 1000);
            const { success, data } = await getCompanyList(body);
            if (success) {
                setCompanyList(data.rows);
            } else {
                setCompanyList([]);
            }
        } catch (error) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    }, [dispatch]);

    const onSubmit = async (data) => {
        try {
            dispatch(startLoading());
            let payload = {
                bankName: data.bankName,
                companyID: data.companyID,
                value: [data.value.reduce((acc, curr) => {
                    acc[curr.key] = curr.value;
                    return acc;
                }, {})],
            };
            if (id) {
                payload.updatedBy = loggedInUser.id;
            } else {
                payload.createdBy = loggedInUser.id;
            }
            const response = id ? await updatePaymentBank(payload, id) : await createPaymentBank(payload);
            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                navigate('/payment-bank');
            } else {
                showToast(response?.message, false);
            }
        } catch (error) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    }

    const cancelHandler = () => {
        navigate("/payment-bank");
    };

    useEffect(() => {
        if (id) {
            fetchEditPaymentBankData();
        }
    }, [id]);

    useEffect(() => {
        fetchCompany();
    }, [fetchCompany]);

    return {
        fields,
        control,
        companyList,
        isSubmitting,
        reset,
        setValue,
        onSubmit,
        getValues,
        handleAdd,
        handleSubmit,
        handleRemove,
        cancelHandler
    }
}

export default UseAddEditPaymentBank;
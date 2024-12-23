import { set, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { showToast } from "../../../utils/helper";
import { startLoading, stopLoading } from "../../../redux/loader";
import { createCompany, updateCompany, getCompanyById } from "../../../service/company";

const useAddEditCompany = (tag) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { id } = useParams();
    const loggedInUser = useSelector((state) => state.loggedInUser);

    const { setValue, control, handleSubmit } = useForm({
        defaultValues: {
            companyName: "",
            displayName: "",
            billCode: "",
            cashBillCode: "",
        },
        mode: "onBlur",
    });
    const onSubmit = async (data) => {
        try {
            dispatch(startLoading());
            const payload = { ...data };
            const response =
                tag === "add"
                    ? await createCompany({ ...payload, createdBy: loggedInUser.id })
                    : await updateCompany({ ...payload, updatedBy: loggedInUser.id }, id);

            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                navigate("/company");
            } else {
                showToast(response?.messageCode, false);
            }
        } catch (error) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    };

    const fetchEditCompanyData = useCallback(async () => {
        try {
            if (id) {
                dispatch(startLoading());
                const response = await getCompanyById(id);
                if (response?.statusCode === 200) {
                    setValue("companyName", response.data.companyName);
                    setValue("displayName", response.data.displayName);
                    setValue("billCode", response.data.billCode);
                    setValue("cashBillCode", response.data.cashBillCode);
                } else {
                    showToast(response?.message, false);
                }
            }
        } catch (error) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    }, [id, dispatch, setValue]);

    useEffect(() => {
        tag === "edit" && fetchEditCompanyData();
    }, [tag, fetchEditCompanyData]);

    const cancelHandler = () => {
        navigate("/company");
    };

    return {
        control,
        handleSubmit,
        onSubmit,
        cancelHandler,
    };
};


export default useAddEditCompany;
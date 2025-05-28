import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { listPayload, showToast } from "../../../utils/helper";

import { receiveCourier } from "../../../service/barcode";
import { startLoading, stopLoading } from "../../../redux/loader";

const UseReceiveCourierHook = () => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const loggedInUser = useSelector((state) => state.loggedInUser);
    const [ barcode, setBarcode ] = useState("");
    
    const onSubmit = async () => {
        try {
            if(!barcode) {
                showToast("Please enter a barcode", false);
                return;
            }
            dispatch(startLoading());
            const response = await receiveCourier({ receiverID: loggedInUser.id, updatedBy: loggedInUser.id, barcode });
            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                setBarcode("");
            } else {
                showToast(response?.messageCode, false);
            }
        } catch (error) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    }
    
    return {
        barcode,
        setBarcode,
        onSubmit,
    }
}

export default UseReceiveCourierHook;
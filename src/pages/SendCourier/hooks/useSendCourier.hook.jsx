import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { listPayload, showToast } from "../../../utils/helper";

import { createBarcode } from "../../../service/barcode";
import { getUserList } from "../../../service/users";
import { startLoading, stopLoading } from "../../../redux/loader";

const UseSendCourier = () => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const loggedInUser = useSelector((state) => state.loggedInUser);
    const [ barcode, setBarcode ] = useState("");
    const [ branchList, setBranchList ] = useState([]);
    const [ selectedBranch, setSelectedBranch ] = useState(null);

    const isAdmin = useMemo(() => {
        if(loggedInUser && loggedInUser.px_role && loggedInUser.px_role.name === 'Admin') {
            return true;
        }
      return false;
    }, [loggedInUser]);

    const onSubmit = async () => {
        try {
            if(!barcode) {
                showToast("Please enter a barcode", false);
                return;
            }
            if(!selectedBranch && isAdmin) {
                showToast("Please select a branch", false);
                return;
            }
            dispatch(startLoading());
            const response = await createBarcode({ userID: isAdmin ? selectedBranch?.id : loggedInUser.id, out: true, in: false, createdBy: loggedInUser.id, barcode });
            if (response?.statusCode === 200) {
                showToast(response?.message, true);
                setSelectedBranch(null);
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

    const fetchBranchList = useCallback(async () => {
        try {
            dispatch(startLoading());
            const response = await getUserList(listPayload(0, {isActive: true, isDeleted: false}, 1000));
            if (response?.statusCode === 200) {
                const payload = response?.data?.rows;
                const branchOption = payload.filter(item => item.roleID !== 1);
                setBranchList(branchOption);
            } else {
                showToast(response?.message, false);
            }
        } catch (error) {
            showToast(error?.message, false);
        } finally {
            dispatch(stopLoading());
        }
    }, [dispatch]);

    useEffect(() => {
        if(isAdmin) {
            fetchBranchList()
        }
    }, [isAdmin]);

    return {
        barcode,
        isAdmin,
        branchList,
        selectedBranch,
        onSubmit,   
        setBarcode,
        setBranchList,
        setSelectedBranch
    }
}

export default UseSendCourier;
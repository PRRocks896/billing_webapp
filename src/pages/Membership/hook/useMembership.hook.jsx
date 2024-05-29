import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { listPayload, rightsAccess, showToast, showTwoDecimalWithoutRound } from "../../../utils/helper";

import {
  updateMembership,
  deleteMembership,
  getMembershipList,
  getMembershipById
} from "../../../service/membership";
import { membershipAction } from "../../../redux/membership";
import { startLoading, stopLoading } from "../../../redux/loader";
import PrintContent from "../../../components/PrintContent";

const useMembershipPlanHooks = () => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const membershipData = useSelector((state) => state.membership.data);;
    const loggedInUser = useSelector((state) => state.loggedInUser);
    const { accessModules } = loggedInUser;

    const [deleteId, setDeleteId] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // pagination start
    const [page, setPage] = useState(0);
    const [count, setCount] = useState(0);

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const rights = useMemo(() => {
      return rightsAccess(accessModules, pathname);
    }, [accessModules, pathname]);

    const visibleRows = useMemo(() => {
      return membershipData;
    }, [membershipData]);

    const fetchMembershipData = useCallback(async (searchValue = '') => {
      try {
        dispatch(startLoading());
        let payload = { searchText: searchValue };
        if (loggedInUser.roleID !== 1) {
          payload.createdBy = loggedInUser.id;
        }
        const body = listPayload(page, payload);
        const response = await getMembershipList(body);
        if (response?.statusCode === 200) {
          const payload = response?.data?.rows;
          setCount(response?.data?.count);
          dispatch(membershipAction.storeMembership(payload));
        } else if (response?.statusCode === 404) {
          const payload = [];
          dispatch(membershipAction.storeMembership(payload));
        }
      } catch(error) {
        showToast(error?.message, false);
      } finally {
        dispatch(stopLoading());
      }
      // eslint-disable-next-line
    }, [dispatch, page]);

    const deleteBtnClickHandler = (id) => {
      setDeleteId(id);
      setIsDeleteModalOpen(true);
    };

    const deleteHandler = async () => {
      try {
        setIsDeleteModalOpen(false);
        dispatch(startLoading());
        const response = await deleteMembership(deleteId);

        if (response?.statusCode === 200) {
          showToast(response?.message, true);
          dispatch(membershipAction.removeMembership({ id: deleteId }));
          setCount((prev) => prev - 1);
        } else {
          showToast(response?.messageCode, false);
        }
      } catch (error) {
        showToast(error?.message, false);
      } finally {
        setIsDeleteModalOpen(false);
        dispatch(stopLoading());
      }
    };

    const changeStatusHandler = async (e, id) => {
        try {
          const payload = {
            isActive: e.target.checked,
            updatedBy: loggedInUser.id,
          };
          const response = await updateMembership(payload, id);

          if (response?.statusCode === 200) {
            showToast(response?.message, true);
            const payload2 = { id, status: payload.isActive };
            dispatch(membershipAction.changeMembershipStatus(payload2));
          } else {
            showToast(response?.message, false);
          }
        } catch (error) {
          showToast(error?.message, false);
        }
    };

    const searchMembershipHandler = (payload) => {
      try {
        fetchMembershipData(payload.searchValue);
      } catch (error) {
        showToast(error.message, false);
      }
    };

    const handlePrint = async (id) => {
      try {
        startLoading()
        const { success, message, data } = await getMembershipById(id);
        if(success) {
          const tempTotal = loggedInUser?.isShowGst ? showTwoDecimalWithoutRound(parseFloat((data?.px_membership_plan?.price / 118) * 100).toString()) : data?.px_membership_plan?.price;
          const cgst = loggedInUser?.isShowGst ? (parseFloat(tempTotal) * 0.09).toFixed(2) : 0; 
          const sgst = loggedInUser?.isShowGst ? (parseFloat(tempTotal) * 0.09).toFixed(2) : 0;
          const billData = {
            subTotal: tempTotal,
            total: loggedInUser?.isShowGst ? parseFloat(tempTotal) + parseFloat(cgst) + parseFloat(sgst) : data?.px_membership_plan?.price,
            billNo: data?.billNo,
            payment: data?.px_payment_type?.name,
            cardNo: data?.cardNo,
            date: new Date(data?.createdAt),
            customer: data?.px_customer?.name,
            customerID: data?.customerID,
            phone: data?.px_customer?.phoneNumber,
            detail: [{
              item: data?.px_membership_plan?.planName,
              quantity: 1,
              rate: tempTotal,
              total: tempTotal
            }],
            phoneNumber: loggedInUser.phoneNumber, //body?.px_customer?.phoneNumber,
            billTitle: loggedInUser.billTitle,
            address: loggedInUser.address,
            phoneNumber2: loggedInUser.phoneNumber2,
            roleID: loggedInUser.roleID,
            gstNo: loggedInUser?.gstNo,
            isShowGst: loggedInUser?.isShowGst,
            cgst: cgst,
            sgst: sgst,
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
          printWindow.document.write(PrintContent(billData, branchData, false));
          printWindow.document.close();
          printWindow.print();
          printWindow.close();
        } else {
          showToast(message, false);
        }
      } catch (error) {
        showToast(error.message, false);
      } finally {
        stopLoading()
      }
    }

    useEffect(() => {
      fetchMembershipData()
    }, [fetchMembershipData]);

    return {
      page,
      count,
      rights,
      visibleRows,
      isDeleteModalOpen,
      handlePrint,
      deleteHandler,
      handleChangePage,
      changeStatusHandler,
      setIsDeleteModalOpen,
      deleteBtnClickHandler,
      searchMembershipHandler,
    }
}

export default useMembershipPlanHooks;
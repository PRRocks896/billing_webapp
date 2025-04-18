import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { listPayload, rightsAccess, showToast } from "../../../utils/helper";
import { billAction } from "../../../redux/bill";
import {
  deleteBill,
  getBillList,
  getBillById,
  // createBulkBill,
} from "../../../service/bill";
import { startLoading, stopLoading } from "../../../redux/loader";
import PrintContent from "../../../components/PrintContent";
import moment from "moment";

export const useBill = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  // eslint-disable-next-line
  const billData = useSelector((state) => state.bill.data);
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const userRole = loggedInUser?.px_role?.name?.toLowerCase();
  const { accessModules } = loggedInUser;

  const [deleteId, setDeleteId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // pagination start
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);

  const visibleRows = useMemo(() => {
    // return combinedData;
    return billData;
  }, [billData]);

  const isAdmin = useMemo(() => {
    if(loggedInUser && loggedInUser.px_role && ['Admin', 'Super Admin'].includes(loggedInUser.px_role.name)) {
      return true;
    }
    return false;
  }, [loggedInUser]);

  // pagination end

  const rights = useMemo(() => {
    return rightsAccess(accessModules, pathname);
  }, [accessModules, pathname]);

  //  fetch bill
  const fetchBillData = useCallback(
    async (searchValue = "") => {
      if(loggedInUser) {
        try {
          dispatch(startLoading());
          let whereCondition = {
            isDeleted: false,
            searchText: searchValue,
          };
          if (!['admin', 'super admin'].includes(userRole)) {
            whereCondition = {
              ...whereCondition,
              userID: loggedInUser.id,
              createdAt: moment(new Date()).format('yyyy-MM-DD') //'2024-03-29' //new Date().toISOString().split('T')[0]
            };
          }

          const body = listPayload(page, whereCondition, rowsPerPage, {
            sortBy: "id",
          });

          const response = await getBillList(body);

          if (response?.statusCode === 200) {
            const finalPayload = [
              ...response?.data?.rows,
            ];
            setCount(response.data.count);
            dispatch(billAction.storeBill(finalPayload));
          } else {
            const payload = [];
            setCount(0);
            dispatch(billAction.storeBill(payload));
          }
        } catch (error) {
          showToast(error?.message, false);
        } finally {
          dispatch(stopLoading());
        }
      }
      // eslint-disable-next-line
    }, [dispatch, page, userRole, loggedInUser,rowsPerPage]);

  // search bill
  const searchBillHandler = async (payload) => {
    try {
      fetchBillData(payload.searchValue);
    } catch (error) {
      showToast(error?.message, false);
    }
  };

  useEffect(() => {
    fetchBillData();
  }, [fetchBillData]);

  // delete payment type click handler
  const deleteBtnClickHandler = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  // delete bill
  const deleteHandler = async () => {
    try {
      dispatch(startLoading());

      const response = await deleteBill(deleteId);

      if (response?.statusCode === 200) {
        showToast(response?.message, true);
        dispatch(billAction.removeBill({ id: deleteId }));
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const doPrint = (billData, isShowSecond = true) => {
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
    const printWindow = window.open("", "_blank", "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,status=no");
    if(printWindow.document) {
      printWindow.document.write(PrintContent(billData, branchData, isShowSecond));
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    }
  };

  const handlePrint = async (id) => {
    const response = await getBillById(id);
    if (response?.success) {
      const body = response.data;
      const billData = {
        subTotal: body?.detail[0]?.total, //body?.grandTotal,
        total: body?.grandTotal,
        billNo: body?.billNo,
        payment: body?.px_payment_type?.name,
        cardNo: body?.cardNo,
        date: new Date(body?.createdAt),
        customer: body?.px_customer?.name,
        customerID: body?.customerID,
        phone: body?.px_customer?.phoneNumber,
        staff: body?.px_staff?.nickName,
        roomNo: body?.px_room?.roomName || body?.roomNo,
        detail: body?.detail?.map((row) => {
          return { ...row, item: row.serviceID ? row.service?.name : row.membershipPlan?.planName };
        }),
        phoneNumber: loggedInUser.phoneNumber, //body?.px_customer?.phoneNumber,
        billTitle: loggedInUser.billTitle,
        address: loggedInUser.address,
        phoneNumber2: loggedInUser.phoneNumber2,
        roleID: loggedInUser.roleID,
        gstNo: body?.px_user?.gstNo,
        isShowGst: body?.px_user?.isShowGst,
        cgst: body?.px_user?.isShowGst ? body?.cgst : 0,
        sgst: body?.px_user?.isShowGst ? body?.sgst : 0,
        reviewUrl: loggedInUser.reviewUrl && loggedInUser.reviewUrl.length ? loggedInUser.reviewUrl : null 
      };
      doPrint(billData, billData.detail[0]?.membershipPlan ? false : true);
    } else {
      showToast(response?.message, false);
    }
  };

  return {
    isAdmin,
    handlePrint,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteHandler,
    deleteBtnClickHandler,
    searchBillHandler,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    visibleRows,
    count,
    rights,
    userRole,
  };
};

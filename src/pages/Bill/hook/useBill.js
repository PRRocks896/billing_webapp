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
import {
  Stores,
  deleteData,
  getStoreDataPagination,
  getSingleData,
  getStoreData,
  // deleteAllData,
} from "../../../utils/db";
import PrintContent from "../../../components/PrintContent";

export const useBill = () => {
  window.localStorage.removeItem("billNo");
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  // eslint-disable-next-line
  const billData = useSelector((state) => state.bill.data);
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const userRole = loggedInUser?.px_role?.name?.toLowerCase();
  const { accessModules, id } = loggedInUser;

  const [deleteId, setDeleteId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // const [localBillList, setLocalBillList] = useState([]);
  // const [combinedData, setCombinedData] = useState([]);

  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [billCount, setBillCount] = useState(0);

  // pagination start
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);

  const visibleRows = useMemo(() => {
    // return combinedData;
    return billData;
  }, [billData]);

  // pagination end

  const rights = useMemo(() => {
    return rightsAccess(accessModules, pathname);
  }, [accessModules, pathname]);

  //  fetch bill
  const fetchBillData = useCallback(
    async (searchValue = "") => {
      try {
        dispatch(startLoading());
        const localBillData = await getStoreDataPagination(
          Stores.Bills,
          page,
          rowsPerPage,
          searchValue
        );
        let descendingLocalBillData = [];

        if (localBillData.statusCode === 200) {
          descendingLocalBillData = localBillData.data
            .slice()
            .sort((a, b) => b.id.localeCompare(a.id));
        }
        let whereCondition = {
          isDeleted: false,
          searchText: searchValue,
        };
        if (userRole !== "admin") {
          whereCondition = {
            ...whereCondition,
            userID: loggedInUser.id,
          };
        }

        const body = listPayload(page, whereCondition, rowsPerPage, {
          sortBy: "createdAt",
        });

        const response = await getBillList(body);

        if (response?.statusCode === 200) {
          const finalPayload = [
            ...descendingLocalBillData,
            ...response?.data?.rows,
          ];
          // setCombinedData(finalPayload);
          setCount(response.data.count + localBillData.count);
          dispatch(billAction.storeBill(finalPayload));
        } else {
          const payload = [...descendingLocalBillData];
          setCount(localBillData?.count);
          dispatch(billAction.storeBill(payload));
        }
      } catch (error) {
        showToast(error?.message, false);
      } finally {
        dispatch(stopLoading());
      }
    },
    [dispatch, page, userRole, loggedInUser.id, rowsPerPage]
  );

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
      setIsDeleteModalOpen(false);
      dispatch(startLoading());
      let response;
      if (typeof deleteId === "string") {
        response = await deleteData(Stores.Bills, deleteId);
      } else {
        response = await deleteBill(deleteId);
      }

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

  const doPrint = (billData) => {
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
  };

  const handlePrint = async (id) => {
    const response = await getBillById(id);
    if (response.success) {
      const body = response.data;
      const billData = {
        subTotal: body?.grandTotal,
        total: body?.grandTotal,
        billNo: body?.billNo,
        payment: body?.px_payment_type?.name,
        cardNo: body?.cardNo,
        date: new Date(body?.createdAt),
        customer: body?.px_customer?.name,
        customerID: body?.customerID,
        phone: body?.px_customer?.phoneNumber,
        staff: body?.px_staff?.name,
        roomNo: body?.roomNo,
        detail: body?.detail?.map((row) => {
          return { ...row, item: row.service.name };
        }),
        phoneNumber: loggedInUser.phoneNumber, //body?.px_customer?.phoneNumber,
        billTitle: loggedInUser.billTitle,
        address: loggedInUser.address,
        phoneNumber2: loggedInUser.phoneNumber2,
        roleID: loggedInUser.roleID,
      };
      doPrint(billData);
    } else {
      const localDBResponse = await getSingleData(Stores.Bills, id);
      if (localDBResponse.statusCode === 200) {
        const data = localDBResponse?.data;
        const billData = {
          subTotal: data?.grandTotal,
          total: data?.grandTotal,
          billNo: data?.billNo,
          payment: data?.px_payment_type?.name,
          cardNo: data?.cardNo,
          date: new Date(data?.createdAt),
          customer: data?.px_customer?.name,
          customerID: data?.customerID,
          phone: data?.px_customer?.phoneNumber,
          staff: data?.px_staff?.name,
          roomNo: data?.roomNo,
          detail: data?.detail?.map((row) => {
            return { ...row, item: row.service.name };
          }),
          phoneNumber: loggedInUser.phoneNumber, //body?.px_customer?.phoneNumber,
          billTitle: loggedInUser.billTitle,
          address: loggedInUser.address,
          phoneNumber2: loggedInUser.phoneNumber2,
          roleID: loggedInUser.roleID,
        };
        doPrint(billData);
      } else {
        showToast(response?.message, false);
      }
    }
  };

  // check syncing
  useEffect(() => {
    const checkBillDataExist = async () => {
      const billData = await getStoreData(Stores.Bills);
      if (billData.statusCode === 200 && billData.data.length) {
        const lastRecord = billData.data[billData.data.length - 1];
        if (new Date(lastRecord.createdAt).getDate() !== new Date().getDate()) {
          setBillCount(billData.data.length);
          setIsSyncModalOpen(true);
        }

        // const bulkBillPayload = billData.data.map((row) => {
        //   return {
        //     cardNo: row.cardNo,
        //     createdAt: row.createdAt,
        //     createdBy: id,
        //     customerID: row.customerID,
        //     detail: row.detail.map((item) => ({
        //       discount: item.discount,
        //       quantity: item.quantity,
        //       rate: item.rate,
        //       serviceID: item.serviceID,
        //       total: item.total,
        //     })),
        //     grandTotal: row.grandTotal.toString(),
        //     paymentID: row.paymentID,
        //     phoneNumber: row.phoneNumber.toString(),
        //     roomNo: row.roomNo,
        //     staffID: row.staffID,
        //     userID: row.userID,
        //     isDeleted: false,
        //     isActive: true,
        //     referenceBy: row.referenceBy,
        //   };
        // });

        // const response = await createBulkBill(bulkBillPayload);
        // if (response.statusCode === 200) {
        //   const deleteAll = await deleteAllData(Stores.Bills);
        //   if (deleteAll.statusCode === 200) {
        //     showToast(response.message, true);
        //     setIsSyncModalOpen(false);
        //   }
        // } else {
        // }
      }
    };

    checkBillDataExist();
  }, [id]);

  return {
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
    isSyncModalOpen,
    setIsSyncModalOpen,
    billCount,

    fetchBillData,
  };
};

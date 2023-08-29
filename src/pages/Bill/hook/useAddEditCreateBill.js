import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { useCallback, useEffect, useMemo, useState } from "react";
// import { getPaymentTypeList } from "../../../service/paymentType";
// import { getCustomerList } from "../../../service/customer";
// import { getStaffList } from "../../../service/staff";
// import { getServiceList } from "../../../service/service";
import { showToast } from "../../../utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { getBillById, updateBill } from "../../../service/bill";
import { startLoading, stopLoading } from "../../../redux/loader";
import PrintContent from "../../../components/PrintContent";
import {
  Stores,
  addData,
  getSingleData,
  getStoreData,
  updateData,
} from "../../../utils/db";

let editCardNo = "";

export const useAddEditCreateBill = (tag) => {
  const dispatch = useDispatch();
  const billData = useSelector((state) => state.bill.data);

  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const [paymentTypeOptions, setPaymentTypeOptions] = useState([]);
  const [paymentType, setPaymentType] = useState([]);

  const [customersOptions, setCustomersOptions] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [staffOptions, setStaffOptions] = useState([]);
  const [staff, setStaff] = useState([]);

  const [serviceOptions, setServiceOptions] = useState([]);
  const [service, setService] = useState([]);

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

  // eslint-disable-next-line
  const [submitedBillData, setSubmitedBillData] = useState("");

  const navigate = useNavigate();

  // const userRole = loggedInUser?.px_role?.name?.toLowerCase();

  const {
    control,
    getValues,
    setValue,
    handleSubmit,
    reset,
    watch,
    clearErrors,
  } = useForm({
    defaultValues: {
      billNo: "",
      paymentID: "",
      date: new Date().toISOString().split("T")[0],
      customerID: "",
      Phone: "",
      staffID: "",
      roomNo: "",
      cardNo: "Cash",
      grandTotal: 0,
      detail: [
        {
          index: 0,
          serviceID: "",
          quantity: "",
          rate: "",
          discount: "",
          total: "",
        },
      ],
      roleID: "",
      billTitle: "",
      address: "",
      phoneNumber: "",
      phoneNumber2: "",
    },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    name: "detail",
    control: control,
  });

  useEffect(() => {
    setValue("phoneNumber", loggedInUser.phoneNumber);
    if (loggedInUser?.roleID !== 1) {
      setValue("billTitle", loggedInUser.billTitle);
      setValue("address", loggedInUser.address);
      setValue("phoneNumber2", loggedInUser.phoneNumber2);
      setValue("roleID", loggedInUser.roleID);
    }
  }, [loggedInUser, setValue]);

  useEffect(() => {
    let firstBillNo = 0;
    if (billData.length) {
      firstBillNo = +billData[0].billNo?.substring(1);
      window.localStorage.setItem("billNo", firstBillNo);
    } else {
      firstBillNo = +window.localStorage.getItem("billNo");
    }
    let billNo = (firstBillNo += 1).toString().padStart(8, "0");
    setValue("billNo", "G" + billNo);
  }, [billData, setValue]);

  // const selectedCus = watch("customerID");
  // console.log("watch", selectedCus);
  // useEffect(() => {
  //   console.log("inside useEffect");
  //   setValue(
  //     "Phone",
  //     selectedCus === "" || selectedCus === null
  //       ? ""
  //       : customers.find((row) => row.id === selectedCus.value)?.name
  //   );
  // }, [customers, selectedCus, setValue]);
  const changeCustomerPhoneHandler = (selectedCus) => {
    setValue(
      "Phone",
      selectedCus === "" || selectedCus === null
        ? ""
        : customers.find((row) => row.id === selectedCus.value)?.name
    );
  };

  const newBtnClickHandler = () => {
    if (
      getValues("paymentID") ||
      getValues("customerID") ||
      getValues("staffID") ||
      getValues("grandTotal") ||
      getValues("detail.0.quantity") ||
      getValues("detail.0.serviceID") ||
      getValues("roomNo")
    ) {
      setIsSaveModalOpen(true);
    } else {
      reset();
    }
  };

  const dontSaveHandler = () => {
    reset();
    setIsSaveModalOpen(false);
  };

  // genrate payment options for drop down
  const setPaymentOptionAndCard = useCallback(() => {
    const data = paymentType.map((item) => {
      return { value: item.id, label: item.name };
    });
    setPaymentTypeOptions([...data]);
    if (tag === "add") {
      const initialValue = data.filter(
        (row) => row?.label?.toLowerCase() === "cash"
      );
      setValue("paymentID", initialValue[0]);
      setValue("cardNo", initialValue[0]?.label);
    }
  }, [paymentType, setValue, tag]);

  useEffect(() => {
    setPaymentOptionAndCard();
  }, [setPaymentOptionAndCard]);

  const handlePaymentChange = (value) => {
    const { label } = value;
    if (label?.toLowerCase() === "cash" || label?.toLowerCase() === "upi") {
      setValue("cardNo", label);
    } else {
      if (tag === "add") {
        setValue("cardNo", "");
      } else if (tag === "edit") {
        setValue("cardNo", editCardNo);
      }
    }
  };

  // get payment type list
  useEffect(() => {
    try {
      const fetchPaymentTypeData = async () => {
        // const body = listPayload(0, { isActive: true }, 1000);
        // const response = await getPaymentTypeList(body);
        const response = await getStoreData(Stores.Payment);
        if (response?.statusCode === 200) {
          const payload = response?.data;
          setPaymentType(payload);
        } else if (response?.statusCode === 404) {
          const payload = [];
          setPaymentType(payload);
        }
      };
      fetchPaymentTypeData();
    } catch (error) {
      showToast(error?.message, false);
    }
  }, []);

  // genrate customer options for drop down
  useEffect(() => {
    const data = customers.map((item) => {
      return { value: item.id, label: item.phoneNumber };
    });
    setCustomersOptions([...data]);
  }, [customers]);

  const setCustomerSelectedHandler = (id, phone, name) => {
    setValue("customerID", { value: id, label: phone });
    setValue("Phone", name);
  };

  // get customers list
  const fetchCustomersData = useCallback(async () => {
    try {
      // let whereCondition = {
      //   isActive: true,
      // };
      // if (userRole !== "admin") {
      //   whereCondition = {
      //     ...whereCondition,
      //     createdBy: loggedInUser.id,
      //   };
      // }
      // const body = listPayload(0, whereCondition, 1000);

      // const response = await getCustomerList(body);
      const response = await getStoreData(Stores.Customer);

      if (response?.statusCode === 200) {
        const payload = response?.data;
        setCustomers(payload);
      } else if (response?.statusCode === 404) {
        const payload = [];
        setCustomers(payload);
      }
    } catch (error) {
      showToast(error?.message, false);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchCustomersData();
  }, [fetchCustomersData]);

  // genrate staff options for drop down
  useEffect(() => {
    const data = staff.map((item) => {
      return { value: item.id, label: item.name };
    });
    setStaffOptions([...data]);
  }, [staff]);

  const setStaffSelectedHandler = (id, name) => {
    setValue("staffID", { value: id, label: name });
  };

  // get staff list
  const fetchStaffData = useCallback(async () => {
    try {
      // let whereCondition = {
      //   isActive: true,
      // };
      // if (userRole !== "admin") {
      //   whereCondition = {
      //     ...whereCondition,
      //     createdBy: loggedInUser.id,
      //   };
      // }

      // const body = listPayload(0, whereCondition, 1000);

      // const response = await getStaffList(body);
      const response = await getStoreData(Stores.Staff);

      if (response?.statusCode === 200) {
        const payload = response?.data;
        setStaff(payload);
      } else if (response?.statusCode === 404) {
        const payload = [];
        setStaff(payload);
      }
    } catch (error) {
      showToast(error?.message, false);
    }
    // eslint-disable-next-line
  }, [loggedInUser]);

  useEffect(() => {
    fetchStaffData();
  }, [fetchStaffData]);

  // genrate service options for drop down
  useEffect(() => {
    const data = service.map((item) => {
      return { value: item.id, label: item.name };
    });
    setServiceOptions([...data]);
  }, [service]);

  const isCardSelect = useMemo(() => {
    const value = getValues("paymentID")?.label?.toLowerCase();
    if (["cash", "upi"].includes(value)) {
      return true;
    } else {
      return false;
    }
    // eslint-disable-next-line
  }, [watch("paymentID"), getValues]);

  // get service list
  useEffect(() => {
    try {
      const fetchServiceData = async () => {
        // const body = listPayload(0, { isActive: true }, 1000);

        // const response = await getServiceList(body);
        const response = await getStoreData(Stores.Service);

        if (response?.statusCode === 200) {
          const payload = response?.data;
          setService(payload);
        } else if (response?.statusCode === 404) {
          const payload = [];
          setService(payload);
        }
      };
      fetchServiceData();
    } catch (error) {
      showToast(error?.message, false);
    }
  }, []);

  const onSubmit = async (data) => {
    const detailData = data.detail.map((item) => {
      return {
        serviceID: +item.serviceID.value,
        service: { name: item.serviceID.label },
        quantity: +item.quantity,
        rate: +item.rate,
        discount: +item.discount,
        total: +item.total,
      };
    });
    try {
      dispatch(startLoading());
      const payload = {
        id: getValues("billNo"),
        billNo: getValues("billNo"),
        userID: loggedInUser.id,
        staffID: data.staffID.value,
        customerID: data.customerID.value,
        detail: detailData,
        paymentID: data.paymentID.value,
        grandTotal: data.grandTotal,
        phoneNumber: +data.customerID.label,
        roomNo: data.roomNo,
        cardNo: data.paymentID?.label?.toLowerCase()?.includes("card")
          ? data.cardNo
          : "",

        px_customer: {
          name: data.Phone,
          phoneNumber: +data.customerID.label,
        },
        px_payment_type: { name: data.paymentID.label },
        px_staff: { name: data.staffID.label },
      };

      let response;

      if (tag === "add") {
        response = await addData(Stores.Bills, {
          ...payload,
          createdAt: new Date().toISOString(),
          createdBy: loggedInUser.id,
        });
      } else {
        if (id.charAt(0) === "G") {
          response = await updateData(Stores.Bills, payload.id, {
            ...payload,
            updatedAt: new Date().toISOString(),
            updatedBy: loggedInUser.id,
          });
        } else {
          const payload = {
            userID: loggedInUser.id,
            staffID: data.staffID.value,
            customerID: data.customerID.value,
            detail: detailData,
            paymentID: data.paymentID.value,
            grandTotal: data.grandTotal,
            roomNo: data.roomNo,
            phoneNumber: +data.customerID.label,
            cardNo: data.paymentID?.label?.toLowerCase()?.includes("card")
              ? data.cardNo
              : "",
          };
          response = await updateBill(
            { ...payload, updatedBy: loggedInUser.id },
            id
          );
        }
      }

      if (response.statusCode === 200) {
        showToast(response.message, true);
        if (tag === "add") {
          reset();
          let firstBillNo = +response.data.billNo?.substring(1);
          window.localStorage.setItem("billNo", firstBillNo);
          let billNo = (firstBillNo += 1).toString().padStart(8, "0");
          setValue("billNo", "G" + billNo);
          setSubmitedBillData(response.data);
          setPaymentOptionAndCard();
        } else {
          window.localStorage.removeItem("billNo");
          navigate("/bill");
        }
      } else {
        showToast(response.message, false);
      }
      // ------------------
      // const response =
      //   tag === "add"
      //     ? await createBill({ ...payload, createdBy: loggedInUser.id })
      //     : await updateBill({ ...payload, updatedBy: loggedInUser.id }, id);

      // if (response.statusCode === 200) {
      //   showToast(response.message, true);
      //   if (tag === "add") {
      //     reset();
      //     let firstBillNo = +response.data.billNo?.substring(1);
      //     window.localStorage.setItem("billNo", firstBillNo);
      //     let billNo = (firstBillNo += 1).toString().padStart(8, "0");
      //     setValue("billNo", "G" + billNo);
      //     setSubmitedBillData(response.data);
      //     setPaymentOptionAndCard();
      //   } else {
      //     window.localStorage.removeItem("billNo");
      //     navigate("/bill");
      //   }
      // } else {
      //   showToast(response.messageCode, false);
      // }
      // ------------------
      // if (tag === "add") {
      //   const payload = {
      //     userID: loggedInUser.id,
      //     staffID: data.staffID.value,
      //     customerID: data.customerID.value,
      //     detail: detailData,
      //     paymentID: data.paymentID.value,
      //     grandTotal: data.grandTotal,
      //     phoneNumber: +data.customerID.label,
      //     roomNo: data.roomNo,
      //     cardNo: data.paymentID?.label?.toLowerCase()?.includes("card")
      //       ? data.cardNo
      //       : "",
      //     createdBy: loggedInUser.id,
      //   };
      //   console.log("payload", payload);
      //   const response = await createBill(payload);
      //   if (response.statusCode === 200) {
      //     showToast(response.message, true);
      //     reset();
      //     let firstBillNo = +response.data.billNo?.substring(1);
      //     window.localStorage.setItem("billNo", firstBillNo);
      //     let billNo = (firstBillNo += 1).toString().padStart(8, "0");
      //     setValue("billNo", "G" + billNo);
      //     setSubmitedBillData(response.data);
      //     setPaymentOptionAndCard();
      //     // navigate("/bill");
      //   } else {
      //     showToast(response.messageCode, false);
      //   }
      // } else if (tag === "edit") {
      //   const payload = {
      //     userID: loggedInUser.id,
      //     staffID: data.staffID.value,
      //     customerID: data.customerID.value,
      //     detail: detailData,
      //     paymentID: data.paymentID.value,
      //     grandTotal: data.grandTotal,
      //     roomNo: data.roomNo,
      //     phoneNumber: +data.customerID.label,
      //     cardNo: data.paymentID?.label?.toLowerCase()?.includes("card")
      //       ? data.cardNo
      //       : "",
      //     updatedBy: loggedInUser.id,
      //   };
      //   console.log("Edit", payload);
      //   const response = await updateBill(payload, id);

      //   if (response.statusCode === 200) {
      //     showToast(response.message, true);
      //     window.localStorage.removeItem("billNo");
      //     navigate("/bill");
      //   } else {
      //     showToast(response.messageCode, false);
      //   }
      // }
      dispatch(stopLoading());
    } catch (error) {
      showToast(error?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  };

  const addRow = () => {
    const index = getValues("detail").length;
    append({
      index: index,
      serviceID: "",
      quantity: "",
      rate: "",
      discount: "",
      total: "",
    });
  };

  const removeRow = (index) => {
    const grandTotal = getValues(`grandTotal`);
    const rowTotal = getValues(`detail.${index}.total`);
    const total = grandTotal - rowTotal;
    setValue(`grandTotal`, total);
    remove(index);
  };

  const calculateTotal = (index) => {
    const rate = getValues(`detail.${index}.rate`) || 0;
    const qty = getValues(`detail.${index}.quantity`) || 0;
    const discount = getValues(`detail.${index}.discount`) || 0;
    let total = qty * rate;
    if (discount > 0) {
      total = total - (total * discount) / 100;
    }
    setValue(`detail.${index}.total`, total);
    calculateGrandTotal();
  };

  const calculateGrandTotal = () => {
    const detail = getValues("detail");
    let grandTotal = 0;
    detail.forEach((item) => {
      grandTotal += item.total;
    });
    setValue(`grandTotal`, grandTotal);
  };

  const setQtyRateValuesHandler = (id, index) => {
    setValue(`detail.${index}.quantity`, 1);
    setValue(`detail.${index}.discount`, 0);
    const ser = service.find((row) => row.id === id);
    setValue(`detail.${index}.rate`, ser.amount);
    calculateTotal(index);
    clearErrors(`detail.${index}`);
  };

  const fetchEditBillData = useCallback(async () => {
    try {
      if (id) {
        dispatch(startLoading());
        let response;
        if (id.charAt(0) === "G") {
          response = await getSingleData(Stores.Bills, id);
        } else {
          response = await getBillById(id);
        }
        // console.warn(response);
        if (response?.statusCode === 200) {
          const date = new Date(response.data.createdAt);
          setValue("billNo", response.data.billNo);
          setValue("roomNo", response.data.roomNo);
          setValue("date", date.toISOString().substring(0, 10));
          setValue("paymentID", {
            value: response.data.paymentID,
            label: response.data.px_payment_type.name,
          });
          setValue("staffID", {
            value: response.data.staffID,
            label: response.data.px_staff.name,
          });
          setValue("customerID", {
            value: response.data.customerID,
            label: response.data.px_customer.phoneNumber,
          });
          setValue("Phone", response.data.px_customer.name);
          setValue("grandTotal", response.data.grandTotal);
          editCardNo = response.data.cardNo;
          setValue("cardNo", response.data.cardNo);

          const items = response.data.detail.map((item) => {
            return {
              id: item.id,
              index: item.index,
              serviceID: {
                value: item.serviceID,
                label: item.service.name,
              },
              quantity: item.quantity,
              rate: item.rate,
              discount: item.discount,
              total: item.total,
            };
          });
          setValue("detail", items);
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
    tag === "edit" && fetchEditBillData();
  }, [tag, fetchEditBillData]);

  const print = (billData) => {
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
    // const printWindow = window.open("", "_blank");
    printWindow.document.write(PrintContent(billData, branchData));
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  const printHandler = async () => {
    const detail = getValues("detail");
    const detailData = detail.map((item) => {
      return {
        serviceID: +item.serviceID.value,
        service: { name: item.serviceID.label },
        quantity: +item.quantity,
        rate: +item.rate,
        discount: +item.discount,
        total: +item.total,
      };
    });

    // print Data start
    const billData = {
      subTotal: getValues("grandTotal"),
      total: getValues("grandTotal"),
      billNo: getValues("billNo"),
      payment: paymentType.find(
        (row) => row.id === getValues("paymentID").value
      )?.name,
      cardNo: getValues("cardNo"),
      date: getValues("date"),
      customer: customers.find(
        (row) => row.id === getValues("customerID").value
      )?.name,
      customerID: getValues("customerID").value,
      phone: getValues("customerID").label,
      staff: staff.find((row) => row.id === getValues("staffID").value)?.name,
      roomNo: getValues("roomNo"),
      detail: getValues("detail").map((row) => {
        return { ...row, item: row.serviceID.label };
      }),

      phoneNumber: getValues("phoneNumber"),
      // billTitle: getValues("billTitle"),
      // address: getValues("address"),
      // phoneNumber2: getValues("phoneNumber2"),
      // roleID: getValues("roleID"),

      billTitle: loggedInUser.billTitle,
      address: loggedInUser.address,
      phoneNumber2: loggedInUser.phoneNumber2,
      roleID: loggedInUser.roleID,
    };

    try {
      dispatch(startLoading());
      if (tag === "add") {
        const payload = {
          id: getValues("billNo"),
          billNo: getValues("billNo"),
          userID: loggedInUser.id,
          staffID: getValues("staffID").value,
          customerID: getValues("customerID").value,
          detail: detailData,
          paymentID: getValues("paymentID").value,
          grandTotal: getValues("grandTotal"),
          phoneNumber: getValues("customerID").label,
          roomNo: getValues("roomNo"),
          cardNo: getValues("paymentID")?.label?.toLowerCase()?.includes("card")
            ? getValues("cardNo")
            : "",

          px_customer: {
            name: getValues("Phone"),
            phoneNumber: +getValues("customerID").label,
          },
          px_payment_type: { name: getValues("paymentID").label },
          px_staff: { name: getValues("staffID").label },
        };

        const response = await addData(Stores.Bills, {
          ...payload,
          createdAt: new Date().toISOString(),
          createdBy: loggedInUser.id,
        });

        if (response?.statusCode === 200) {
          showToast(response?.message, true);
          reset();
          let firstBillNo = +response.data.billNo?.substring(1);
          window.localStorage.setItem("billNo", firstBillNo);
          let billNo = (firstBillNo += 1).toString().padStart(8, "0");
          setValue("billNo", "G" + billNo);
          setSubmitedBillData(response.data);
          setPaymentOptionAndCard();
          print(billData);
        } else {
          showToast(response?.message, false);
        }

        // const response = await createBill(payload);
        // if (response?.statusCode === 200) {
        //   showToast(response?.message, true);
        //   reset();
        //   let firstBillNo = +response.data.billNo?.substring(1);
        //   window.localStorage.setItem("billNo", firstBillNo);
        //   let billNo = (firstBillNo += 1).toString().padStart(8, "0");
        //   setValue("billNo", "G" + billNo);
        //   setSubmitedBillData(response.data);
        //   setPaymentOptionAndCard();
        //   print(billData);
        // } else {
        //   showToast(response?.message, false);
        // }
      } else if (tag === "edit") {
        let response;
        if (id.charAt(0) === "G") {
          const payload = {
            id: getValues("billNo"),
            billNo: getValues("billNo"),
            userID: loggedInUser.id,
            staffID: getValues("staffID").value,
            customerID: getValues("customerID").value,
            detail: detailData,
            paymentID: getValues("paymentID").value,
            grandTotal: getValues("grandTotal"),
            roomNo: getValues("roomNo"),
            phoneNumber: getValues("customerID").label,
            cardNo: getValues("paymentID")
              ?.label?.toLowerCase()
              ?.includes("card")
              ? getValues("cardNo")
              : "",

            px_customer: {
              name: getValues("Phone"),
              phoneNumber: +getValues("customerID").label,
            },
            px_payment_type: { name: getValues("paymentID").label },
            px_staff: { name: getValues("staffID").label },
          };
          response = await updateData(Stores.Bills, payload.id, {
            ...payload,
            updatedAt: new Date().toISOString(),
            updatedBy: loggedInUser.id,
          });
        } else {
          const payload = {
            userID: loggedInUser.id,
            staffID: getValues("staffID").value,
            customerID: getValues("customerID").value,
            detail: detailData,
            paymentID: getValues("paymentID").value,
            grandTotal: getValues("grandTotal"),
            roomNo: getValues("roomNo"),
            phoneNumber: getValues("customerID").label,
            cardNo: getValues("paymentID")
              ?.label?.toLowerCase()
              ?.includes("card")
              ? getValues("cardNo")
              : "",
          };
          // response = await updateBill(payload, id);
          response = await updateBill(
            { ...payload, updatedBy: loggedInUser.id },
            id
          );
        }

        if (response?.statusCode === 200) {
          showToast(response?.message, true);
          print(billData);
          navigate("/bill");
        } else {
          showToast(response?.message, false);
        }
      }
      dispatch(stopLoading());
    } catch (error) {
      showToast(error?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  };

  return {
    control,
    fields,
    paymentTypeOptions,
    customersOptions,
    staffOptions,
    serviceOptions,
    reset,
    addRow,
    onSubmit,
    navigate,
    removeRow,
    handleSubmit,
    calculateTotal,
    calculateGrandTotal,
    isSaveModalOpen,
    setIsSaveModalOpen,
    newBtnClickHandler,
    dontSaveHandler,

    isCustomerModalOpen,
    setIsCustomerModalOpen,
    fetchCustomersData,

    isStaffModalOpen,
    setIsStaffModalOpen,
    fetchStaffData,

    setQtyRateValuesHandler,
    printHandler,
    getValues,
    handlePaymentChange,
    isCardSelect,

    setStaffSelectedHandler,
    setCustomerSelectedHandler,
    changeCustomerPhoneHandler,
  };
};

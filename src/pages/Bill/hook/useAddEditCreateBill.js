import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getPaymentTypeList } from "../../../service/paymentType";
import { getCustomerList } from "../../../service/customer";
import { getStaffList } from "../../../service/staff";
import { getServiceList } from "../../../service/service";
import { fetchLoggedInUserData } from "../../../service/loggedInUser";
import { listPayload, showToast, showTwoDecimal, showTwoDecimalWithoutRound } from "../../../utils/helper";
import { getBillById, updateBill, createBill } from "../../../service/bill";
import { startLoading, stopLoading } from "../../../redux/loader";
import PrintContent from "../../../components/PrintContent";

// const { REACT_APP_CGST, REACT_APP_SGST} = process.env;

let editCardNo = "";

export const useAddEditCreateBill = (tag) => {
  const dispatch = useDispatch();
  // eslint-disable-next-line
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

  const [isCustomerBillDataModalOpen, setIsCustomerBillDataModalOpen] =
    useState(false);

  const [isViewDetailOpen, setIsViewDetailOpen] = useState(false);
  const [isPrintBtn, setIsPrintBtn] = useState(false);
  // eslint-disable-next-line
  const [submitedBillData, setSubmitedBillData] = useState("");

  const navigate = useNavigate();
  // const [editUserId, setEditUserId] = useState("");

  // const userRole = loggedInUser?.px_role?.name?.toLowerCase();

  const {
    control,
    getValues,
    setValue,
    handleSubmit,
    reset,
    watch,
    // setError,
    clearErrors,
    formState: {isSubmitting, isValid}
  } = useForm({
    defaultValues: {
      billNo: "",
      paymentID: "",
      date: new Date(),
      customerID: "",
      Phone: "",
      staffID: "",
      roomNo: "",
      cardNo: "",
      csgst: 0,
      sgst: 0,
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
      referenceBy: "",
      managerName: ""
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

  const getNewBillNo = async () => {
    // const response = await getStoreData(Stores.BillNo);
    // const latestBillNo = response.data[0].latestBillNo;
    const latestBillNo = localStorage.getItem('latestBillNo');
    // const numericPart = latestBillNo.match(/\d+$/)[0];
    // const incrementedNumber = parseInt(numericPart, 10) + 1;
    // const formattedNumber = incrementedNumber
    //   .toString()
    //   .padStart(numericPart.length, "0");
    const finalBillNumber = latestBillNo; //.replace(/\d+$/, formattedNumber);

    setValue("billNo", finalBillNumber);
  };
  useEffect(() => {
    getNewBillNo();
    // eslint-disable-next-line
  }, []);

  const searchCustomer = async (customerPhone) => {
    try {
      if(customerPhone.length === 10) {
        const whereCondition = {
          searchText: customerPhone,
          isActive: true,
          isDeleted: false
        };
        const payload = listPayload(0, whereCondition, 1000000);
        const { success, data } = await getCustomerList(payload);
        if(success) {
          setCustomers(data?.rows);
        } else {
          setCustomers([]);
        }
      } else if(customerPhone.length === 0) {
        setCustomers([]);
      }
    } catch(err) {
      showToast(err?.message, false);
    }
  }

  const toggleViewDetailOpen = () => {
    setIsViewDetailOpen(!isViewDetailOpen);
  }

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
      getValues("roomNo") ||
      getValues("managerName")
    ) {
      setIsSaveModalOpen(true);
    } else {
      reset();
      setValue('date', new Date());
    }
  };

  const dontSaveHandler = () => {
    reset();
    setValue('date', new Date());
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
      // setValue("paymentID", initialValue[0]);
      setValue("cardNo", initialValue[0]?.label);
    }
  }, [paymentType, setValue, tag]);

  useEffect(() => {
    setPaymentOptionAndCard();
  }, [setPaymentOptionAndCard]);

  const isSelectedPayment = useMemo(() => {
    const detail = getValues('paymentID');
    if(typeof detail === 'object') {
      return detail?.value;
    } else if(typeof detail === 'string') {
      return parseInt(detail);
    }
    // eslint-disable-next-line
  }, [watch('paymentID')]);

  const handlePaymentChange = (value) => {
    const selected = paymentTypeOptions.find((pym) => pym.value === parseInt(value));
    const { label } = selected; //value;
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

  useEffect(() => {
    const fetchDropDownList = async () => {
      const whereCondition = {
        isActive: true,
        isDeleted: false
      };
      const payload = listPayload(0, whereCondition, 100000);
      const [
        staffResponse,
        serviceResponse,
        paymentResponse,
      ] = await Promise.all([
        getStaffList(listPayload(0, loggedInUser?.px_role?.name?.toLowerCase() === 'admin' ? {...whereCondition, searchText: "THERAPIST"} : {...whereCondition, searchText: "THERAPIST", createdBy: loggedInUser.id}, 100000)),
        getServiceList(payload),
        getPaymentTypeList(payload)
      ]);
      if(staffResponse?.statusCode === 200 && staffResponse?.success) {
        setStaff(staffResponse.data?.rows);
      } else {
        setStaff([]);
      }
      if(serviceResponse?.statusCode === 200 && serviceResponse?.success) {
        setService(serviceResponse.data?.rows);
      } else {
        setService([]);
      }
      if(paymentResponse?.statusCode === 200 && paymentResponse?.success) {
        setPaymentType(paymentResponse.data?.rows);
      } else {
        setPaymentType([]);
      }
    }
    fetchDropDownList();
    // eslint-disable-next-line
  }, []);

  // genrate customer options for drop down
  useEffect(() => {
    const data = customers.map((item) => {
      return { value: item.id, label: item.phoneNumber };
    });
    setCustomersOptions([...data]);
  }, [customers]);

  const setCustomerSelectedHandler = (id, phone, name, custNo) => {
    setValue("customerID", { value: id, label: phone, customerNo: custNo });
    setValue("Phone", name);
    clearErrors("customerID");
  };

  // genrate staff options for drop down
  useEffect(() => {
    const data = staff.map((item) => {
      return { value: item.id, label: item.nickName };
    });
    setStaffOptions([...data]);
  }, [staff]);

  const setStaffSelectedHandler = (id, name) => {
    setValue("staffID", { value: id, label: name });
    clearErrors("staffID");
  };

  // genrate service options for drop down
  useEffect(() => {
    const data = service.map((item) => {
      return { value: item.id, label: item.name };
    });
    setServiceOptions([...data]);
  }, [service]);

  const isCardSelect = useMemo(() => {
    const value = paymentTypeOptions.find((pym) => pym.value === parseInt(getValues("paymentID")))
    if(value) {
      if (["cash", "upi"].includes(value?.label?.toLowerCase())) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
    // eslint-disable-next-line
  }, [watch("paymentID"), getValues]);

  const onSubmit = async (data) => {
    if(!isSubmitting) {
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
          id: tag === 'add' ? null : id,
          // billNo: getValues("billNo"),
          staffID: data.staffID.value,
          customerID: data.customerID.value,
          detail: detailData,
          paymentID: typeof data.paymentID === 'object' ? data.paymentID?.value : parseInt(data.paymentID),
          grandTotal: data.grandTotal,
          phoneNumber: +data.customerID.label,
          roomNo: data.roomNo,
          cardNo: data.paymentID?.label?.toLowerCase()?.includes("card") ? data.cardNo : "",
          px_customer: { name: data.Phone, phoneNumber: +data.customerID.label,},
          px_payment_type: { name: data.paymentID.label },
          px_staff: { name: data.staffID.label },
          referenceBy: data.referenceBy,
          managerName: data.managerName
        };
        const response = tag === 'add' ?
          await createBill({
            ...payload,
            userID: loggedInUser.id,
            createdBy: loggedInUser.id,
          })
        :
          await updateBill({
            ...payload,
            updatedBy: loggedInUser.id,
          }, id);
        if (response.statusCode === 200) {
          showToast(response.message, true);
          if (tag === "add") {
            const { success, message, data} = await fetchLoggedInUserData();
            if (success) {
              const latestBillNo = data.latestBillNo;
              localStorage.setItem('latestBillNo', latestBillNo);
            } else {
              showToast(message, false);
            }
            reset();
            setValue('date', new Date());
            getNewBillNo();
            setSubmitedBillData(response.data);
            setPaymentOptionAndCard();
          } else {
            navigate("/bill");
          }
        } else {
          showToast(response.message, false);
        }
      } catch (error) {
        showToast(error?.message, false);
      } finally {
        dispatch(stopLoading());
      }
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
    if(loggedInUser.isShowGst) {
      calculateGst(total > 0 ? parseFloat((total / 118) * 100).toString() : total.toString(), index);
    } else {
      setValue(`detail.${index}.total`, total.toFixed(2));
      calculateGrandTotal();
    }
  };

  const calculateGst = (total, index) => {
    const tempTotal = showTwoDecimalWithoutRound(total);
    const cgst = (parseFloat(tempTotal) * 0.09).toFixed(2); //parseFloat(((total * parseFloat(REACT_APP_CGST)) / 100).toFixed(2));
    const sgst = (parseFloat(tempTotal) * 0.09).toFixed(2);//parseFloat(((total * parseFloat(REACT_APP_SGST)) / 100).toFixed(2));
    setValue(`detail.${index}.total`, tempTotal);
    setValue('csgst', cgst);
    setValue('sgst', sgst);
    calculateGrandTotal();
  }

  const calculateGrandTotal = () => {
    const detail = getValues("detail");
    let grandTotal = 0;
    detail.forEach((item) => {
      if(loggedInUser.isShowGst) {

        grandTotal = grandTotal + parseFloat(item.total) + parseFloat(getValues('csgst')) + parseFloat(getValues('sgst'));
      } else {
        grandTotal = grandTotal + parseFloat(item.total);
      }
    });
    setValue(`grandTotal`, showTwoDecimal(Math.round(grandTotal)));
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
        const response = await getBillById(id);
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
            value:
              response.data.customerID,
            label: response.data.px_customer.phoneNumber,
          });
          setValue("Phone", response.data.px_customer.name);
          setValue("grandTotal", response.data.grandTotal);
          setValue("csgst", response.data.cgst);
          setValue("sgst", response.data.sgst);
          editCardNo = response.data.cardNo;
          setValue("cardNo", response.data.cardNo);
          setValue("referenceBy", response.data.referenceBy);
          setValue("managerName", response.data.managerName);
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

          // setEditUserId(response.data.userID);
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
    try {
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

      const printWindow = window.open("", "_blank", "popup=yes,menubar=no,toolbap=no");
      if(printWindow && printWindow.document) {
        printWindow.document.write(PrintContent(billData, branchData));
        printWindow.document.close();
        printWindow.onload = () => {
          printWindow.print();
          printWindow.close();
        };
      }
    } catch(err) {
      showToast(err?.message, false);
    }
  };

  const printHandler = async (info) => {
    if(!isSubmitting) {
      setIsViewDetailOpen(false);
      setIsPrintBtn(false);
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
        subTotal: getValues(`detail.${0}.total`),
        total: getValues("grandTotal"),
        billNo: getValues("billNo"),
        payment: typeof getValues('paymentID') === 'object' ? getValues('paymentID')?.label : paymentType.find(
          (row) => row.id === parseInt(getValues("paymentID"))
        )?.name,
        cardNo: getValues("cardNo"),
        date: new Date(), //getValues("date"),
        customer: customers.find(
          (row) => row.id === getValues("customerID").value
        )?.name,
        customerID: getValues("customerID").value,
        phone: getValues("customerID").label,
        staff: staff.find((row) => row.id === getValues("staffID").value)?.nickName,
        roomNo: getValues("roomNo"),
        detail: getValues("detail").map((row) => {
          return { ...row, item: row.serviceID.label };
        }),
        phoneNumber: getValues("phoneNumber"),
        billTitle: loggedInUser.billTitle,
        address: loggedInUser.address,
        phoneNumber2: loggedInUser.phoneNumber2,
        roleID: loggedInUser.roleID,
        gstNo: loggedInUser.gstNo,
        isShowGst: loggedInUser.isShowGst,
        cgst: loggedInUser.isShowGst ? getValues('csgst') : 0,
        sgst: loggedInUser.isShowGst ? getValues('sgst') : 0,
        reviewUrl: loggedInUser.reviewUrl && loggedInUser.reviewUrl.length ? loggedInUser.reviewUrl : null 
      };

      try {
        dispatch(startLoading());
        if (tag === "add") {
          const payload = {
            id: null, //getValues("billNo"),
            // billNo: getValues("billNo"),
            userID: loggedInUser.id,
            staffID: getValues("staffID").value,
            customerID: getValues("customerID").value,
            detail: detailData,
            paymentID: getValues("paymentID"),
            cgst: getValues("csgst"),
            sgst: getValues("sgst"),
            grandTotal: getValues("grandTotal"),
            phoneNumber: getValues("customerID").label,
            roomNo: getValues("roomNo"),
            cardNo: !isCardSelect ? getValues("cardNo") : "",

            px_customer: {
              name: getValues("Phone"),
              phoneNumber: +getValues("customerID").label,
            },
            // px_payment_type: { name: getValues("paymentID").label },
            px_staff: { name: getValues("staffID").label },
            referenceBy: getValues("referenceBy"),
            managerName: getValues('managerName')
          };
          const response = await createBill({
            ...payload,
            createdAt: new Date(),
            createdBy: loggedInUser.id,
          });

          if (response?.statusCode === 200) {
            showToast(response?.message, true);
            print(billData);
            const { success, message, data} = await fetchLoggedInUserData();
            if (success) {
              const latestBillNo = data.latestBillNo;
              localStorage.setItem('latestBillNo', latestBillNo);
            } else {
              showToast(message, false);
            }
            reset();
            setValue('date', new Date());
            getNewBillNo();
            setSubmitedBillData(response.data);
            setPaymentOptionAndCard();
          } else {
            showToast(response?.message, false);
          }
        } else if (tag === "edit") {
          const payload = {
            userID: loggedInUser.id,
            staffID: getValues("staffID").value,
            customerID: getValues("customerID").value,
            detail: detailData,
            paymentID: typeof getValues('paymentID') === 'object' ? getValues("paymentID").value : getValues('paymentID'),
            cgst: getValues("csgst"),
            sgst: getValues("sgst"),
            grandTotal: getValues("grandTotal"),
            roomNo: getValues("roomNo"),
            phoneNumber: getValues("customerID").label,
            cardNo: !isCardSelect ? getValues("cardNo") : "",
            referenceBy: getValues("referenceBy"),
            managerName: getValues("managerName")
          };
          const response = await updateBill({ ...payload, updatedBy: loggedInUser.id }, id);
          if (response?.statusCode === 200) {
            showToast(response?.message, true);
            print(billData);
            navigate("/bill");
          } else {
            showToast(response?.message, false);
          }
        }
      } catch (error) {
        showToast(error?.message, false);
      } finally {
        dispatch(stopLoading());
      }
    }
  };

  return {
    control,
    fields,
    isValid,
    isSubmitting,
    paymentTypeOptions,
    customersOptions,
    staffOptions,
    serviceOptions,
    isSelectedPayment,
    isPrintBtn,
    setIsPrintBtn,
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
    searchCustomer,
    // fetchCustomersData,

    isStaffModalOpen,
    setIsStaffModalOpen,
    // fetchStaffData,

    setQtyRateValuesHandler,
    printHandler,
    getValues,
    toggleViewDetailOpen,
    isViewDetailOpen,
    handlePaymentChange,
    isCardSelect,
    isShowGst: loggedInUser.isShowGst,

    setStaffSelectedHandler,
    setCustomerSelectedHandler,
    changeCustomerPhoneHandler,

    isCustomerBillDataModalOpen,
    setIsCustomerBillDataModalOpen,
  };
};

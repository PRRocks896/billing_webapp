import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getPaymentTypeList } from "../../../service/paymentType";
import { getCustomerList } from "../../../service/customer";
import { getStaffList } from "../../../service/staff";
import { getServiceList } from "../../../service/service";
import { showToast } from "../../../utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { createBill, getBillById, updateBill } from "../../../service/bill";
import { startLoading, stopLoading } from "../../../redux/loader";

export const useAddEditCreateBill = (tag) => {
  const dispatch = useDispatch();
  const billData = useSelector((state) => state.bill.data);

  let billNo = useMemo(() => {
    let firstBillNo = 0;
    if (billData.length) {
      firstBillNo = +billData[0].billNo?.substring(1);
      window.localStorage.setItem("billNo", firstBillNo);
    } else {
      firstBillNo = +window.localStorage.getItem("billNo");
    }
    return (firstBillNo += 1).toString().padStart(8, "0");
  }, [billData]);

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

  const navigate = useNavigate();

  const { control, getValues, setValue, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      billNo: "G" + billNo,
      paymentID: "",
      date: new Date().toISOString().split("T")[0],
      customerID: "",
      Phone: "",
      staffID: "",
      roomNo: "",
      // discount: 0,
      // discountAmount: 0,
      // exchange: 0,
      grandTotal: 0,
      detail: [
        {
          id: uuidv4(),
          index: 0,
          serviceID: "",
          quantity: "",
          rate: "",
          discount: "",
          total: "",
        },
      ],
    },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    name: "detail",
    control: control,
  });

  const selectedCus = watch("customerID");
  console.log("selectedCus", selectedCus);
  useMemo(() => {
    setValue(
      "Phone",
      selectedCus === "" || selectedCus === null
        ? ""
        : customers.find((row) => row.id === selectedCus.value)?.phoneNumber
    );
  }, [customers, selectedCus, setValue]);

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
  useMemo(() => {
    const data = paymentType.map((item) => {
      return { value: item.id, label: item.name };
    });
    setPaymentTypeOptions([...data]);
  }, [paymentType]);

  // get payment type list
  useEffect(() => {
    try {
      const fetchPaymentTypeData = async () => {
        const body = {
          where: {
            isActive: true,
            isDeleted: false,
          },
          pagination: {
            sortBy: "createdAt",
            descending: true,
            rows: 1000,
            page: 1,
          },
        };
        const response = await getPaymentTypeList(body);

        if (response.statusCode === 200) {
          const payload = response.data.rows;
          setPaymentType(payload);
        } else if (response.statusCode === 404) {
          const payload = [];
          setPaymentType(payload);
        }
      };
      fetchPaymentTypeData();
    } catch (error) {
      showToast(error.message, false);
    }
  }, []);

  // genrate customer options for drop down
  useMemo(() => {
    const data = customers.map((item) => {
      return { value: item.id, label: item.name };
    });
    setCustomersOptions([...data]);
  }, [customers]);

  // get customers list
  const fetchCustomersData = useCallback(async () => {
    try {
      const body = {
        where: {
          isActive: true,
          isDeleted: false,
        },
        pagination: {
          sortBy: "createdAt",
          descending: true,
          rows: 1000,
          page: 1,
        },
      };
      const response = await getCustomerList(body);

      if (response.statusCode === 200) {
        const payload = response.data.rows;
        setCustomers(payload);
      } else if (response.statusCode === 404) {
        const payload = [];
        setCustomers(payload);
      }
    } catch (error) {
      showToast(error.message, false);
    }
  }, []);
  useEffect(() => {
    fetchCustomersData();
  }, [fetchCustomersData]);

  // genrate staff options for drop down
  useMemo(() => {
    const data = staff.map((item) => {
      return { value: item.id, label: item.name };
    });
    setStaffOptions([...data]);
  }, [staff]);

  // get staff list
  const fetchStaffData = useCallback(async () => {
    try {
      const body = {
        where: {
          isActive: true,
          isDeleted: false,
        },
        pagination: {
          sortBy: "createdAt",
          descending: true,
          rows: 1000,
          page: 1,
        },
      };
      const response = await getStaffList(body);

      if (response.statusCode === 200) {
        const payload = response.data.rows;
        setStaff(payload);
      } else if (response.statusCode === 404) {
        const payload = [];
        setStaff(payload);
      }
    } catch (error) {
      showToast(error.message, false);
    }
  }, []);
  useEffect(() => {
    fetchStaffData();
  }, [fetchStaffData]);

  // genrate service options for drop down
  useMemo(() => {
    const data = service.map((item) => {
      return { value: item.id, label: item.name };
    });
    setServiceOptions([...data]);
  }, [service]);

  // get service list
  useEffect(() => {
    try {
      const fetchServiceData = async () => {
        const body = {
          where: {
            isActive: true,
            isDeleted: false,
          },
          pagination: {
            sortBy: "createdAt",
            descending: true,
            rows: 1000,
            page: 1,
          },
        };
        const response = await getServiceList(body);

        if (response.statusCode === 200) {
          const payload = response.data.rows;
          setService(payload);
        } else if (response.statusCode === 404) {
          const payload = [];
          setService(payload);
        }
      };
      fetchServiceData();
    } catch (error) {
      showToast(error.message, false);
    }
  }, []);

  const onSubmit = async (data) => {
    console.log("data", data);
    const detailData = data.detail.map((item) => {
      return {
        serviceID: item.serviceID.value,
        quantity: item.quantity,
        rate: item.rate,
        discount: item.discount,
        total: item.total,
      };
    });

    try {
      dispatch(startLoading());
      if (tag === "add") {
        const payload = {
          userID: loggedInUser.id,
          staffID: data.staffID.value,
          customerID: data.customerID.value,
          detail: detailData,
          paymentID: data.paymentID.value,
          grandTotal: data.grandTotal,
          phoneNumber: data.Phone,
          roomNo: data.roomNo,
          // name: "",
          cardNo: "",
          createdBy: loggedInUser.id,
        };

        const response = await createBill(payload);

        if (response.statusCode === 200) {
          showToast(response.message, true);
          navigate(-1);
        } else {
          showToast(response.messageCode, false);
        }
      } else if (tag === "edit") {
        const payload = {
          userID: loggedInUser.id,
          staffID: data.staffID.value,
          customerID: data.customerID.value,
          detail: detailData,
          paymentID: data.paymentID.value,
          grandTotal: data.grandTotal,
          roomNo: data.roomNo,
          // phoneNumber: "",
          // name: "",
          cardNo: "",
          createdBy: loggedInUser.id,
        };

        const response = await updateBill(payload, id);

        if (response.statusCode === 200) {
          showToast(response.message, true);
          navigate(-1);
        } else {
          showToast(response.messageCode, false);
        }
      }
      dispatch(stopLoading());
    } catch (error) {
      showToast(error.message, false);
    } finally {
      dispatch(stopLoading());
    }
  };

  const addRow = () => {
    const index = getValues("detail").length;
    append({
      id: uuidv4(),
      index: index,
      serviceID: "",
      quantity: "",
      rate: "",
      discount: "",
      total: "",
    });
  };

  const removeRow = (index) => {
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
    console.log("detail", detail);
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
  };

  const fetchEditBillData = useCallback(async () => {
    try {
      dispatch(startLoading());
      if (id) {
        const response = await getBillById(id);
        console.log(response.data);
        if (response.statusCode === 200) {
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
            label: response.data.px_customer.name,
          });
          setValue("grandTotal", response.data.grandTotal);

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
          showToast(response.message, false);
        }
      }
    } catch (error) {
      showToast(error.message, false);
    } finally {
      dispatch(stopLoading());
    }
  }, [id, dispatch, setValue]);

  useEffect(() => {
    fetchEditBillData();
  }, [fetchEditBillData]);

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
  };
};

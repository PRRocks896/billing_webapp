import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getPaymentTypeList } from "../../../service/paymentType";
import { getCustomerList } from "../../../service/customer";
import { getStaffList } from "../../../service/staff";
import { getServiceList } from "../../../service/service";
import { showToast } from "../../../utils/helper";
import { useSelector } from "react-redux";
import { createBill, getBillById } from "../../../service/bill";
import useLoader from "../../../hook/useLoader";

export const useAddEditCreateBill = () => {
  const { loading } = useLoader();
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

  const navigate = useNavigate();

  const {
    control,
    getValues,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      // billNo: "",
      paymentID: "",
      date: new Date().toISOString().split("T")[0],
      customerID: "",
      staffID: "",
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
  useEffect(() => {
    try {
      const fetchCustomersData = async () => {
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
      };
      fetchCustomersData();
    } catch (error) {
      showToast(error.message, false);
    }
  }, []);

  // genrate staff options for drop down
  useMemo(() => {
    const data = staff.map((item) => {
      return { value: item.id, label: item.name };
    });
    setStaffOptions([...data]);
  }, [staff]);

  // get staff list
  useEffect(() => {
    try {
      const fetchStaffData = async () => {
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
      };
      fetchStaffData();
    } catch (error) {
      showToast(error.message, false);
    }
  }, []);

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
      loading(true);

      const payload = {
        userID: loggedInUser.id,
        staffID: data.staffID.value,
        customerID: data.customerID.value,
        detail: detailData,
        paymentID: data.paymentID.value,
        grandTotal: data.grandTotal,
        // phoneNumber: "",
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
      loading(false);
    } catch (error) {
      showToast(error.message, false);
    } finally {
      loading(false);
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
    let grandTotal = 0;
    detail.forEach((item) => {
      grandTotal += item.total;
    });

    setValue(`grandTotal`, grandTotal);
  };

  const fetchEditBillData = useCallback(async () => {
    try {
      loading(true);
      if (id) {
        const response = await getBillById(id);
        if (response.statusCode === 200) {
          // setValue("paymentID", response.data.paymentID);
          // setValue("staffID", response.data.staffID);
          // setValue("customerID", response.data.customerID);
          // setValue("grandTotal", response.data.grandTotal);
        } else {
          showToast(response.message, false);
        }
      }
    } catch (error) {
      showToast(error.message, false);
    } finally {
      loading(false);
    }
  }, [id, loading, setValue]);

  useEffect(() => {
    fetchEditBillData();
  }, []);

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
  };
};

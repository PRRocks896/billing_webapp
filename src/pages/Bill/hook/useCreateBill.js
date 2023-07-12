import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useMemo, useState } from "react";
import { getPaymentTypeList } from "../../../service/paymentType";
import { getCustomerList } from "../../../service/customer";
import { getStaffList } from "../../../service/staff";
import { getServiceList } from "../../../service/service";
import { showToast } from "../../../utils/helper";

export const useCreateBill = () => {
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
      billNo: uuidv4(),
      paymentID: "",
      date: new Date().toISOString().split("T")[0],
      customerID: "",
      staffID: "",
      discount: 0,
      discountAmount: 0,
      exchange: 0,
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

  const onSubmit = (data) => console.log("data", data);

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
  };

  const calculateGrandTotal = () => {
    const discount = getValues(`discount`) || 0;
    const discountAmount = getValues(`discountAmount`) || 0;
    const exchange = getValues(`exchange`) || 0;

    const totalBill = fields?.reduce((total, item) => total + item.total, 0);
    const grandTotal =
      totalBill - (totalBill * discount) / 100 - discountAmount - exchange;

    setValue(`grandTotal`, grandTotal);
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
  };
};

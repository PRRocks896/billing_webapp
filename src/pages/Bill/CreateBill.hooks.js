import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

export const useCreateBill = () => {
  const options = [
    { value: "Option1", label: "Option 1" },
    { value: "Option2", label: "Option 2" },
    { value: "Option3", label: "Option 3" },
  ];

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

  const onSubmit = (data) => console.log("data", data);
  console.log(errors);

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
    options,
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

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
      billNo: "",
      paymentID: "",
      date: new Date(),
      customerID: "",
      staffID: "",
      discount: "",
      discountAmount: "",
      exchange: "",
      grandTotal: "",
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

  const onSubmit = (data) => console.log(data);
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
    // const newRow = {
    //     id: uuidv4(),
    //     itemId: "",
    //     itemName: "",
    //     discount: "",
    //     tax: "",
    //     quantity: "",
    //     rate: "",
    //     value: "",
    // };
    // setRows((prevRows) => [...prevRows, newRow]);
  };

  const removeRow = (index) => {
    remove(index);
    // setRows((prevRows) => prevRows.filter((row) => row.id !== id));
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

  return {
    control,
    fields,
    options,
    addRow,
    onSubmit,
    navigate,
    removeRow,
    handleSubmit,
    calculateTotal,
    reset,
  };
};

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as XLSX from "xlsx";
import moment from 'moment';

import { listPayload, showToast, randomItem, shuffle } from "../../../utils/helper";
import SingleBillPrintContent from "../../../components/SingleBillPrintContent";

const UseSingleBranch = () => {
 
  const [fileJsonData, setFileJsonData] = useState([]);
  
  const {
      control,
      watch,
      getValues,
      handleSubmit,
  } = useForm({
      defaultValues: {
          titleName: "",
          hsn: "",
          gstNo: "",
      },
      mode: "onChange"
  });

  const handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
  
      const json = XLSX.utils.sheet_to_json(worksheet);
      const listBillData = json.map((bill) => {
        return {
          address: bill['Address'],
          date: bill['Invoice Date'],
          billNo: bill['Invoice No.'],
          isShowGst: true,
          cgst: bill['CGST'],
          sgst: bill['SGST'],
          cgstPercentage: bill['Tax Rate'] && typeof bill['Tax Rate'] === 'number' ? bill['Tax Rate'] / 2 : parseFloat(bill['Tax Rate']) / 2,
          sgstPercentage: bill['Tax Rate'] && typeof bill['Tax Rate'] === 'number' ? bill['Tax Rate'] / 2 : parseFloat(bill['Tax Rate']) / 2,
          item: bill['Service'],
          quantity: 1,
          total: bill['Taxable Value'],
          subTotal: bill['Taxable Value'],
          grandTotal: bill['Total Invoice'],
          customer: "Cash Customer",
          paymentMode: bill['Payment'],
          phone1: bill['Phone Number']
        }
      });
      if (listBillData.length > 0) {
        setFileJsonData(listBillData);
      } else {
        setFileJsonData([]);
      }
    }
  
    reader.readAsBinaryString(file);
  }

  const onSubmit = (data) => {
    try {
      if (fileJsonData.length === 0) {
        showToast("Please Upload File", false);
        return;
      }
      const finalBill = fileJsonData.map((file) => {
        return ({
          ...file,
          title: data.titleName,
          hsn: data.hsn,
          gstNo: data.gstNo
        });
      });
      if(finalBill.length > 0) {
        const printWindow = window.open("", "_blank", "popup=yes,menubar=no,toolbap=no");
        if (printWindow && printWindow.document) {
          const finalHTML = `
            <html>
              <head>
                <title>Bills</title>

                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">

                <style>
                  *{
                    font-family: 'Poppins', sans-serif;
                    font-weight: bold;
                  }
                  @media print {
                    @page {
                      size: 150mm
                    }
                  }
                  body {
                    user-select: none;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    -o-user-select: none;
                  }
                </style>
              </head>
            <body>
          `;
          let billsHtml = "";
          finalBill
          // .sort((a, b) => {
          //   const numA = parseInt(a.billNo.split("-").pop(), 10);
          //   const numB = parseInt(b.billNo.split("-").pop(), 10);
          //   return numA - numB;
          // })
          .forEach((bill) => {
            billsHtml += `
            ${SingleBillPrintContent(bill)}
            `
          })
          const finalDoc = finalHTML + billsHtml + `</body></html>`
          printWindow.document.write(finalDoc);
          // printWindow.document.write(BillPrintContent(billData[0], billData[0].branchData, false));
          printWindow.document.close();
          printWindow.onload = () => {
            printWindow.print();
            printWindow.close();
          };
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  return {
    control,
    onSubmit,
    handleFile,
    handleSubmit,
  }
}

export default UseSingleBranch;
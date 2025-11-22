import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';

import { fetchDashboardDetails } from "../../../service/home";
import { searchViaDashboard } from "../../../service/bill";
import { getUserList } from "../../../service/users";
import { startLoading, stopLoading } from "../../../redux/loader";
import { listPayload, showToast } from "../../../utils/helper";
import BillPrintContent from "../../../components/BillPrintContent";
import * as XLSX from "xlsx";
// import { useSelector } from "react-redux";

const currentDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

export const useHome = () => {
  const dispatch = useDispatch();

  const [details, setDetails] = useState();
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [branch, setBranch] = useState([]);
  const [billList, setBillList] = useState([]);
  const user = useSelector((state) => state.loggedInUser);
  const [jsonData, setJsonData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const json = XLSX.utils.sheet_to_json(worksheet);
      setJsonData(json);
      const billData = json.map((bill) => {
        return {
          billNo: bill['Bill No'],
          date: bill['Date'],
          customer: bill['Customer Name'],
          isShowGst: true,
          gstNo: bill['GST NO'],
          cgst: bill['CGST'],
          sgst: bill['SGST'],
          cgstPercentage: bill['CGST Percentage'],
          sgstPercentage: bill['SGST Percentage'],
          tableData: [{
            billNo: bill['Bill No'],
            item: bill['Service/Membership'],
            quantity: 1,
            total: bill['Amount'],
            subTotal: bill ['Amount'],
            cgst: bill['CGST'],
            sgst: bill['SGST'],
            grandTotal: bill['Grand Total']
          }],
          branchData: {
            title: bill['Company Name'],
            address: bill['Address'],
            phone1: bill['Branch Phone Number'],
          }
        }
      });
      if(billData.length > 0) {
        const printWindow = window.open("", "_blank", "popup=yes,menubar=no,toolbap=no");
        if(printWindow && printWindow.document) {
          const finalHTML = `
    <html>
      <head>
        <title>Bills</title>

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">

        <style>
          * {
            font-family: 'Poppins', sans-serif;
            font-weight: bold;
          }

          body {
            margin: 0;
            padding: 10px;
          }

          .bill-container {
            width: 95%;
            margin: 0 auto 30px auto;
            padding: 10px;
          }
            @media print {
              body {
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-auto-rows: auto;
                row-gap: 10px;
                column-gap: 10px;
                padding: 10px;
              }
              .bill-container {
                page-break-inside: avoid;
                break-inside: avoid;
              }
            }
        </style>
      </head>

      <body>
  `;
          let billsHtml = "";
          billData.forEach((bill) => {
            billsHtml += `
            <div class="bill-container">
            ${BillPrintContent(bill, bill.branchData, false)}
            </div>`
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
        e.target.value = null;
      }
    };

    reader.readAsBinaryString(file);
  };

  // const loggedInUser = useSelector((state) => state.loggedInUser);

  const isAdmin = useMemo(() => {
    return user && user.px_role && user.px_role.name && ['super admin', 'admin'].includes(user.px_role.name.toLowerCase())
  }, [user]);

  const handleDateChange = (value) => {
    setDateRange(value);
  };

  const handleBranchChange = (newValue) => {
    setBranch(newValue);
  };

  const fetchDashboardData = async () => {
    try {
      const params = { currentDate: currentDate() };
      const {success, message, data} = await fetchDashboardDetails(params);
      if(success) {
        setDetails({
          counts: {
            customerCount: data.counts.customerCount,
            staffCount: data.counts.staffCount,
            serviceCount: data.counts.serviceCount,
            billCount: data.counts.billCount,
          }
        });
      } else {
        showToast(message, false);
      }
    } catch (error) {
      showToast(error?.message, false);
    }
  };

  const fetchBranch = async () => {
    try {
      const body = listPayload(0, {}, 1000);
      const response = await getUserList(body);
      if (response?.statusCode === 200) {
        const payload = response?.data?.rows;
        const branchOption = payload.filter(item => item.roleID !== 1).map((row) => ({
          value: row.id,
          label: row.branchName,
        }));
        setBranchOptions([{value: null, label: 'All'}].concat(branchOption));
      } else if (response?.statusCode === 404) {
        const payload = [];
        setBranchOptions(payload);
      }
    } catch (error) {
      showToast(error?.message, false);
    }
  };

  const fetchDailyReport = async () => {
    try {
      dispatch(startLoading());
      const body = {
        where: {
          searchText: '',
          isActive: true,
          isDeleted: false,
          userID: branch,
          startDate: moment(dateRange[0]).format('yyyy-MM-DD'), //formatDate(dateRange[0]),
          endDate: moment(dateRange[1]).format('yyyy-MM-DD') //formatDate(dateRange[1]),
        }
      };
      const response = await searchViaDashboard(body);
      if(response?.statusCode === 200) {
        setBillList(response.data)
      } else {
        showToast(response?.message);
      }
    } catch(err) {
      showToast(err?.message, false);
    } finally {
      dispatch(stopLoading());
    }
  }

  useEffect(() => {
    fetchDashboardData();
    fetchBranch();
  }, []);

  // useEffect(() => {
  //   if (loggedInUser && loggedInUser?.id) {
  //     async function fetchCommonindexDBData() {
  //       let whereCondition = {
  //         isActive: true,
  //       };
  //       if (loggedInUser?.px_role?.name?.toLowerCase() !== "admin") {
  //         whereCondition = {
  //           ...whereCondition,
  //           createdBy: loggedInUser.id,
  //         };
  //       }
  //       const customeStaffbody = listPayload(0, whereCondition, 1000);
  //       const servicePaymentbody = listPayload(0, { isActive: true }, 1000);
  //       const [
  //         customerRepsonse,
  //         staffResponse,
  //         serviceResponse,
  //         paymentResponse,
  //       ] = await Promise.all([
  //         getCustomerList(customeStaffbody),
  //         getStaffList(customeStaffbody),
  //         getServiceList(servicePaymentbody),
  //         getPaymentTypeList(servicePaymentbody),
  //       ]);
  //       if (customerRepsonse?.statusCode === 200) {
  //         const payload = customerRepsonse?.data?.rows?.map((row) => ({
  //           ...row,
  //           flag: 0,
  //         }));
  //         await addData(Stores.Customer, payload, "bulk");
  //       } else if (customerRepsonse?.statusCode === 404) {
  //         const payload = [];
  //         await addData(Stores.Customer, payload, "bulk");
  //       }
  //       if (staffResponse?.statusCode === 200) {
  //         const payload = staffResponse?.data?.rows;
  //         await addData(Stores.Staff, payload, "bulk");
  //       } else if (staffResponse?.statusCode === 404) {
  //         const payload = [];
  //         await addData(Stores.Staff, payload, "bulk");
  //       }
  //       if (serviceResponse?.statusCode === 200) {
  //         const payload = serviceResponse?.data?.rows;
  //         await addData(Stores.Service, payload, "bulk");
  //       } else if (serviceResponse?.statusCode === 404) {
  //         const payload = [];
  //         await addData(Stores.Service, payload, "bulk");
  //       }
  //       if (paymentResponse?.statusCode === 200) {
  //         const payload = paymentResponse?.data?.rows;
  //         await addData(Stores.Payment, payload, "bulk");
  //       } else if (paymentResponse?.statusCode === 404) {
  //         const payload = [];
  //         await addData(Stores.Payment, payload, "bulk");
  //       }
  //     }
  //     fetchCommonindexDBData();
  //   }
  // }, [loggedInUser]);

  return {
    isAdmin,
    billList,
    details,
    dateRange,
    branchOptions,
    handleFileUpload,
    fetchDailyReport,
    handleDateChange,
    handleBranchChange
  };
};

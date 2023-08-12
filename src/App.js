import React, { useLayoutEffect } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
// import routes from "./routes";
import { ToastContainer } from "react-toastify";
import Loader from "./components/Loader";
import { checkIsAuthenticated, getAuthToken } from "./utils/helper";

// css imports
import "./assets/styles/global.scss";
import "./assets/styles/sidebar.scss";
import "./assets/styles/header.scss";
import "./assets/styles/login.scss";
import "./assets/styles/customer.scss";
import "./assets/styles/home.scss";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import LayoutProvider from "./layout";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Customer from "./pages/Customer";
import AddCustomer from "./pages/Customer/AddCustomer";
import Staff from "./pages/Staff";
import Role from "./pages/Role";
import AddEditRole from "./pages/Role/addEditRole";
import Module from "./pages/Module";
import AddEditModule from "./pages/Module/addEditModule";
import AddEditStaff from "./pages/Staff/AddEditStaff";
import ServiceCategory from "./pages/ServiceCategory";
import AddEditServiceCategory from "./pages/ServiceCategory/AddEditServiceCategory";
import Service from "./pages/Service";
import AddEditService from "./pages/Service/AddEditService";
import PaymentType from "./pages/PaymentType";
import AddEditPaymentType from "./pages/PaymentType/AddEditPaymentType";
import City from "./pages/City";
import AddEditCity from "./pages/City/AddEditCity";
import State from "./pages/State";
import AddEditStates from "./pages/State/AddEditStates";
import AddEditBill from "./pages/Bill/AddEditBill";
import User from "./pages/User";
import AddEditUser from "./pages/User/AddEditUser";
import Rights from "./pages/Rights";
import Bill from "./pages/Bill";
import Report from "./pages/Report";
import NotFound from "./components/NotFound";
import NoConnection from "./components/NoConnection";
import useNoInternet from "./hook/useNoInternet";
import { initDB } from "./utils/db";
// import { Stores, deleteAllData, getStoreData,  } from "./utils/db";
// import { createBulkBill } from "./service/bill";
// import SyncModal from "./components/SyncModal";

const token = getAuthToken();

const App = () => {
  const isOnline = useNoInternet();
  // const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  // const [billCount, setBillCount] = useState(0);

  const handleInitDB = async () => {
    const status = await initDB();
    console.log("rk", status);
    // setIsDBReady(status);
  };

  useLayoutEffect(() => {
    handleInitDB();
  }, []);

  // const handleBeforeUnload = async (e) => {
  //   e.preventDefault();
  //   console.log("Leave");
  //   e.returnValue = "";

  //   try {
  //     const billData = await getStoreData(Stores.Bills);
  //     if (billData.statusCode === 200) {
  //       console.log("billData", billData);
  //       if (billData.data.length) {
  //         setBillCount(billData.data.length);
  //         setIsSyncModalOpen(true);

  //         const bulkBillPayload = billData.data.map((row) => {
  //           return {
  //             cardNo: row.cardNo,
  //             createdAt: row.createdAt,
  //             createdBy: row.createdBy,
  //             customerID: row.customerID,
  //             detail: row.detail.map((item) => ({
  //               discount: item.discount,
  //               quantity: item.quantity,
  //               rate: item.rate,
  //               serviceID: item.serviceID,
  //               total: item.total,
  //             })),
  //             grandTotal: row.grandTotal.toString(),
  //             paymentID: row.paymentID,
  //             phoneNumber: row.phoneNumber.toString(),
  //             roomNo: +row.roomNo,
  //             staffID: row.staffID,
  //             userID: row.userID,
  //           };
  //         });
  //         console.log(bulkBillPayload);
  //         const response = await createBulkBill(bulkBillPayload);
  //         console.log(response);
  //         if (response.statusCode === 200) {
  //           const deleteAll = await deleteAllData(Stores.Bills);
  //           if (deleteAll.statusCode === 200) {
  //             showToast(response.message, true);
  //             setIsSyncModalOpen(false);
  //             window.removeEventListener("beforeunload", handleBeforeUnload);
  //             window.close();
  //           }
  //         } else {
  //           showToast(response.messageCode, false);
  //         }
  //       } else {
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //     setIsSyncModalOpen(false);
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);

  const routes2 = createBrowserRouter([
    {
      path: "/",
      element: isOnline ? <LayoutProvider /> : null,
      errorElement: <NotFound />,
      loader: checkIsAuthenticated,
      children: [
        { index: true, element: isOnline ? <Home /> : <NoConnection /> },
        {
          path: "customer",
          element: (
            <ProtectedRoute
              path="customer"
              Component={isOnline ? <Customer /> : <NoConnection />}
            />
          ),
        },
        {
          path: "add-customer",
          element: (
            <ProtectedRoute
              path="add-customer"
              Component={
                isOnline ? <AddCustomer tag="add" /> : <NoConnection />
              }
            />
          ),
        },
        {
          path: "edit-customer/:id",
          element: (
            <ProtectedRoute
              path="edit-customer/:id"
              Component={
                isOnline ? <AddCustomer tag="edit" /> : <NoConnection />
              }
            />
          ),
        },

        {
          path: "staff",
          element: (
            <ProtectedRoute
              path="staff"
              Component={isOnline ? <Staff /> : <NoConnection />}
            />
          ),
        },
        {
          path: "add-staff",
          element: (
            <ProtectedRoute
              path="add-staff"
              Component={
                isOnline ? <AddEditStaff tag="add" /> : <NoConnection />
              }
            />
          ),
        },
        {
          path: "edit-staff/:id",
          element: (
            <ProtectedRoute
              path="edit-staff/:id"
              Component={
                isOnline ? <AddEditStaff tag="edit" /> : <NoConnection />
              }
            />
          ),
        },

        {
          path: "service-category",
          element: (
            <ProtectedRoute
              path="service-category"
              Component={isOnline ? <ServiceCategory /> : <NoConnection />}
            />
          ),
        },
        {
          path: "add-service-category",
          element: (
            <ProtectedRoute
              path="add-service-category"
              Component={
                isOnline ? (
                  <AddEditServiceCategory tag="add" />
                ) : (
                  <NoConnection />
                )
              }
            />
          ),
        },
        {
          path: "edit-service-category/:id",
          element: (
            <ProtectedRoute
              path="edit-service-category/:id"
              Component={
                isOnline ? (
                  <AddEditServiceCategory tag="edit" />
                ) : (
                  <NoConnection />
                )
              }
            />
          ),
        },

        {
          path: "service",
          element: (
            <ProtectedRoute
              path="service"
              Component={isOnline ? <Service /> : <NoConnection />}
            />
          ),
        },
        {
          path: "add-service",
          element: (
            <ProtectedRoute
              path="add-service"
              Component={
                isOnline ? <AddEditService tag="add" /> : <NoConnection />
              }
            />
          ),
        },
        {
          path: "edit-service/:id",
          element: (
            <ProtectedRoute
              path="edit-service/:id"
              Component={
                isOnline ? <AddEditService tag="edit" /> : <NoConnection />
              }
            />
          ),
        },

        {
          path: "payment-type",
          element: (
            <ProtectedRoute
              path="payment-type"
              Component={isOnline ? <PaymentType /> : <NoConnection />}
            />
          ),
        },
        {
          path: "add-payment-type",
          element: (
            <ProtectedRoute
              path="add-payment-type"
              Component={
                isOnline ? <AddEditPaymentType tag="add" /> : <NoConnection />
              }
            />
          ),
        },
        {
          path: "edit-payment-type/:id",
          element: (
            <ProtectedRoute
              path="edit-payment-type/:id"
              Component={
                isOnline ? <AddEditPaymentType tag="edit" /> : <NoConnection />
              }
            />
          ),
        },

        {
          path: "city",
          element: (
            <ProtectedRoute
              path="city"
              Component={isOnline ? <City /> : <NoConnection />}
            />
          ),
        },
        {
          path: "add-city",
          element: (
            <ProtectedRoute
              path="add-city"
              Component={
                isOnline ? <AddEditCity tag="add" /> : <NoConnection />
              }
            />
          ),
        },
        {
          path: "edit-city/:id",
          element: (
            <ProtectedRoute
              path="edit-city/:id"
              Component={
                isOnline ? <AddEditCity tag="edit" /> : <NoConnection />
              }
            />
          ),
        },

        {
          path: "states",
          element: (
            <ProtectedRoute
              path="states"
              Component={isOnline ? <State /> : <NoConnection />}
            />
          ),
        },
        {
          path: "add-states",
          element: (
            <ProtectedRoute
              path="add-states"
              Component={
                isOnline ? <AddEditStates tag="add" /> : <NoConnection />
              }
            />
          ),
        },
        {
          path: "edit-states/:id",
          element: (
            <ProtectedRoute
              path="edit-states/:id"
              Component={
                isOnline ? <AddEditStates tag="edit" /> : <NoConnection />
              }
            />
          ),
        },

        {
          path: "user",
          element: (
            <ProtectedRoute
              path="user"
              Component={isOnline ? <User /> : <NoConnection />}
            />
          ),
        },
        {
          path: "add-user",
          element: (
            <ProtectedRoute
              path="add-user"
              Component={
                isOnline ? <AddEditUser tag="add" /> : <NoConnection />
              }
            />
          ),
        },
        {
          path: "edit-user/:id",
          element: (
            <ProtectedRoute
              path="edit-user/:id"
              Component={
                isOnline ? <AddEditUser tag="edit" /> : <NoConnection />
              }
            />
          ),
        },

        {
          path: "bill",
          element: (
            <ProtectedRoute path="bill" Component={<Bill tag="add" />} />
          ),
        },
        {
          path: "create-bill",
          element: (
            <ProtectedRoute
              path="create-bill"
              Component={<AddEditBill tag="add" />}
            />
          ),
        },
        {
          path: "edit-bill/:id",
          element: (
            <ProtectedRoute
              path="edit-bill/:id"
              Component={<AddEditBill tag="edit" />}
            />
          ),
        },

        {
          path: "role",
          element: (
            <ProtectedRoute
              path="role"
              Component={isOnline ? <Role /> : <NoConnection />}
            />
          ),
        },
        {
          path: "add-role",
          element: (
            <ProtectedRoute
              path="add-role"
              Component={
                isOnline ? <AddEditRole tag="add" /> : <NoConnection />
              }
            />
          ),
        },
        {
          path: "edit-role/:id",
          element: (
            <ProtectedRoute
              path="edit-role/:id"
              Component={
                isOnline ? <AddEditRole tag="edit" /> : <NoConnection />
              }
            />
          ),
        },
        {
          path: "rights",
          element: (
            <ProtectedRoute
              path="rights"
              Component={isOnline ? <Rights /> : <NoConnection />}
            />
          ),
        },
        {
          path: "module",
          element: (
            <ProtectedRoute
              path="module"
              Component={isOnline ? <Module /> : <NoConnection />}
            />
          ),
        },
        {
          path: "add-module",
          element: (
            <ProtectedRoute
              path="add-module"
              Component={
                isOnline ? <AddEditModule tag="add" /> : <NoConnection />
              }
            />
          ),
        },
        {
          path: "edit-module/:id",
          element: (
            <ProtectedRoute
              path="edit-module/:id"
              Component={
                isOnline ? <AddEditModule tag="edit" /> : <NoConnection />
              }
            />
          ),
        },
        {
          path: "report",
          element: (
            <ProtectedRoute
              path="report"
              Component={isOnline ? <Report /> : <NoConnection />}
            />
          ),
        },
      ],
    },
    { path: "login", element: !token ? <Login /> : <Navigate to="/" /> },
    { path: "*", element: <NotFound /> },
  ]);

  return (
    <>
      <ToastContainer />
      <Loader />
      {/* {isSyncModalOpen && (
        <SyncModal isSyncModalOpen={isSyncModalOpen} count={billCount} />
      )} */}
      <RouterProvider router={routes2} />
    </>
  );
};

export default App;

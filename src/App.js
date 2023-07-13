import React, { useCallback, useLayoutEffect } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
// import routes from "./routes";
import { ToastContainer } from "react-toastify";
import Loader from "./components/Loader";
import { checkIsAuthenticated, getAuthToken, showToast } from "./utils/helper";
import { useDispatch } from "react-redux";
import { fetchLoggedInUserData } from "./service/loggedInUser";
import { loggedInUserAction } from "./redux/loggedInUser";

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
import Module from "./pages/Module";
import AddEditModule from "./pages/Module/addEditModule";
import AddEditRole from "./pages/Role/addEditRole";
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

const token = getAuthToken();

const App = () => {
  const routes2 = createBrowserRouter([
    {
      path: "/",
      element: <LayoutProvider />,
      loader: checkIsAuthenticated,
      children: [
        { index: true, element: <Home /> },

        // <ProtectedRoute path="customer" Component="Customer" />,
        {
          path: "customer",
          element: <ProtectedRoute path="customer" Component={<Customer />} />,
        },
        {
          path: "add-customer",
          element: (
            <ProtectedRoute
              path="customer"
              Component={<AddCustomer tag="add" />}
            />
          ),
        },
        {
          path: "edit-customer/:id",
          element: (
            <ProtectedRoute
              path="customer"
              Component={<AddCustomer tag="edit" />}
            />
          ),
        },

        {
          path: "staff",
          element: <ProtectedRoute path="customer" Component={<Staff />} />,
        },
        {
          path: "add-staff",
          element: (
            <ProtectedRoute
              path="staff"
              Component={<AddEditStaff tag="add" />}
            />
          ),
        },
        {
          path: "edit-staff/:id",
          element: (
            <ProtectedRoute
              path="staff"
              Component={<AddEditStaff tag="edit" />}
            />
          ),
        },

        {
          path: "service-category",
          element: (
            <ProtectedRoute
              path="service-category"
              Component={<ServiceCategory />}
            />
          ),
        },
        {
          path: "add-service-category",
          element: (
            <ProtectedRoute
              path="service-category"
              Component={<AddEditServiceCategory tag="add" />}
            />
          ),
        },
        {
          path: "edit-service-category/:id",
          element: (
            <ProtectedRoute
              path="service-category"
              Component={<AddEditServiceCategory tag="edit" />}
            />
          ),
        },

        {
          path: "service",
          element: <ProtectedRoute path="service" Component={<Service />} />,
        },
        {
          path: "add-service",
          element: (
            <ProtectedRoute
              path="service"
              Component={<AddEditService tag="add" />}
            />
          ),
        },
        {
          path: "edit-service/:id",
          element: (
            <ProtectedRoute
              path="service"
              Component={<AddEditService tag="edit" />}
            />
          ),
        },

        {
          path: "payment-type",
          element: (
            <ProtectedRoute path="payment-type" Component={<PaymentType />} />
          ),
        },
        {
          path: "add-payment-type",
          element: (
            <ProtectedRoute
              path="payment-type"
              Component={<AddEditPaymentType tag="add" />}
            />
          ),
        },
        {
          path: "edit-payment-type/:id",
          element: (
            <ProtectedRoute
              path="payment-type"
              Component={<AddEditPaymentType tag="edit" />}
            />
          ),
        },

        {
          path: "city",
          element: <ProtectedRoute path="city" Component={<City />} />,
        },
        {
          path: "add-city",
          element: (
            <ProtectedRoute path="city" Component={<AddEditCity tag="add" />} />
          ),
        },
        {
          path: "edit-city/:id",
          element: (
            <ProtectedRoute
              path="city"
              Component={<AddEditCity tag="edit" />}
            />
          ),
        },

        {
          path: "states",
          element: <ProtectedRoute path="states" Component={<State />} />,
        },
        {
          path: "add-state",
          element: (
            <ProtectedRoute
              path="states"
              Component={<AddEditStates tag="add" />}
            />
          ),
        },
        {
          path: "edit-state/:id",
          element: (
            <ProtectedRoute
              path="states"
              Component={<AddEditStates tag="edit" />}
            />
          ),
        },

        {
          path: "user",
          element: <ProtectedRoute path="user" Component={<User />} />,
        },
        {
          path: "add-user",
          element: (
            <ProtectedRoute path="user" Component={<AddEditUser tag="add" />} />
          ),
        },
        {
          path: "edit-user",
          element: (
            <ProtectedRoute
              path="user"
              Component={<AddEditUser tag="edit" />}
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
          path: "add-bill",
          element: (
            <ProtectedRoute path="bill" Component={<AddEditBill tag="add" />} />
          ),
        },
        {
          path: "edit-bill/:id",
          element: (
            <ProtectedRoute
              path="bill"
              Component={<AddEditBill tag="edit" />}
            />
          ),
        },

        {
          path: "role",
          element: <ProtectedRoute path="role" Component={<Role />} />,
        },
        {
          path: "add-role",
          element: (
            <ProtectedRoute path="role" Component={<AddEditRole tag="add" />} />
          ),
        },
        {
          path: "edit-role/:id",
          element: (
            <ProtectedRoute
              path="role"
              Component={<AddEditRole tag="edit" />}
            />
          ),
        },
        {
          path: "rights",
          element: <ProtectedRoute path="rights" Component={<Rights />} />,
        },
        {
          path: "module",
          element: <ProtectedRoute path="module" Component={<Module />} />,
        },
        {
          path: "add-module",
          element: (
            <ProtectedRoute
              path="add-module"
              Component={<AddEditModule tag="add" />}
            />
          ),
        },
        {
          path: "edit-module/:id",
          element: (
            <ProtectedRoute
              path="edit-module/:id"
              Component={<AddEditModule tag="edit" />}
            />
          ),
        },
      ],
    },
    { path: "login", element: !token ? <Login /> : <Navigate to="/" /> },
  ]);

  return (
    <>
      <ToastContainer />
      <Loader />
      <RouterProvider router={routes2} />
    </>
  );
};

export default App;

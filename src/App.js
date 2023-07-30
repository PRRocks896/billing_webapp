import React from "react";
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
import Report from "./pages/Report";

const token = getAuthToken();

const App = () => {
  const routes2 = createBrowserRouter([
    {
      path: "/",
      element: <LayoutProvider />,
      loader: checkIsAuthenticated,
      children: [
        { index: true, element: <Home /> },
        {
          path: "customer",
          element: <ProtectedRoute path="customer" Component={<Customer />} />,
        },
        {
          path: "add-customer",
          element: (
            <ProtectedRoute
              path="add-customer"
              Component={<AddCustomer tag="add" />}
            />
          ),
        },
        {
          path: "edit-customer/:id",
          element: (
            <ProtectedRoute
              path="edit-customer/:id"
              Component={<AddCustomer tag="edit" />}
            />
          ),
        },

        {
          path: "staff",
          element: <ProtectedRoute path="staff" Component={<Staff />} />,
        },
        {
          path: "add-staff",
          element: (
            <ProtectedRoute
              path="add-staff"
              Component={<AddEditStaff tag="add" />}
            />
          ),
        },
        {
          path: "edit-staff/:id",
          element: (
            <ProtectedRoute
              path="edit-staff/:id"
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
              path="add-service-category"
              Component={<AddEditServiceCategory tag="add" />}
            />
          ),
        },
        {
          path: "edit-service-category/:id",
          element: (
            <ProtectedRoute
              path="edit-service-category/:id"
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
              path="add-service"
              Component={<AddEditService tag="add" />}
            />
          ),
        },
        {
          path: "edit-service/:id",
          element: (
            <ProtectedRoute
              path="edit-service/:id"
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
              path="add-payment-type"
              Component={<AddEditPaymentType tag="add" />}
            />
          ),
        },
        {
          path: "edit-payment-type/:id",
          element: (
            <ProtectedRoute
              path="edit-payment-type/:id"
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
            <ProtectedRoute
              path="add-city"
              Component={<AddEditCity tag="add" />}
            />
          ),
        },
        {
          path: "edit-city/:id",
          element: (
            <ProtectedRoute
              path="edit-city/:id"
              Component={<AddEditCity tag="edit" />}
            />
          ),
        },

        {
          path: "states",
          element: <ProtectedRoute path="states" Component={<State />} />,
        },
        {
          path: "add-states",
          element: (
            <ProtectedRoute
              path="add-states"
              Component={<AddEditStates tag="add" />}
            />
          ),
        },
        {
          path: "edit-states/:id",
          element: (
            <ProtectedRoute
              path="edit-states/:id"
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
            <ProtectedRoute
              path="add-user"
              Component={<AddEditUser tag="add" />}
            />
          ),
        },
        {
          path: "edit-user/:id",
          element: (
            <ProtectedRoute
              path="edit-user/:id"
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
          element: <ProtectedRoute path="role" Component={<Role />} />,
        },
        {
          path: "add-role",
          element: (
            <ProtectedRoute
              path="add-role"
              Component={<AddEditRole tag="add" />}
            />
          ),
        },
        {
          path: "edit-role/:id",
          element: (
            <ProtectedRoute
              path="edit-role/:id"
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
        {
          path: "report",
          element: <ProtectedRoute path="report" Component={<Report />} />,
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

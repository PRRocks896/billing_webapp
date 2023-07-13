import { Navigate, createBrowserRouter } from "react-router-dom";
import LayoutProvider from "./layout/index";
import Home from "./pages/Home";
import Customer from "./pages/Customer";
import AddCustomer from "./pages/Customer/AddCustomer";
import Staff from "./pages/Staff";
import AddEditStaff from "./pages/Staff/AddEditStaff";
import Service from "./pages/Service";
import AddEditService from "./pages/Service/AddEditService";
import PaymentType from "./pages/PaymentType";
import AddEditPaymentType from "./pages/PaymentType/AddEditPaymentType";
import CreateBill from "./pages/Bill/CreateBill";
import User from "./pages/User";
import AddEditUser from "./pages/User/AddEditUser";
import City from "./pages/City";
import State from "./pages/State";
import AddEditStates from "./pages/State/AddEditStates";
import AddEditCity from "./pages/City/AddEditCity";
import ServiceCategory from "./pages/ServiceCategory";
import AddEditServiceCategory from "./pages/ServiceCategory/AddEditServiceCategory";
import Login from "./pages/Login";
import { checkIsAuthenticated, getAuthToken } from "./utils/helper";
import Role from "./pages/Role";
import AddEditRole from "./pages/Role/addEditRole";
import Module from "./pages/Module";
import AddEditModule from "./pages/Module/addEditModule";
import Rights from "./pages/Rights";

const token = getAuthToken();

const routes = createBrowserRouter([
  {
    path: "/",
    element: <LayoutProvider />,
    loader: checkIsAuthenticated,
    children: [
      { index: true, element: <Home /> },

      { path: "customer", element: <Customer /> },
      { path: "add-customer", element: <AddCustomer tag="add" /> },
      { path: "edit-customer/:id", element: <AddCustomer tag="edit" /> },

      { path: "staff", element: <Staff /> },
      { path: "add-staff", element: <AddEditStaff tag="add" /> },
      { path: "edit-staff/:id", element: <AddEditStaff tag="edit" /> },

      { path: "service-category", element: <ServiceCategory /> },
      {
        path: "add-service-category",
        element: <AddEditServiceCategory tag="add" />,
      },
      {
        path: "edit-service-category/:id",
        element: <AddEditServiceCategory tag="edit" />,
      },

      { path: "service", element: <Service /> },
      { path: "add-service", element: <AddEditService tag="add" /> },
      { path: "edit-service/:id", element: <AddEditService tag="edit" /> },

      { path: "payment-type", element: <PaymentType /> },
      { path: "add-payment-type", element: <AddEditPaymentType tag="add" /> },
      {
        path: "edit-payment-type/:id",
        element: <AddEditPaymentType tag="edit" />,
      },

      { path: "cities", element: <City /> },
      { path: "add-city", element: <AddEditCity tag="add" /> },
      { path: "edit-city/:id", element: <AddEditCity tag="edit" /> },

      { path: "states", element: <State /> },
      { path: "add-state", element: <AddEditStates tag="add" /> },
      { path: "edit-state/:id", element: <AddEditStates tag="edit" /> },

      { path: "user", element: <User /> },
      { path: "add-user", element: <AddEditUser tag="add" /> },
      { path: "edit-user", element: <AddEditUser tag="edit" /> },

      { path: "bill", element: <CreateBill /> },

      { path: "role", element: <Role /> },
      { path: "add-role", element: <AddEditRole tag="add" /> },
      { path: "edit-role/:id", element: <AddEditRole tag="edit" /> },

      { path: "module", element: <Module /> },
      { path: "add-module", element: <AddEditModule tag="add" /> },
      { path: "edit-module/:id", element: <AddEditModule tag="edit" /> },

      { path: "rights", element: <Rights /> },
    ],
  },
  { path: "login", element: !token ? <Login /> : <Navigate to="/" /> },
]);

export default routes;

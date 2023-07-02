import { createBrowserRouter } from "react-router-dom";

import LayoutProvider from "./layout/index";
import Home from "./pages/Home";
import Customer from "./pages/Customer";
import AddCustomer from "./pages/Customer/AddCustomer";
import ServiceCategory from "./pages/ServiceCategory";
import AddServiceCategory from "./pages/ServiceCategory/AddServiceCategory";
import Staff from "./pages/Staff";
import AddStaff from "./pages/Staff/AddStaff";
import Service from "./pages/Service";
import AddService from "./pages/Service/AddService";
import PaymentType from "./pages/PaymentType";
import AddPaymentType from "./pages/PaymentType/AddPaymentType";
import CreateBill from "./pages/Bill/CreateBill";
import User from "./pages/User";
import AddUser from "./pages/User/AddUser";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <LayoutProvider />,
    children: [
      { index: true, element: <Home /> },

      { path: "customer", element: <Customer /> },
      { path: "add-customer", element: <AddCustomer tag="add" /> },
      { path: "edit-customer", element: <AddCustomer tag="edit" /> },

      { path: "staff", element: <Staff /> },
      { path: "add-staff", element: <AddStaff tag="add" /> },
      { path: "edit-staff", element: <AddStaff tag="edit" /> },

      { path: "service-category", element: <ServiceCategory /> },
      {
        path: "add-service-category",
        element: <AddServiceCategory tag="add" />,
      },
      {
        path: "edit-service-category",
        element: <AddServiceCategory tag="edit" />,
      },

      { path: "service", element: <Service /> },
      { path: "add-service", element: <AddService tag="add" /> },
      { path: "edit-service", element: <AddService tag="edit" /> },

      { path: "payment-type", element: <PaymentType /> },
      { path: "add-payment-type", element: <AddPaymentType tag="add" /> },
      { path: "edit-payment-type", element: <AddPaymentType tag="edit" /> },

      { path: "user", element: <User /> },
      { path: "add-user", element: <AddUser tag="add" /> },
      { path: "edit-user", element: <AddUser tag="edit" /> },
      { path: "create-bill", element: <CreateBill /> },
    ],
  }
]);

export default routes;

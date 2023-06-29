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
      { path: "addCustomer", element: <AddCustomer /> },
      { path: "staff", element: <Staff /> },
      { path: "add-staff", element: <AddStaff /> },
      { path: "service-category", element: <ServiceCategory /> },
      { path: "add-service-category", element: <AddServiceCategory /> },
      { path: "service", element: <Service /> },
      { path: "add-service", element: <AddService /> },
      { path: "payment-type", element: <PaymentType /> },
      { path: "add-payment-type", element: <AddPaymentType /> },
      { path: "user", element: <User /> },
      { path: "add-user", element: <AddUser /> },
    ],
  },
  { path: "create-bill", element: <CreateBill /> },
]);

export default routes;

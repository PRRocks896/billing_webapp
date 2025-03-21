import React, { useMemo } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { useSelector } from "react-redux";
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
import MembershipPlan from "./pages/MembershipPlan";
import AddEditMembershipPlan from "./pages/MembershipPlan/addEditMembershipPlan";
import Membership from "./pages/Membership";
import AddEditMembership from "./pages/Membership/addEditMembership";
import AddMembership from "./pages/Membership/addMembership";
import AddEditMembershipRedeem from "./pages/MembershipRedeem/addEditMembershipRedeem";
import RenewPlan from "./pages/RenewPlan";
import DailyReport from "./pages/DailyReport";
import AddEditDailyReport from './pages/DailyReport/addEditDailyReport';
import EmployeeType from "./pages/EmployeeType";
import AddEditEmployeeType from "./pages/EmployeeType/addEditEmployeeType";
import Salary from './pages/Salary';
import AddEditSalary from './pages/Salary/addEditSalary';
import LastDailyReportPending from './components/LastDailyReportPending';
import ViewStaffDocument from './pages/Staff/viewDocument';
import Company from "./pages/Company";
import AddEditCompany from "./pages/Company/AddEditCompany";
import Room from "./pages/Room";
import AddEditRoom from "./pages/Room/AddEditRoom";
import Coupon from "./pages/Coupon";
import AddEditCoupon from "./pages/Coupon/addEditCoupon";
import SEO from "./pages/Seo";
import AddEditSeo from "./pages/Seo/addEditSeo";
import Blog from "./pages/Blog";
import AddEditBlog from "./pages/Blog/addEditBlog";
import WebsiteBooking from "./pages/WebsiteBooking";
import AddEditWebsiteBooking from "./pages/WebsiteBooking/addEditWebsiteBooking";
import NewsLetter from "./pages/NewsLetter";

const token = getAuthToken();

const App = () => {
  const { isOnline, pathname } = useNoInternet();
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const isPendingDailyReport = useMemo(() => {
    if(loggedInUser && loggedInUser.hasOwnProperty('isLastDailyReportAdded')) {
      return loggedInUser.isLastDailyReportAdded;
    }
    return false;
  }, [loggedInUser]);

  const routes2 = createBrowserRouter([
    {
      path: "/",
      element: isOnline ?
        <LayoutProvider />
      : pathname.includes("bill") ? (
        <LayoutProvider />
      ) : null,
      errorElement: <NotFound />,
      loader: checkIsAuthenticated,
      children: [
        { index: true, element: isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <Home /> : <NoConnection /> },
        {
          path: 'newsletter',
          element: (
            <ProtectedRoute
              path="newsletter"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <NewsLetter /> : <NoConnection/>}
            />
          )
        },
        {
          path: 'website-booking',
          element: (
            <ProtectedRoute
              path="website-booking"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <WebsiteBooking /> : <NoConnection/>}
            />
          )
        },
        {
          path: 'add-website-booking',
          element: (
            <ProtectedRoute
              path="add-website-booking"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditWebsiteBooking tag="add" /> : <NoConnection/>}
            />
          )
        },
        {
          path: 'edit-website-booking/:id',
          element: (
            <ProtectedRoute
              path="edit-website-booking/:id"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditWebsiteBooking tag="edit" /> : <NoConnection/>}
            />
          )
        },
        {
          path: 'blog',
          element: (
            <ProtectedRoute
              path="blog"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <Blog /> : <NoConnection/>}
            />
          )
        },
        {
          path: 'add-blog',
          element: (
            <ProtectedRoute
              path="add-blog"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditBlog tag="add" /> : <NoConnection/>}
            />
          )
        },
        {
          path: 'edit-blog/:id',
          element: (
            <ProtectedRoute
              path="edit-blog/:id"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditBlog tag="edit" /> : <NoConnection/>}
            />
          )
        },
        {
          path: 'coupon',
          element: (
            <ProtectedRoute
              path="coupon"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <Coupon /> : <NoConnection/>}
            />
          )
        },
        {
          path: 'add-coupon',
          element: (
            <ProtectedRoute
              path="add-coupon"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditCoupon tag="add" /> : <NoConnection/>}
            />
          )
        },
        {
          path: 'edit-coupon/:id',
          element: (
            <ProtectedRoute
              path="edit-coupon/:id"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditCoupon tag="edit" /> : <NoConnection/>}
            />
          )
        },
        {
          path: 'seo',
          element: (
            <ProtectedRoute
              path="seo"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <SEO /> : <NoConnection/>}
            />
          )
        },
        {
          path: 'add-seo',
          element: (
            <ProtectedRoute
              path="add-seo"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditSeo tag="add" /> : <NoConnection/>}
            />
          )
        },
        {
          path: 'edit-seo/:id',
          element: (
            <ProtectedRoute
              path="edit-seo/:id"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditSeo tag="edit" /> : <NoConnection/>}
            />
          )
        },
        {
          path: 'renew-plan/:membershipID/:customerID',
          element: (
            <ProtectedRoute
              path="renew-plan/:membershipID/:customerID"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <RenewPlan /> : <NoConnection/>}
            />
          )
        },
        {
          path: 'room',
          element: (
            <ProtectedRoute
              path="room"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <Room /> : <NoConnection/>}
            />
          )
        },
        {
          path: 'add-room',
          element: (
            <ProtectedRoute
              path="add-room"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditRoom tag="add" /> : <NoConnection/>}
            />
          )
        },
        {
          path: 'edit-room/:id',
          element: (
            <ProtectedRoute
              path="edit-room/:id"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditRoom tag="edit" /> : <NoConnection/>}
            />
          )
        },
        {
          path: 'company',
          element: (
            <ProtectedRoute
              path="company"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <Company/> : <NoConnection/>}
            />
          )
        },
        {
          path: 'add-company',
          element: (
            <ProtectedRoute
              path="add-company"
              Component={isOnline ? <AddEditCompany tag="add" /> : <NoConnection/>}
            />
          )
        },
        {
          path: 'edit-company/:id',
          element: (
            <ProtectedRoute
              path="edit-company"
              Component={isOnline ? <AddEditCompany tag="edit" /> : <NoConnection/>}
            />
          )
        },
        {
          path: 'membership-redeem',
          element: (
            <ProtectedRoute
              path="membership-redeem"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditMembershipRedeem tag="add" /> : <NoConnection/>}
              // Component={isOnline ? <MemberShipRedeem/> : <NoConnection/>}
            />
          )
        },
        // {
        //   path: 'add-membership-redeem',
        //   element: (
        //     <ProtectedRoute
        //       path="add-membership-redeem"
        //       Component={isOnline ? <AddEditMembershipRedeem tag="add" /> : <NoConnection/>}
        //     />
        //   )
        // },
        // {
        //   path: 'edit-membership-redeem/:id',
        //   element: (
        //     <ProtectedRoute
        //       path="edit-membership-redeem"
        //       Component={isOnline ? <AddEditMembershipRedeem tag="edit" /> : <NoConnection/>}
        //     />
        //   )
        // },
        {
          path: 'membership',
          element: (
            <ProtectedRoute
              path="membership"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <Membership/> : <NoConnection/>}
            />
          )
        },
        {
          path: 'past-membership',
          element: (
            <ProtectedRoute
              path='past-membership'
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddMembership/> : <NoConnection/>}
            />
          )
        },
        {
          path: "add-membership",
          element: (
            <ProtectedRoute
              path="add-membership"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditMembership tag="add" /> : <NoConnection />}
            />
          ),
        },
        {
          path: "edit-membership/:id",
          element: (
            <ProtectedRoute
              path="edit-membership/:id"
              Component={
                isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditMembership tag="edit" /> : <NoConnection />
              }
            />
          ),
        },
        {
          path: 'salary',
          element: (
            <ProtectedRoute
              path="salary"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <Salary/> : <NoConnection/>}
            />
          )
        },
        {
          path: 'add-salary',
          element: (
            <ProtectedRoute
              path="add-salary"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditSalary tag="add"/> : <NoConnection/>}
            />
          )
        },
        {
          path: 'edit-salary/:id',
          element: (
            <ProtectedRoute
              path="edit-salary/:id"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditSalary tag="edit"/> : <NoConnection/>}
            />
          )
        },
        {
          path: 'employee-type',
          element: (
            <ProtectedRoute
              path="employee-type"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <EmployeeType/> : <NoConnection/>}
            />
          )
        },
        {
          path: 'add-employee-type',
          element: (
            <ProtectedRoute
              path="add-employee-type"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditEmployeeType tag="add"/> : <NoConnection/>}
            />
          )
        },
        {
          path: 'edit-employee-type/:id',
          element: (
            <ProtectedRoute
              path="edit-employee-type/:id"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditEmployeeType tag="edit"/> : <NoConnection/>}
            />
          )
        },
        {
          path: 'add-daily-report',
          element: (
            <ProtectedRoute 
              path="add-daily-report" 
              Component={isOnline ? <AddEditDailyReport tag="add"/> : <NoConnection/>}
            />
          )
        },
        {
          path: 'edit-daily-report/:id',
          element: (
            <ProtectedRoute 
              path="edit-daily-report/:id" 
              Component={isOnline ? <AddEditDailyReport tag="edit"/> : <NoConnection/>}
            />
          )
        },
        {
          path: 'daily-report',
          element: (
            <ProtectedRoute 
              path="daily-report" 
              Component={isOnline ? <DailyReport/> : <NoConnection/>}
            />
          )
        },
        {
          path: 'membership-plan',
          element: (
            <ProtectedRoute
              path="membership-plan"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <MembershipPlan/> : <NoConnection/>}
            />
          )
        },
        {
          path: "add-membership-plan",
          element: (
            <ProtectedRoute
              path="add-membership-plan"
              Component={
                isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditMembershipPlan tag="add" /> : <NoConnection />
              }
            />
          ),
        },
        {
          path: "edit-membership-plan/:id",
          element: (
            <ProtectedRoute
              path="edit-membership-plan/:id"
              Component={
                isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditMembershipPlan tag="edit" /> : <NoConnection />
              }
            />
          ),
        },
        {
          path: "customer",
          element: (
            <ProtectedRoute
              path="customer"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <Customer /> : <NoConnection />}
            />
          ),
        },
        {
          path: "add-customer",
          element: (
            <ProtectedRoute
              path="add-customer"
              Component={
                isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddCustomer tag="add" /> : <NoConnection />
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
                isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddCustomer tag="edit" /> : <NoConnection />
              }
            />
          ),
        },

        {
          path: "staff",
          element: (
            <ProtectedRoute
              path="staff"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <Staff /> : <NoConnection />}
            />
          ),
        },
        {
          path: "add-staff",
          element: (
            <ProtectedRoute
              path="add-staff"
              Component={
                isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditStaff tag="add" /> : <NoConnection />
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
                isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditStaff tag="edit" /> : <NoConnection />
              }
            />
          ),
        },
        {
          path: 'view-staff/:id',
          element: (
            <ProtectedRoute
              path="view-staff/:id"
              Component={
                isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <ViewStaffDocument/> : <NoConnection/>
              }
            />
          ),
        },
        {
          path: "service-category",
          element: (
            <ProtectedRoute
              path="service-category"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <ServiceCategory /> : <NoConnection />}
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
                  isPendingDailyReport ? <LastDailyReportPending/> : <AddEditServiceCategory tag="add" />
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
                  isPendingDailyReport ? <LastDailyReportPending/> : <AddEditServiceCategory tag="edit" />
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
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <Service /> : <NoConnection />}
            />
          ),
        },
        {
          path: "add-service",
          element: (
            <ProtectedRoute
              path="add-service"
              Component={
                isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditService tag="add" /> : <NoConnection />
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
                isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditService tag="edit" /> : <NoConnection />
              }
            />
          ),
        },

        {
          path: "payment-type",
          element: (
            <ProtectedRoute
              path="payment-type"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <PaymentType /> : <NoConnection />}
            />
          ),
        },
        {
          path: "add-payment-type",
          element: (
            <ProtectedRoute
              path="add-payment-type"
              Component={
                isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditPaymentType tag="add" /> : <NoConnection />
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
                isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditPaymentType tag="edit" /> : <NoConnection />
              }
            />
          ),
        },

        {
          path: "city",
          element: (
            <ProtectedRoute
              path="city"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <City /> : <NoConnection />}
            />
          ),
        },
        {
          path: "add-city",
          element: (
            <ProtectedRoute
              path="add-city"
              Component={
                isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditCity tag="add" /> : <NoConnection />
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
                isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditCity tag="edit" /> : <NoConnection />
              }
            />
          ),
        },

        {
          path: "state",
          element: (
            <ProtectedRoute
              path="state"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <State /> : <NoConnection />}
            />
          ),
        },
        {
          path: "add-state",
          element: (
            <ProtectedRoute
              path="add-state"
              Component={
                isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditStates tag="add" /> : <NoConnection />
              }
            />
          ),
        },
        {
          path: "edit-state/:id",
          element: (
            <ProtectedRoute
              path="edit-state/:id"
              Component={
                isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditStates tag="edit" /> : <NoConnection />
              }
            />
          ),
        },

        {
          path: "user",
          element: (
            <ProtectedRoute
              path="user"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <User /> : <NoConnection />}
            />
          ),
        },
        {
          path: "add-user",
          element: (
            <ProtectedRoute
              path="add-user"
              Component={
                isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditUser tag="add" /> : <NoConnection />
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
                isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditUser tag="edit" /> : <NoConnection />
              }
            />
          ),
        },

        {
          path: "bill",
          element: (
            <ProtectedRoute 
              path="bill" 
              Component={
                isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <Bill/> : <NoConnection/>
              }
            />
          ),
        },
        {
          path: "create-bill",
          element: (
            <ProtectedRoute
              path="create-bill"
              Component={
                isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditBill tag="add" /> : <NoConnection/>
              }
            />
          ),
        },
        {
          path: "edit-bill/:id",
          element: (
            <ProtectedRoute
              path="edit-bill/:id"
              Component={
                isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditBill tag="edit" /> : <NoConnection/>
              }
            />
          ),
        },

        {
          path: "role",
          element: (
            <ProtectedRoute
              path="role"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <Role /> : <NoConnection />}
            />
          ),
        },
        {
          path: "add-role",
          element: (
            <ProtectedRoute
              path="add-role"
              Component={
                isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditRole tag="add" /> : <NoConnection />
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
                isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditRole tag="edit" /> : <NoConnection />
              }
            />
          ),
        },
        {
          path: "rights",
          element: (
            <ProtectedRoute
              path="rights"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <Rights /> : <NoConnection />}
            />
          ),
        },
        {
          path: "module",
          element: (
            <ProtectedRoute
              path="module"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <Module /> : <NoConnection />}
            />
          ),
        },
        {
          path: "add-module",
          element: (
            <ProtectedRoute
              path="add-module"
              Component={
                isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditModule tag="add" /> : <NoConnection />
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
                isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <AddEditModule tag="edit" /> : <NoConnection />
              }
            />
          ),
        },
        {
          path: "report",
          element: (
            <ProtectedRoute
              path="report"
              Component={isOnline ? isPendingDailyReport ? <LastDailyReportPending/> : <Report /> : <NoConnection />}
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
      <RouterProvider router={routes2} />
    </>
  );
};

export default App;

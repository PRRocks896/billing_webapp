import { combineReducers } from "@reduxjs/toolkit";
import CustomerReducer from "./customer";
import StaffReducer from "./staff";
import StateReducer from "./states";
import CityReducer from "./city";
import ServiceCategoryReducer from "./serviceCategory";
import PaymentTypeReducer from "./paymentType";
import ServiceReducer from "./service";
import LoggedInUserReducer from "./loggedInUser";
import LoaderReducer from "./loader";
import UserReducer from "./users";
import RoleReducer from "./role";
import ModuleReducer from "./module";
import BillReducer from "./bill";
import ReportReducer from "./report";
import MembershipPlanReducer from "./membershipPlan";
import MembershipReducer from './membership';
import MembershipRedeemReducer from './membershipRedeem';
import DailyReportReducer from './dailyReport';
import employeeTypeReducer from "./employeeType";
import SalaryReducer from "./salary";
import CouponReducer from "./coupon";
import SeoReducer from "./seo";
import BlogReducer from "./blog";
import WebsiteBookingReducer from "./websiteBooking";
import NewsLetterReducer from "./newsletter";
import AdvanceReducer from "./advance";

const rootReducer = combineReducers({
  loader: LoaderReducer,
  customer: CustomerReducer,
  staff: StaffReducer,
  states: StateReducer,
  city: CityReducer,
  serviceCategory: ServiceCategoryReducer,
  paymentType: PaymentTypeReducer,
  service: ServiceReducer,
  loggedInUser: LoggedInUserReducer,
  users: UserReducer,
  role: RoleReducer,
  module: ModuleReducer,
  bill: BillReducer,
  report: ReportReducer,
  membershipPlan: MembershipPlanReducer,
  membership: MembershipReducer,
  membershipRedeem: MembershipRedeemReducer,
  dailyReport: DailyReportReducer,
  employeeType: employeeTypeReducer,
  salary: SalaryReducer,
  coupon: CouponReducer,
  seo: SeoReducer,
  blog: BlogReducer,
  websiteBooking: WebsiteBookingReducer,
  newsLetter: NewsLetterReducer,
  advance: AdvanceReducer
});

export default rootReducer;

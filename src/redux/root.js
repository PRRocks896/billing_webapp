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
});

export default rootReducer;

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
});

export default rootReducer;

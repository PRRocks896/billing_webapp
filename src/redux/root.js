import { combineReducers } from "@reduxjs/toolkit";
import CustomerReducer from "./customer";
import StaffReducer from "./staff";
import StateReducer from "./states";
import CityReducer from "./city";
import ServiceCategoryReducer from "./serviceCategory";
import ServiceReducer from "./service";

const rootReducer = combineReducers({
  customer: CustomerReducer,
  staff: StaffReducer,
  states: StateReducer,
  city: CityReducer,
  serviceCategory: ServiceCategoryReducer,
  service: ServiceReducer,
});

export default rootReducer;

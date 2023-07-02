import { combineReducers } from "@reduxjs/toolkit";
import CustomerReducer from "./customer";
import StaffReducer from "./staff";
import ServiceCategoryReducer from "./serviceCategory";

const rootReducer = combineReducers({
  customer: CustomerReducer,
  staff: StaffReducer,
  serviceCategory: ServiceCategoryReducer,
});

export default rootReducer;

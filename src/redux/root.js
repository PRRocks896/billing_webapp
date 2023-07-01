import { combineReducers } from "@reduxjs/toolkit";
import CustomerReducer from "./customer";
import StaffReducer from "./staff";

const rootReducer = combineReducers({
  customer: CustomerReducer,
  staff: StaffReducer,
});

export default rootReducer;

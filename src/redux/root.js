import { combineReducers } from "@reduxjs/toolkit";
import CustomerReducer from "./customer";

const rootReducer = combineReducers({
  customer: CustomerReducer,
});

export default rootReducer;

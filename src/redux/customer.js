import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const customerSlice = createSlice({
  name: "customer",
  initialState: initialState,
  reducers: {
    storeCustomer(state, action) {
      return { data: action.payload };
    },
  },
});

export const customerActions = customerSlice.actions;
export default customerSlice.reducer;

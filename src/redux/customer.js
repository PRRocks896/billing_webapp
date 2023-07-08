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
    removeCustomer(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
    changeCustomerStatus(state, action) {
      const updatedState = state.data.map((row) =>
        row.id === action.payload.id
          ? { ...row, isActive: action.payload.status }
          : { ...row }
      );
      return { data: updatedState };
    },
  },
});

export const customerActions = customerSlice.actions;
export default customerSlice.reducer;

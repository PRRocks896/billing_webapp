import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const paymentTypeSlice = createSlice({
  name: "paymentType",
  initialState,
  reducers: {
    storePaymentType(state, action) {
      return { data: action.payload };
    },
    removePaymentType(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
    changePaymentTypeStatus(state, action) {
      const updatedState = state.data.map((row) =>
        row.id === action.payload.id
          ? { ...row, isActive: action.payload.status }
          : { ...row }
      );
      return { data: updatedState };
    },
  },
});

export const paymentTypeAction = paymentTypeSlice.actions;
export default paymentTypeSlice.reducer;

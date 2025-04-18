import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const billSlice = createSlice({
  name: "bill",
  initialState,
  reducers: {
    storeBill(state, action) {
      state.data = action.payload;
    },
    removeBill(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
  },
});

export const billAction = billSlice.actions;
export default billSlice.reducer;

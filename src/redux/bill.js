import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const billSlice = createSlice({
  name: "bill",
  initialState,
  reducers: {
    storeBill(state, action) {
      // console.log("inside reducer store bill ", action.payload);
      return { data: action.payload };
    },
    removeBill(state, action) {
      // console.log(action.payload);
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
  },
});

export const billAction = billSlice.actions;
export default billSlice.reducer;

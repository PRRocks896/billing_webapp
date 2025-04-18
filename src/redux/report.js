import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    storeReport(state, action) {
      return { data: action.payload };
    },
  },
});

export const reportAction = reportSlice.actions;
export default reportSlice.reducer;

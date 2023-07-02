import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    storeStaff(state, action) {
      return { data: action.payload };
    },
  },
});

export const staffAction = staffSlice.actions;
export default staffSlice.reducer;

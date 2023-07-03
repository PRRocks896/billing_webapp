import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const citySlice = createSlice({
  name: "city",
  initialState,
  reducers: {
    storeCity(state, action) {
      console.log(action);
      return { data: action.payload };
    },
  },
});

export const cityAction = citySlice.actions;
export default citySlice.reducer;

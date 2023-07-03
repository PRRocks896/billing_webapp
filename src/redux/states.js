import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const statesSlice = createSlice({
  name: "states",
  initialState,
  reducers: {
    storeStates(state, action) {
      console.log(action);
      return { data: action.payload };
    },
  },
});

export const statesAction = statesSlice.actions;
export default statesSlice.reducer;

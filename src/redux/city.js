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
    removeCity(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
  },
});

export const cityAction = citySlice.actions;
export default citySlice.reducer;

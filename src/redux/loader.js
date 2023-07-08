import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
};

const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    startLoading() {
      console.log("startLoading");
      return { isLoading: true };
    },
    stopLoading() {
      console.log("stopLoading");
      return { isLoading: false };
    },
  },
});

export const { startLoading, stopLoading } = loaderSlice.actions;
export default loaderSlice.reducer;

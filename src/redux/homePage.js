import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const homePageSlice = createSlice({
  name: "homePage",
  initialState,
  reducers: {
    storeHomePage(state, action) {
      return { data: action.payload };
    },
    removeHomePage(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
    changeHomePageStatus(state, action) {
      const updatedState = state.data.map((row) =>
        row.id === action.payload.id
          ? { ...row, isActive: action.payload.status }
          : { ...row }
      );
      return { data: updatedState };
    }
  },
});

export const homePageAction = homePageSlice.actions;
export default homePageSlice.reducer;

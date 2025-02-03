import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const seoSlice = createSlice({
  name: "seo",
  initialState,
  reducers: {
    storeSeo(state, action) {
      return { data: action.payload };
    },
    removeSeo(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
    changeSeoStatus(state, action) {
      const updatedState = state.data.map((row) =>
        row.id === action.payload.id
          ? { ...row, isActive: action.payload.status }
          : { ...row }
      );
      return { data: updatedState };
    },
  },
});

export const seoAction = seoSlice.actions;
export default seoSlice.reducer;

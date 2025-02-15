import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    storeBlog(state, action) {
      return { data: action.payload };
    },
    removeBlog(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
    changeBlogStatus(state, action) {
      const updatedState = state.data.map((row) =>
        row.id === action.payload.id
          ? { ...row, isActive: action.payload.status }
          : { ...row }
      );
      return { data: updatedState };
    }
  },
});

export const blogAction = blogSlice.actions;
export default blogSlice.reducer;

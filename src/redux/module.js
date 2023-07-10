import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const moduleSlice = createSlice({
  name: "module",
  initialState,
  reducers: {
    storeModule(state, action) {
      return { data: action.payload };
    },
    removeModule(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
    changeModuleStatus(state, action) {
      const updatedState = state.data.map((row) =>
        row.id === action.payload.id
          ? { ...row, isActive: action.payload.status }
          : { ...row }
      );
      return { data: updatedState };
    },
  },
});

export const moduleAction = moduleSlice.actions;
export default moduleSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    storeServices(state, action) {
      return { data: action.payload };
    },
    removeService(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
    changeServiceStatus(state, action) {
      const updatedService = state.data.map((row) =>
        row.id === action.payload.id
          ? { ...row, isActive: action.payload.status }
          : { ...row }
      );
      return { data: updatedService };
    },
  },
});

export const serviceAction = serviceSlice.actions;
export default serviceSlice.reducer;

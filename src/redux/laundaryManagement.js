import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const LaundaryManagementSlice = createSlice({
  name: "laundaryManagement",
  initialState: initialState,
  reducers: {
    storeLaundaryManagement(state, action) {
      return { data: action.payload };
    },
    removeLaundaryManagement(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
    changeLaundaryManagementStatus(state, action) {
      const updatedState = state.data.map((row) =>
        row.id === action.payload.id
          ? { ...row, isActive: action.payload.status }
          : { ...row }
      );
      return { data: updatedState };
    },
  },
});

export const LaundaryManagementActions = LaundaryManagementSlice.actions;
export default LaundaryManagementSlice.reducer;

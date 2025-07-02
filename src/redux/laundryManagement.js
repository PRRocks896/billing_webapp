import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const LaundryManagementSlice = createSlice({
  name: "laundryManagement",
  initialState: initialState,
  reducers: {
    storeLaundryManagement(state, action) {
      return { data: action.payload };
    },
    removeLaundryManagement(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
    changeLaundryManagementStatus(state, action) {
      const updatedState = state.data.map((row) =>
        row.id === action.payload.id
          ? { ...row, isActive: action.payload.status }
          : { ...row }
      );
      return { data: updatedState };
    },
  },
});

export const LaundryManagementActions = LaundryManagementSlice.actions;
export default LaundryManagementSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    storeStaff(state, action) {
      return { data: action.payload };
    },
    removeStaff(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
    changeStaffStatus(state, action) {
      const updatedState = state.data.map((row) =>
        row.id === action.payload.id
          ? { ...row, isActive: action.payload.status }
          : { ...row }
      );
      return { data: updatedState };
    },
  },
});

export const staffAction = staffSlice.actions;
export default staffSlice.reducer;

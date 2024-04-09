import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const employeeTypeSlice = createSlice({
  name: "employeeType",
  initialState,
  reducers: {
    storeEmployeeType(state, action) {
      return { data: action.payload };
    },
    removeEmployeeType(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
    changeEmployeeTypeStatus(state, action) {
      const updatedState = state.data.map((row) =>
        row.id === action.payload.id
          ? { ...row, isActive: action.payload.status }
          : { ...row }
      );
      return { data: updatedState };
    },
  },
});

export const employeeTypeAction = employeeTypeSlice.actions;
export default employeeTypeSlice.reducer;

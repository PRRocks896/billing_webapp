import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const salarySlice = createSlice({
  name: "salary",
  initialState,
  reducers: {
    storeSalary(state, action) {
      return { data: action.payload };
    },
    removeSalary(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
    changeSalaryStatus(state, action) {
      const updatedState = state.data.map((row) =>
        row.id === action.payload.id
          ? { ...row, isActive: action.payload.status }
          : { ...row }
      );
      return { data: updatedState };
    },
  },
});

export const salaryAction = salarySlice.actions;
export default salarySlice.reducer;

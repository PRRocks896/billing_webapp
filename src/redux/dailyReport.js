import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const dailyReportSlice = createSlice({
  name: "dailyReport",
  initialState,
  reducers: {
    storeDailyReport(state, action) {
      return { data: action.payload };
    },
    removeDailyReport(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
    changeDailyReportStatus(state, action) {
      const updatedState = state.data.map((row) =>
        row.id === action.payload.id
          ? { ...row, isActive: action.payload.status }
          : { ...row }
      );
      return { data: updatedState };
    },
  },
});

export const dailyReportAction = dailyReportSlice.actions;
export default dailyReportSlice.reducer;

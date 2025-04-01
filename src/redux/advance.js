import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const advanceSlice = createSlice({
  name: "advance",
  initialState: initialState,
  reducers: {
    storeAdvance(state, action) {
      return { data: action.payload };
    },
    removeAdvance(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
    changeAdvanceStatus(state, action) {
      const updatedState = state.data.map((row) =>
        row.id === action.payload.id
          ? { ...row, isActive: action.payload.status }
          : { ...row }
      );
      return { data: updatedState };
    },
  },
});

export const advanceActions = advanceSlice.actions;
export default advanceSlice.reducer;

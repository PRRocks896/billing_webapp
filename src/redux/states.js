import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const statesSlice = createSlice({
  name: "states",
  initialState,
  reducers: {
    storeStates(state, action) {
      return { data: action.payload };
    },
    removeStates(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
    changeStatesStatus(state, action) {
      const updatedState = state.data.map((row) =>
        row.id === action.payload.id
          ? { ...row, isActive: action.payload.status }
          : { ...row }
      );
      return { data: updatedState };
    },
  },
});

export const statesAction = statesSlice.actions;
export default statesSlice.reducer;

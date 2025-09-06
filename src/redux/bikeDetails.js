import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const bikeDetailsSlice = createSlice({
  name: "bikeDetails",
  initialState: initialState,
  reducers: {
    storeBikeDetails(state, action) {
      return { data: action.payload };
    },
    removeBikeDetails(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
    changeBikeDetailsStatus(state, action) {
      const updatedState = state.data.map((row) =>
        row.id === action.payload.id
          ? { ...row, isActive: action.payload.status }
          : { ...row }
      );
      return { data: updatedState };
    },
  },
});

export const bikeDetailsActions = bikeDetailsSlice.actions;
export default bikeDetailsSlice.reducer;

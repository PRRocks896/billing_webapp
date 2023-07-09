import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const citySlice = createSlice({
  name: "city",
  initialState,
  reducers: {
    storeCity(state, action) {
      return { data: action.payload };
    },
    removeCity(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
    changeCityStatus(state, action) {
      const updatedCity = state.data.map((row) =>
        row.id === action.payload.id
          ? { ...row, isActive: action.payload.status }
          : { ...row }
      );
      return { data: updatedCity };
    },
  },
});

export const cityAction = citySlice.actions;
export default citySlice.reducer;

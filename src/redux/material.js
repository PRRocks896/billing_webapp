import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const materialSlice = createSlice({
  name: "material",
  initialState: initialState,
  reducers: {
    storeMaterial(state, action) {
      return { data: action.payload };
    },
    removeMaterial(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
    changeMaterialStatus(state, action) {
      const updatedState = state.data.map((row) =>
        row.id === action.payload.id
          ? { ...row, isActive: action.payload.status }
          : { ...row }
      );
      return { data: updatedState };
    },
  },
});

export const materialActions = materialSlice.actions;
export default materialSlice.reducer;

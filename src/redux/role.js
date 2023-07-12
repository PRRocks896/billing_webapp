import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    storeRole(state, action) {
      return { data: action.payload };
    },
    removeRole(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
    changeRoleStatus(state, action) {
      const updatedState = state.data.map((row) =>
        row.id === action.payload.id
          ? { ...row, isActive: action.payload.status }
          : { ...row }
      );
      return { data: updatedState };
    },
  },
});

export const roleAction = roleSlice.actions;
export default roleSlice.reducer;

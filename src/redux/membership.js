import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const membershipSlice = createSlice({
  name: "membership",
  initialState,
  reducers: {
    storeMembership(state, action) {
      return { data: action.payload };
    },
    removeMembership(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
    changeMembershipStatus(state, action) {
      const updatedState = state.data.map((row) =>
        row.id === action.payload.id
          ? { ...row, isActive: action.payload.status }
          : { ...row }
      );
      return { data: updatedState };
    },
  },
});

export const membershipAction = membershipSlice.actions;
export default membershipSlice.reducer;

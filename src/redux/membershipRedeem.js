import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const membershipRedeemSlice = createSlice({
  name: "membershipRedeem",
  initialState,
  reducers: {
    storeMembershipRedeem(state, action) {
      return { data: action.payload };
    },
    removeMembershipRedeem(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
    changeMembershipRedeemStatus(state, action) {
      const updatedState = state.data.map((row) =>
        row.id === action.payload.id
          ? { ...row, isActive: action.payload.status }
          : { ...row }
      );
      return { data: updatedState };
    },
  },
});

export const membershipRedeemAction = membershipRedeemSlice.actions;
export default membershipRedeemSlice.reducer;

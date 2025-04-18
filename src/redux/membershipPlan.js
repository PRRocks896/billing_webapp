import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const membershipPlanSlice = createSlice({
  name: "membershipPlan",
  initialState,
  reducers: {
    storeMembershipPlan(state, action) {
      return { data: action.payload };
    },
    removeMembershipPlan(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
    changeMembershipPlanStatus(state, action) {
      const updatedState = state.data.map((row) =>
        row.id === action.payload.id
          ? { ...row, isActive: action.payload.status }
          : { ...row }
      );
      return { data: updatedState };
    },
    changeMembershipPlanWebDisplayStatus(state, action) {
      const updatedState = state.data.map((row) =>
        row.id === action.payload.id
          ? { ...row, isWebDisplay: action.payload.isWebDisplay }
          : { ...row }
      );
      return { data: updatedState };
    },
  },
});

export const membershipPlanAction = membershipPlanSlice.actions;
export default membershipPlanSlice.reducer;

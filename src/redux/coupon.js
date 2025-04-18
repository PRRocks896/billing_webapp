import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    storeCoupon(state, action) {
      return { data: action.payload };
    },
    removeCoupon(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
    changeCouponStatus(state, action) {
      const updatedState = state.data.map((row) =>
        row.id === action.payload.id
          ? { ...row, isActive: action.payload.status }
          : { ...row }
      );
      return { data: updatedState };
    },
  },
});

export const couponAction = couponSlice.actions;
export default couponSlice.reducer;

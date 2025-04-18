import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const websiteBookingSlice = createSlice({
  name: "websiteBooking",
  initialState,
  reducers: {
    storeWebsiteBooking(state, action) {
      return { data: action.payload };
    },
    removeWebsiteBooking(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    }
  },
});

export const websiteBookingAction = websiteBookingSlice.actions;
export default websiteBookingSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const LaundryReceiverSlice = createSlice({
  name: "laundryReceiver",
  initialState: initialState,
  reducers: {
    storeLaundryReceiver(state, action) {
      return { data: action.payload };
    },
    removeLaundryReceiver(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
    changeLaundryReceiverStatus(state, action) {
      const updatedState = state.data.map((row) =>
        row.id === action.payload.id
          ? { ...row, isActive: action.payload.status }
          : { ...row }
      );
      return { data: updatedState };
    },
  },
});

export const LaundryReceiverActions = LaundryReceiverSlice.actions;
export default LaundryReceiverSlice.reducer;

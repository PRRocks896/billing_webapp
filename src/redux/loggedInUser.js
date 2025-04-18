import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const loggedInUser = createSlice({
  name: "loggedInUser",
  initialState,
  reducers: {
    storeLoggedInUserData(state, action) {
      return { ...action.payload };
    },
  },
});

export const loggedInUserAction = loggedInUser.actions;
export default loggedInUser.reducer;

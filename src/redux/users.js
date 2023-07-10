import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    storeUser(state, action) {
      return { data: action.payload };
    },
    removeUser(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
    changeUserStatus(state, action) {
      const updatedUser = state.data.map((row) =>
        row.id === action.payload.id
          ? { ...row, isActive: action.payload.status }
          : { ...row }
      );
      return { data: updatedUser };
    },
  },
});

export const userAction = usersSlice.actions;
export default usersSlice.reducer;

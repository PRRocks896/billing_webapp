import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const newsLetterSlice = createSlice({
  name: "newsLetter",
  initialState,
  reducers: {
    storeNewsLetter(state, action) {
      return { data: action.payload };
    },
    removeNewsLetter(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
    changeNewsLetterStatus(state, action) {
      const updatedState = state.data.map((row) =>
        row.id === action.payload.id
          ? { ...row, isActive: action.payload.status }
          : { ...row }
      );
      return { data: updatedState };
    },
  },
});

export const newsLetterAction = newsLetterSlice.actions;
export default newsLetterSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const serviceCategorySlice = createSlice({
  name: "serviceCategory",
  initialState,
  reducers: {
    storeServiceCategories(state, action) {
      console.log(action);
      return { data: action.payload };
    },
    removeServiceCategory(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
  },
});

export const serviceCategoryAction = serviceCategorySlice.actions;
export default serviceCategorySlice.reducer;

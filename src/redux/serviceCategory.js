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
  },
});

export const serviceCategoryAction = serviceCategorySlice.actions;
export default serviceCategorySlice.reducer;

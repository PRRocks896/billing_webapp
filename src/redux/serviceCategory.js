import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const serviceCategorySlice = createSlice({
  name: "serviceCategory",
  initialState,
  reducers: {
    storeServiceCategories(state, action) {
      return { data: action.payload };
    },
    removeServiceCategory(state, action) {
      return { data: state.data.filter((row) => row.id !== action.payload.id) };
    },
    changeServiceCategoryStatus(state, action) {
      const updatedServiceCategory = state.data.map((row) =>
        row.id === action.payload.id
          ? { ...row, isActive: action.payload.status }
          : { ...row }
      );
      return { data: updatedServiceCategory };
    },
  },
});

export const serviceCategoryAction = serviceCategorySlice.actions;
export default serviceCategorySlice.reducer;

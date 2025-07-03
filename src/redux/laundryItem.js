import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
};

const laundryItemSlice = createSlice({
    name: "laundryItem",
    initialState: initialState,
    reducers: {
        storeLaundryItem(state, action) {
            return { data: action.payload };
        },
        removeLaundryItem(state, action) {
            return { data: state.data.filter((row) => row.id !== action.payload.id) };

        },
        changeLaundryItemStatus(state, action) {
            const updateState = state.data.map((row) =>
                row.id === action.payload.id
                ? { ...row, isActive: action.payload.status }
                : { ...row }
            );
            return { data: updateState };
        },
    },
});

export const laundryItemAction = laundryItemSlice.actions;
export default laundryItemSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
};

const stockSlice = createSlice({
    name: "stock",
    initialState: initialState,
    reducers: {
        storeStock(state, action) {
            return { data: action.payload };
        },
        removeStock(state, action) {
            return { data: state.data.filter((row) => row.id !== action.payload.id) };

        },
        changeStockStatus(state, action) {
            const updateState = state.data.map((row) =>
                row.id === action.payload.id
                ? { ...row, isActive: action.payload.status }
                : { ...row }
            );
            return { data: updateState };
        },
    },
});

export const stockAction = stockSlice.actions;
export default stockSlice.reducer;
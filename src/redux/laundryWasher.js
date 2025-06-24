import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
};

const laundryWasherSlice = createSlice({
    name: "laundryWasher",
    initialState: initialState,
    reducers: {
        storeLaundryWasher(state, action) {
            return { data: action.payload };
        },
        removeLaundryWasher(state, action) {
            return { data: state.data.filter((row) => row.id !== action.payload.id) };

        },
        changeLaundryWasherStatus(state, action) {
            const updateState = state.data.map((row) =>
                row.id === action.payload.id
                ? { ...row, isActive: action.payload.status }
                : { ...row }
            );
            return { data: updateState };
        },
    },
});

export const laundryWasherAction = laundryWasherSlice.actions;
export default laundryWasherSlice.reducer;
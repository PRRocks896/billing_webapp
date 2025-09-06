import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
};

const dailyTaskSlice = createSlice({
    name: "dailyTask",
    initialState,
    reducers: {
        storeDailyTask(state, action) {
            return { data: action.payload };
        },
        removeDailyTask(state, action) {
            return { data: state.data.filter((row) => row.id !== action.payload.id) };
        },
        changeDailyTaskStatus(state, action) {
            const updatedState = state.data.map((row) =>
                row.id === action.payload.id
                    ? { ...row, isActive: action.payload.status }
                    : { ...row }
            );
            return { data: updatedState };
        },
    },
});

export const dailyTaskAction = dailyTaskSlice.actions;
export default dailyTaskSlice.reducer;

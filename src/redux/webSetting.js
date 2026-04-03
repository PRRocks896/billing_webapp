import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
};

const webSettingSlice = createSlice({
    name: "webSetting",
    initialState,
    reducers: {
        storeWebSetting(state, action) {
            return { data: action.payload };
        },
        removeWebSetting(state, action) {
            return { data: state.data.filter((row) => row.id !== action.payload.id) };
        },
        changeWebSettingStatus(state, action) {
            const updatedState = state.data.map((row) =>
                row.id === action.payload.id
                    ? { ...row, isActive: action.payload.status }
                    : { ...row }
            );
            return { data: updatedState };
        },
    },
});

export const webSettingAction = webSettingSlice.actions;
export default webSettingSlice.reducer;

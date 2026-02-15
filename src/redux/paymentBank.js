import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
};

const paymentBankSlice = createSlice({
    name: "paymentBank",
    initialState: initialState,
    reducers: {
        storePaymentBank(state, action) {
            return { data: action.payload };
        },
        removePaymentBank(state, action) {
            return { data: state.data.filter((row) => row.id !== action.payload.id) };

        },
        changePaymentBankStatus(state, action) {
            const updateState = state.data.map((row) =>
                row.id === action.payload.id
                    ? { ...row, isActive: action.payload.status }
                    : { ...row }
            );
            return { data: updateState };
        },
    },
});

export const paymentBankAction = paymentBankSlice.actions;
export default paymentBankSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

/* ============================
   Payment State Type
============================ */
type PaymentState = {
  hasLifetimeAccess: boolean;
  paidAt: string | null;
  fetched: boolean;
};

/* ============================
   Initial State
============================ */
const initialState: PaymentState = {
  hasLifetimeAccess: false,
  paidAt: null,
  fetched: false,
  // needfetch: true,
};

/* ============================
   Create Slice
============================ */
const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPayment: (state, action) => {
      state.hasLifetimeAccess = action.payload.hasLifetimeAccess;
      state.paidAt = action.payload.paidAt;
      state.fetched = true;
    },
    clearPayment: (state) => {
      state.hasLifetimeAccess = false;
      state.paidAt = null;
      state.fetched = false;
    },
  },
});

/* ============================
   Exports
============================ */
export const { setPayment, clearPayment } = paymentSlice.actions;

export default paymentSlice.reducer;

/* ============================
   Selector
============================ */
export const selectPayment = (state: RootState) => state.payment;

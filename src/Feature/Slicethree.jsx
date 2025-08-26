import { createSlice } from "@reduxjs/toolkit";

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    name: null,
    email: null,
    amount: null,
  },
  reducers: {
    setCheckoutData: (state, action) => {
      const { name, email, amount } = action.payload;
      state.name = name;
      state.email = email;
      state.amount = amount;
    },
    clearCheckoutData: (state) => {
      state.name = null;
      state.email = null;
      state.amount = null;
    },
  },
});

export const { setCheckoutData, clearCheckoutData } = checkoutSlice.actions;
export default checkoutSlice.reducer;

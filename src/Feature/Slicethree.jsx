import { createSlice } from "@reduxjs/toolkit";

const CHECKOUT_STORAGE_KEY = "solemate_checkout";
const ADDRESS_CONFIRMED_KEY = "solemate_checkout_addressConfirmed";

function loadCheckoutState() {
  try {
    const raw = localStorage.getItem(CHECKOUT_STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    return {
      name: p.name ?? null,
      email: p.email ?? null,
      amount: Number(p.amount) || 0,
      subtotal: Number(p.subtotal ?? p.amount) || 0,
      discount: Number(p.discount) || 0,
      couponCode: p.couponCode ?? "",
      couponType: p.couponType ?? "",
      couponValue: Number(p.couponValue) || 0,
    };
  } catch {
    return null;
  }
}

function persistCheckoutState(state) {
  try {
    localStorage.setItem(
      CHECKOUT_STORAGE_KEY,
      JSON.stringify({
        name: state.name,
        email: state.email,
        amount: state.amount,
        subtotal: state.subtotal,
        discount: state.discount,
        couponCode: state.couponCode,
        couponType: state.couponType,
        couponValue: state.couponValue,
      })
    );
  } catch (err) {
    console.error("Persist checkout failed", err);
  }
}

const defaultState = {
  name: null,
  email: null,
  amount: 0,
  subtotal: 0,
  discount: 0,
  couponCode: "",
  couponType: "",
  couponValue: 0,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: loadCheckoutState() ?? defaultState,
  reducers: {
    setCheckoutData: (state, action) => {
      const {
        name,
        email,
        amount = 0,
        subtotal = amount,
        discount = 0,
        couponCode = "",
        couponType = "",
        couponValue = 0,
      } = action.payload;
      state.name = name;
      state.email = email;
      state.amount = Number(amount) || 0;
      state.subtotal = Number(subtotal) || 0;
      state.discount = Number(discount) || 0;
      state.couponCode = couponCode;
      state.couponType = couponType;
      state.couponValue = Number(couponValue) || 0;
      persistCheckoutState(state);
    },
    clearCheckoutData: (state) => {
      state.name = null;
      state.email = null;
      state.amount = 0;
      state.subtotal = 0;
      state.discount = 0;
      state.couponCode = "";
      state.couponType = "";
      state.couponValue = 0;
      try {
        localStorage.removeItem(CHECKOUT_STORAGE_KEY);
        localStorage.removeItem(ADDRESS_CONFIRMED_KEY);
      } catch {
        /* ignore */
      }
    },
  },
});

export const { setCheckoutData, clearCheckoutData } = checkoutSlice.actions;
export { ADDRESS_CONFIRMED_KEY };
export default checkoutSlice.reducer;

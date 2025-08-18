import { createSlice } from "@reduxjs/toolkit";

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error loading cart from localStorage", err);
    return [];
  }
};

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (err) {
    console.error("Error saving cart to localStorage", err);
  }
};

const initialState = {
  cartitem: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addtocart(state, action) {
      const item = action.payload;
      const existingItem = state.cartitem.find((i) => i.id === item.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartitem.push({ ...item, quantity: 1 });
      }

      saveCartToStorage(state.cartitem);
    },

    removefromcart(state, action) {
      state.cartitem = state.cartitem.filter(
        (item) => item.id !== action.payload
      );

      saveCartToStorage(state.cartitem);
    },

    clearCart(state) {
      state.cartitem = [];
      saveCartToStorage([]);
    },
  },
});

export const { addtocart, removefromcart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

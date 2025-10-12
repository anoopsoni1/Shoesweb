import { createSlice } from "@reduxjs/toolkit";

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
    },

    removefromcart(state, action) {
      state.cartitem = state.cartitem.filter(
        (item) => item.id !== action.payload
      );

    },

    clearCart(state) {
      state.cartitem = [];
      saveCartToStorage([]);
    },

    setCart: (state, action) => {
    state.cartitem = action.payload;
}
  },
});

export const { addtocart, removefromcart, clearCart , setCart} = cartSlice.actions;
export default cartSlice.reducer;

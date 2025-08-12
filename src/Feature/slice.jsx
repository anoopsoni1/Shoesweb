import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/user";


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


export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async () => {
    const res = await axios.get(`${API_URL}/getcart`);
    return res.data.items || [];
  }
);

export const saveCart = createAsyncThunk(
  "cart/saveCart",
  async ({ userId, items }) => {
    await axios.post(`${API_URL}/cart`, { userId, items });
    return items;
  }
);

const initialState = {
  cartitem: loadCartFromStorage(), 
  status: "idle",
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cartitem = action.payload;
        saveCartToStorage(action.payload);
        state.status = "succeeded";
      })
      .addCase(saveCart.fulfilled, (state, action) => {
        state.cartitem = action.payload;
        saveCartToStorage(action.payload);
      });
  },
});

export const { addtocart, removefromcart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

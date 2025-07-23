import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../Feature/slice.jsx"

export const store = configureStore(
      {
        reducer : {
            cart : cartReducer ,
        }
      }
)
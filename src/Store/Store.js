import  {configureStore} from "@reduxjs/toolkit"
import cartReducer from "../Feature/slice.jsx"
import userReducer from "../Feature/Slicetwo.jsx"
export const store = configureStore(
      {
        reducer : {
            cart : cartReducer ,
            user : userReducer,
        }
      }
)
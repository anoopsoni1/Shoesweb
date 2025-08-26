import  {configureStore} from "@reduxjs/toolkit"
import cartReducer from "../Feature/slice.jsx"
import userReducer from "../Feature/Slicetwo.jsx"
import checkoutReducer from "../Feature/Slicethree.jsx"
export const store = configureStore(
      {
        reducer : {
            cart : cartReducer ,
            user : userReducer,
           checkout: checkoutReducer,
        }
      }
)
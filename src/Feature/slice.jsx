import { createSlice,createAsyncThunk } from "@reduxjs/toolkit"


const API_URL = "http://localhost:5000/api/v1/user";


export const fetchCart = createAsyncThunk("cart/fetchCart", async (userId) => {
  const res = await axios.get(`${API_URL}/getcart/${userId}`);
  return res.data.items || [];
});


export const saveCart = createAsyncThunk("cart/saveCart", async ({ userId, items }) => {
  await axios.post(`${API_URL}/cart`, { userId, items });
       return items;
});

 const initialState = {
    cartitem : [] ,
 } 

  const  cartslice = createSlice({
    name : 'cart' ,
    initialState ,
      reducers : {
        addtocart(state ,action) { 
         const item =action.payload ;
        const existingitem = state.cartitem.find(i => i.id === item.id)
   
if(existingitem){
    existingitem.quantity += 1;
}  else{
    state.cartitem.push({...item , quantity : 1 })
}
        },
        addtobuy(state ,action) { 
          const item =action.payload ;
         const existingitem = state.cartitem.find(i => i.id === item.id)
    
 if(existingitem){
     existingitem.quantity += 1;
 }  else{
     state.cartitem.push({...item , quantity : 1 })
 }
         },

        removefromcart: (state, action) => {
            state.cartitem = state.cartitem.filter(item => item.id !== action.payload);
          },
      }
  })

  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(saveCart.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  }

  export const {addtocart ,removefromcart} = cartslice.actions; 



 export default cartslice.reducer 
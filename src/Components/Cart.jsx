import { useDispatch, useSelector } from "react-redux";
import { addtocart, removefromcart, saveCart } from "../Feature/slice.jsx";

function Cart() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cartitem);

   const user = useSelector((state) => state.user.userData);

  const handleAdd = (item) => {
    dispatch(addtocart({
      id: item.id,
      name: item.name,
      image: item.image,
      quantity: 1 
    }));
  };

  const handleRemove = (id) => {
    dispatch(removefromcart(id));
  };

  const handleSyncWithBackend = () => {
    dispatch(saveCart({
      userId: user._id ,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        image: item.image,
        quantity: item.quantity
      }))
    }));
  };

  return (
    <div>
      <h1 className="text-center text-6xl mb-6">🛒 Cart Items</h1>
      {cart.length === 0 && <p className="text-center text-4xl">Your cart is empty</p>}

      {cart.map((item) => (
        <div key={item.id} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
         
          <img 
            src={item.image} 
            alt={item.name} 
            style={{ width: "60px", height: "60px", marginRight: "10px", objectFit: "cover", borderRadius: "5px" }} 
          />

          <div style={{ flex: 1 }}>
            <p>{item.name}</p>
            <p>Qty: {item.quantity}</p>
          </div>

       
          <button onClick={() => handleAdd(item)} className="text-3xl">Add</button>
          <button onClick={() => handleRemove(item.id)}>Remove</button>
        </div>
      ))}

      {cart.length > 0 && (
        <button onClick={handleSyncWithBackend} style={{ marginTop: "10px" }}>
          Sync with Backend
        </button>
      )}
    </div>
  );
}

export default Cart;

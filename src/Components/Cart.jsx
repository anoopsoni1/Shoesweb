import { useDispatch, useSelector } from "react-redux";
import { addtocart, removefromcart, clearCart } from "../Feature/slice.jsx";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import {useNavigate} from "react-router-dom"

function Cart() {
  const dispatch = useDispatch();
  const payal = useNavigate() ;
  const cart = useSelector((state) => state.cart.cartitem);

  const handleAdd = (item) => {
    dispatch(addtocart(item));
  };

  const handleRemove = (id) => {
    dispatch(removefromcart(id));
  };

  const handleClear = () => {
    dispatch(clearCart());
  };

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

   const handlenavigate = ()=>{
       payal("/checkout")
   }
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-8">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCart className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">My Cart</h2>
      </div>

      {cart.length === 0 ? (
        <p className="text-gray-500 text-center py-6">
          Your cart is empty 🛒
        </p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-gray-50 p-4 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg border"
                />
                <div>
                  <p className="text-lg font-medium text-gray-800">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    ₹{item.price} x {item.quantity}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRemove(item.id)}
                  className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 text-gray-800 font-semibold">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleAdd(item)}
                  className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Item Total */}
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-800">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subtotal & Actions */}
      {cart.length > 0 && (
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-6">
          <h3 className="text-xl font-bold text-gray-800">
            Subtotal: ₹{subtotal}
          </h3>
          <div className="flex gap-3">
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
            >
              <Trash2 className="w-5 h-5" /> Clear Cart
            </button>
            <button onClick={handlenavigate}
             className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;

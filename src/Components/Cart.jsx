import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removefromcart } from '../Feature/slice.jsx';
import { toast } from 'react-toastify';

function Cart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartitem);

  const handleRemove = (item) => {
    dispatch(removefromcart(item.id));
    toast.success(`${item.name} removed from cart!`);
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen p-8  mx-auto text-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-10">🛒 Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-gray-600 text-lg mt-20">
          <p className="text-2xl font-semibold">Your cart is currently empty.</p>
          <p className="mt-2">Start adding items to see them here!</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white shadow-md p-4 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="text-left">
                    <h2 className="text-xl font-semibold">{item.name}</h2>
                    <p className="text-gray-600">
                      ₹{item.price} × {item.quantity}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(item)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-12 text-right">
            <h2 className="text-2xl font-bold">
              Total: <span className="text-green-600">₹{total.toFixed(2)}</span>
            </h2>
            <button className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;

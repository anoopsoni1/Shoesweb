import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../Feature/slice.jsx";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import {useNavigate} from "react-router-dom"
import { Link } from "react-router-dom";
import SiteHeader from "./SiteHeader.jsx";
import {
  setCheckoutData,
  clearCheckoutData,
  ADDRESS_CONFIRMED_KEY,
} from "../Feature/Slicethree.jsx";
import {clearUser} from "../Feature/Slicetwo.jsx"
import axios from "axios";
import { useEffect } from "react";
import { setCart, setCartItemQuantity } from "../Feature/slice.jsx";
import {
  resolveCartItemImage,
  CART_IMAGE_FALLBACK,
} from "../utils/cartImage.js";

const API_USER = "https://shoesbackend-4.onrender.com/api/v1/user";

function Cart() {
  const dispatch = useDispatch(); 
  const payal = useNavigate() ;

  const cart = useSelector((state) => state.cart.cartitem);
  const user = useSelector((state) => state.user.userData);


  const cartItemKey = (item) => String(item.id ?? item._id ?? "");

  const refetchServerCart = async () => {
    if (!user?._id) return;
    try {
      const cartdata = await fetch(`${API_USER}/getcart/${user._id}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await cartdata.json();
      if (Array.isArray(data.items)) dispatch(setCart(data.items));
    } catch (error) {
      console.error("Failed to refresh cart", error);
    }
  };

  const increaseQuantity = async (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const key = cartItemKey(item);
    const currentQty = Number(item.quantity) || 1;
    const nextQty = currentQty + 1;
    if (!key) return;

    dispatch(setCartItemQuantity({ id: key, quantity: nextQty }));

    if (!user?._id) return;

    try {
      const response = await axios.patch(
        `${API_USER}/cart/${user._id}/${encodeURIComponent(key)}`,
        { quantity: nextQty },
        { withCredentials: true }
      );
      dispatch(setCart(response.data.items ?? []));
    } catch (error) {
      console.error("Failed to increase quantity", error);
      await refetchServerCart();
    }
  };

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
     0
  );

   useEffect(()=>{
    const Getcart = async () => {
    try {
     
       const cartdata = await fetch(`${API_USER}/getcart/${user._id}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
      });
      
    const data = await cartdata.json();
     if (Array.isArray(data.items)) dispatch(setCart(data.items));
    } catch (error) {
      console.error("Fetch to cart is failed", error);
    }
  };
 
   if (user?._id) {
      Getcart();
    }
  }, [user, dispatch]);


  const handleRemove = async (id) => {
    const sid = String(id);
    if (!user?._id) {
      dispatch(setCartItemQuantity({ id: sid, quantity: 0 }));
      return;
    }
    try {
      const response = await axios.delete(
        `${API_USER}/cart/${user._id}/${encodeURIComponent(sid)}`,
        { withCredentials: true }
      );
      dispatch(setCart(response.data.items ?? []));
    } catch (err) {
      console.error("Failed to remove item", err);
      await refetchServerCart();
    }
  };

  const handleDecrease = async (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const key = cartItemKey(item);
    const currentQty = Number(item.quantity) || 1;
    const nextQty = currentQty - 1;
    if (!key) return;

    if (nextQty <= 0) {
      await handleRemove(key);
      return;
    }

    dispatch(setCartItemQuantity({ id: key, quantity: nextQty }));

    if (!user?._id) return;

    try {
      const response = await axios.patch(
        `${API_USER}/cart/${user._id}/${encodeURIComponent(key)}`,
        { quantity: nextQty },
        { withCredentials: true }
      );
      dispatch(setCart(response.data.items ?? []));
    } catch (error) {
      console.error("Failed to decrease quantity", error);
      await refetchServerCart();
    }
  };


  const handlecheckout = () => {
    try {
      localStorage.removeItem(ADDRESS_CONFIRMED_KEY);
    } catch {
      /* ignore */
    }
    dispatch(
      setCheckoutData({
        name: user?.FirstName || "Guest User",
        email: user?.email || "guest@solemate.local",
        subtotal: subtotal,
        discount: 0,
        couponCode: "",
        couponType: "",
        couponValue: 0,
        amount: subtotal,
      })
    );
    payal(`/address/${user?._id || "guest"}`);
  };
  

  const handleLogout = async () => {
    try {
      await axios.post(`${API_USER}/logout`, {}, { withCredentials: true });
      dispatch(clearUser());
      dispatch(clearCart());
      dispatch(clearCheckoutData());
      payal("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  return (
    <>
      <SiteHeader onLogout={handleLogout} />
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-8">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCart className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">My Cart</h2>
      </div>

      {cart.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-400 text-center py-6">
          Your cart is empty 🛒
        </p>
      ) : (
        <div className="space-y-4">
          {cart.map((item, rowIndex) => (
            <div
              key={cartItemKey(item) || `cart-row-${rowIndex}`}
              className="bg-gray-50 p-4 rounded-xl shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                <img
                  src={resolveCartItemImage(
                    item.image,
                    item.id ?? item._id
                  )}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg border bg-gray-100"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = CART_IMAGE_FALLBACK;
                  }}
                />
                <div>
                  <p className="text-lg font-medium text-gray-800">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    ₹{item.price} each
                  </p>
                </div>
              </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleDecrease(e, item)}
                      className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 text-gray-800 font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => increaseQuantity(e, item)}
                      className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold text-gray-800">
                      ₹{item.price * item.quantity}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRemove(cartItemKey(item))}
                      className="p-2 rounded-full bg-white text-red-600 hover:bg-red-50 transition border border-red-100"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-6">
          <h3 className="text-xl font-bold text-gray-800">
            Subtotal: ₹{subtotal}
          </h3>
          <div className="flex gap-3">
            <button onClick={handlecheckout}
             className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition">
              Checkout
            </button>
          
          </div>
        </div>
      )}
    </div>
     </>
  );
}

export default Cart;

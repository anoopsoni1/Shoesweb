import { useDispatch, useSelector } from "react-redux";
import { addtocart, removefromcart, clearCart } from "../Feature/slice.jsx";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import {useNavigate} from "react-router-dom"
import { Link } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { setCheckoutData } from "../Feature/Slicethree.jsx";
import {clearUser} from "../Feature/Slicetwo.jsx"
import axios from "axios";

function Cart() {
  const dispatch = useDispatch();

  const payal = useNavigate() ;

  const cart = useSelector((state) => state.cart.cartitem);
  const user = useSelector((state) => state.user.userData);

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

  const handlecheckout = ()=>{
dispatch(
      setCheckoutData({
        name: user.FirstName,
        email: user.email,
        amount: subtotal,
      })
    );
      console.log(subtotal);
       payal("/checkout")
  }
  

    const handleLogout = async() => {
      try {
      await axios.post("http://localhost:5000/api/v1/user/logout", {}, { withCredentials: true });
        dispatch(clearUser())
        dispatch(clearCart())
            payal("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  return (
    <>
    <header className="h-[8.5vh] z-50 bg-white/80 backdrop-blur-md shadow">
        <nav className="flex justify-between items-center sm:px-6 px-2 sm:py-4 py-2 max-w-7xl mx-auto">
          <Link to="/" className="text-2xl font-semibold tracking-wide">SoleMate</Link>
          <div className="flex sm:gap-5 gap-2 items-center">
            <Link to="/" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <FaRegHeart />
            </Link>
            <Link to="/cart" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <FaShoppingBag />
            </Link>
            {user ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <FaRegUserCircle />
              </Link>
            )}
          </div>
        </nav>
      </header>
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

              <div className="text-right">
                <p className="text-lg font-semibold text-gray-800">
                  ₹{item.price * item.quantity}
                </p>
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
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
            >
              <Trash2 className="w-5 h-5" /> Clear Cart
            </button>
            {user ? (  <button onClick={handlecheckout}
             className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition">
              Checkout
            </button>) : (  <Link to="/login"
             className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition">
              Login
            </Link>)}
          
          </div>
        </div>
      )}
    </div>
     </>
  );
}

export default Cart;

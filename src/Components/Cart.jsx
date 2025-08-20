import { useDispatch, useSelector } from "react-redux";
import { addtocart, removefromcart, clearCart } from "../Feature/slice.jsx";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import {useNavigate} from "react-router-dom"
import { Link } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";

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

    const handleLogout = async() => {
      try {
      await axios.post("http://localhost:5000/api/v1/user/logout", {}, { withCredentials: true });
        dispatch(clearUser())
         navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

   const handlenavigate = ()=>{
      payal("/checkout")
   }

   const handlenavi = ()=>{
     payal("/login")
   }

  return (
    <>
    <header className="relative" >
          <nav className=" ml-5 flex  justify-between">
            <div>
              <Link to="/" className="text-2xl font-medium">SoleMate</Link>
            </div>
  
            <div className="sm:block hidden">
              <ul className="flex gap-8 mt-1 font-semibold place-items-center mr-5">
  
                <Link to="/" className="bg-amber-100 p-3 rounded-[5px]">
                  <FaRegHeart />
                </Link>
                <Link to="/cart" className="bg-amber-100 p-3 rounded-[5px]">
                  <FaShoppingBag />
                </Link>
  
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Logout
                  </button>
                ) : (
                  <Link to="/dashboard" className="bg-amber-100 p-3 rounded-[5px]">
                    <FaRegUserCircle />
                  </Link>
                )}
              </ul>
            </div>
  
            <div className="flex sm:hidden list-none gap-1">
              <Link className="bg-amber-100 p-3 rounded-[5px]">
                <FaRegHeart />
              </Link>
              <Link to="/cart" className="bg-amber-100 p-3 rounded-[5px]">
                <FaShoppingBag />
              </Link>
  
              {user ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" className="bg-amber-100 p-3 rounded-[5px]">
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
            {user ? (  <button onClick={handlenavigate}
             className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition">
              Checkout
            </button>) : (  <button onClick={handlenavi}
             className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition">
              Login
            </button>)}
          
          </div>
        </div>
      )}
    </div>
     </>
  );
}

export default Cart;

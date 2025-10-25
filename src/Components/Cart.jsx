import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../Feature/slice.jsx";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import {useNavigate} from "react-router-dom"
import { Link } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { setCheckoutData } from "../Feature/Slicethree.jsx";
import {clearUser} from "../Feature/Slicetwo.jsx"
import axios from "axios";
import { useEffect } from "react";
import { setCart } from "../Feature/slice.jsx";


function Cart() {
  const dispatch = useDispatch(); 
  const payal = useNavigate() ;

  const cart = useSelector((state) => state.cart.cartitem);
  const user = useSelector((state) => state.user.userData);


 const Addtocart = async (e , item) => {
        e.preventDefault();
        const cartPayload = {
         userId: user?._id, 
         
      items: [
        { id: item.id , name : item.name ,price : item.price , quantity: 1 }
      ]
    };
    try {
       const cartdata = await fetch('http://localhost:5000/api/v1/user/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body : JSON.stringify(cartPayload) ,
      });
      
    if (!cartdata.ok) {
      throw new Error("Failed to add to cart");
    }
        const data = await cartdata.json();
        
         dispatch(setCart(data.items));
    } catch (error) {
      console.error("Add to cart is failed", error);
    }
  };

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
     0
  );

   useEffect(()=>{
    const Getcart = async () => {
    try {
     
       const cartdata = await fetch(`http://localhost:5000/api/v1/user/getcart/${user._id}`, {
          method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
    const data = await cartdata.json();
     if (data.items) dispatch(setCart(data.items));
    } catch (error) {
      console.error("Fetch to cart is failed", error);
    }
  };
 
   if (user._id) {
      Getcart();
    }
  }, [user]);


const handleRemove = async (id) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/api/v1/user/cart/${user._id}/${id}`
    );
    dispatch(setCart(response.data.items));
  } catch (err) {
    console.error("Failed to remove item", err);
  }
};


  const handlecheckout = ()=>{
dispatch(
      setCheckoutData({
        name: user.FirstName,
        email: user.email,
        amount: subtotal,
      })
    );
       payal("/address/:userid")
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
          <Link to="/" className="text-2xl font-semibold tracking-wide ">SoleMate</Link>
          <div className="flex sm:gap-5 gap-2 items-center">
            <Link to="/" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <FaRegHeart />
            </Link>
            <Link className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
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
                  onClick={(e) => Addtocart(e,item)}
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

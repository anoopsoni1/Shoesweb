import { FaRegHeart, FaShoppingBag, FaRegUserCircle } from "react-icons/fa";
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
// import { addtocart } from "../Feature/slice";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { clearUser } from "../Feature/Slicetwo";
import { setCart } from "../Feature/slice";

export const products = [
  { id: 1, name: "Nike Air Max", price: 1050, image: "./List01.jpg" },
  { id: 2, name: "Nike Air Jordan 1", price: 1299, image: "./List02.jpeg" },
  { id: 3, name: "Nike Air Max Mesh Runner", price: 1599, image: "./List03.jpg" },
  { id: 4, name: "Reebok Classic", price: 1399, image: "./List04.jpg" },
  { id: 5, name: "Jordan 1 Retro", price: 17999, image: "./List05.jpeg" },
  { id: 6, name: "New Balance 574", price: 8999, image: "./List06.jpeg" },
  { id: 18, name: "NB Sneaker", price: 8999, image: "./List18.jpeg", category: "Sneaker" },
];

const routes = {
  1: "/one",
  2: "/two",
  3: "/three",
  4: "/four",
  5: "/five",
  6: "/six",
  7: "/seven",
  8: "/eight",
  9: "/nine",
  10: "/ten",
  11: "/eleven",
  12: "/twelve",
  13: "/thirteen",
  14: "/fourteen",
  15: "/fifteen",
  16: "/sixteen",
  17: "/seventeen",
  18: "/eighteen",
  19: "/nineteen",
  20: "/twenty",
  21: "/twentyone",
};


const categories = [
  "All",
  "Sneaker",
  "Sportswear",
  "Dress Shoes",
  "Casual Shoes",
  "Boots",
  "Sandals",
  "Slippers",
];

export default function List() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  const navigate = useNavigate();
  const [category, setCategory] = useState("All");

  const handleLogout = async () => {
    try {
      await axios.post("https://shoesbackend-4.onrender.com/api/v1/user/logout", {}, { withCredentials: true });
      dispatch(clearUser());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

   const Addtocart = async (e, product) => {
        e.preventDefault();
        const cartPayload = {
         userId: user?._id, 
         
         
      items: [
        { id: product.id , name : product.name ,price : product.price ,quantity: 1 }
      ]
    };
    try {
       const cartdata = await fetch('https://shoesbackend-4.onrender.com/api/v1/user/cart', {
          method: 'POST',
        headers: { 'Content-Type': 'application/json' },
          body : JSON.stringify(cartPayload) ,
      });
      
    if (!cartdata.ok) {
      throw new Error("Failed to add to cart");
    }
    const data = await cartdata.json();
      toast.success(`${product.name} added successfully`);
        dispatch(setCart(data.items)) 
    } catch (error) {
      console.error("Add to cart is failed", error);
    }
  };


  const bigger = (e) => {
  const path = routes[e];
  if (path) {
    window.location.href = path;
  } else {
    console.warn("Invalid option:", e);
  }
};

  const filteredProducts = products.filter((p) => category === "All" || p.category === category);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow">
        <nav className="flex justify-between items-center sm:px-6  px-2 sm:py-4 py-2 max-w-7xl mx-auto">
          <Link to="/" className="text-2xl sm:mr-0 mr-4 font-semibold tracking-wide">SoleMate</Link>
          <div className="flex sm:gap-5 gap-4  items-center">
            <Link to="/" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <FaRegHeart />
            </Link>
            <Link to="/cart/:UserId" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <FaShoppingBag />
            </Link>
            {user ? (
              <button
                onClick={handleLogout}
                className="px-2 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
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

  
      <div className="flex">
        <aside className="hidden sm:block w-56 sticky top-24 h-fit bg-white shadow rounded-xl p-6 m-6">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <ul className="space-y-2">
            {categories.map((cat, i) => (
              <li key={i}>
                <button
                  onClick={() => setCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${
                    category === cat ? "bg-black text-white" : "hover:bg-gray-100"
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <main className="flex-1 px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow hover:shadow-2xl transition transform hover:-translate-y-1"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-t-xl"
                  />
                  <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:scale-110 transition">
                    <FaRegHeart />
                  </button>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600 mb-4">₹{product.price}</p>
                  <div className="flex gap-3">
                    <button
                      onClick={((e)=>Addtocart(e ,product))}
                      className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800"
                    >
                      Add to Cart
                    </button>
                    <Link
                       onClick={()=>bigger(product.id)}
                      className="flex-1 border py-2 rounded-lg hover:bg-gray-100 text-center"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>


      <footer className="bg-black text-gray-300 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">SoleMate</h2>
            <p className="text-sm">
              Step into style with SoleMate – where comfort meets fashion in every step.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
            <ul className="grid gap-2 text-sm">
              <Link to="/" className="hover:text-white">Home</Link>
              <li className="hover:text-white">Shop</li>
              <li className="hover:text-white">Collections</li>
              <Link to="/contact" className="hover:text-white">Contact</Link>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Customer Service</h3>
            <ul className="grid gap-2 text-sm">
        {user ? (<Link to="/chat" className="hover:text-white">FAQ</Link>) : (<Link to="/login" className="hover:text-white">FAQ</Link>) }
              <li className="hover:text-white">Returns</li> 
              <li className="hover:text-white">Shipping</li>
              <li className="hover:text-white">Order Tracking</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
            <div className="flex space-x-4 text-xl">
              <a  className="hover:text-white"><FaInstagram /></a>
              <a  className="hover:text-white"><FaFacebook /></a>
              <a  className="hover:text-white"><FaTwitter /></a>
              <a  className="hover:text-white"><FaLinkedin /></a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

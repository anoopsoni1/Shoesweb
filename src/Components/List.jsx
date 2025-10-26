import { FaRegHeart, FaShoppingBag, FaRegUserCircle, FaSearch, FaBars } from "react-icons/fa";
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { clearUser } from "../Feature/Slicetwo";
import { setCart } from "../Feature/slice";
import { HiOutlineLogout } from "react-icons/hi";

export const products = [
  { id: 1, name: "Nike Air Max", price: 1050, image: "./List01.jpg" },
  { id: 2, name: "Nike Air Jordan 1", price: 1299, image: "./List02.jpeg" },
  { id: 3, name: "Nike Air Max Mesh Runner", price: 1599, image: "./List03.jpg" },
  { id: 4, name: "Reebok Classic", price: 1399, image: "./List04.jpg" },
  { id: 5, name: "Jordan 1 Retro", price: 17999, image: "./List05.jpeg" },
  { id: 6, name: "New Balance 574", price: 8999, image: "./List06.jpeg" },
  { id: 18, name: "NB Sneaker", price: 8999, image: "./List18.jpeg", category: "Sneaker" },
];

const routes = { 1: "/one", 2: "/two", 3: "/three", 4: "/four", 5: "/five", 6: "/six", 18: "/eighteen" };

const categories = [
  "All", "Sneaker", "Sportswear", "Dress Shoes", "Casual Shoes", "Boots", "Sandals", "Slippers",
];

export default function List() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  const navigate = useNavigate();

  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showCategories, setShowCategories] = useState(false);

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
      items: [{ id: product.id, name: product.name, price: product.price, quantity: 1 }],
    };
    try {
      const cartdata = await fetch("https://shoesbackend-4.onrender.com/api/v1/user/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartPayload),
      });

      if (!cartdata.ok) throw new Error("Failed to add to cart");
      const data = await cartdata.json();
      toast.success(`${product.name} added successfully`);
      dispatch(setCart(data.items));
    } catch (error) {
      console.error("Add to cart failed", error);
    }
  };

  const bigger = (e) => {
    const path = routes[e];
    if (path) window.location.href = path;
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filtered = products.filter((p) => p.name.toLowerCase().includes(value));
    setSuggestions(filtered.slice(0, 5)); 
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.name);
    setSuggestions([]);
  };

  const filteredProducts = products.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
   
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow">
        <nav className="flex flex-wrap justify-between items-center px-4 sm:px-6 py-3 max-w-7xl mx-auto gap-3">
          <Link to="/" className="text-2xl font-semibold tracking-wide">SoleMate</Link>

      
          <div className="relative w-full sm:w-72 order-3 sm:order-none">
            <div className="flex items-center border rounded-full px-3 py-2 bg-gray-50">
              <FaSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search shoes..."
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>
            {suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 bg-white shadow-lg rounded-lg mt-2 overflow-hidden z-10">
                {suggestions.map((s) => (
                  <li
                    key={s.id}
                    onClick={() => handleSuggestionClick(s)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {s.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex gap-3 items-center">
            <Link to="/cart/:UserId" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <FaShoppingBag />
            </Link>
            {user ? (
              <button
                onClick={handleLogout}
                className="px-2 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
              >
              <HiOutlineLogout />
              </button>
            ) : (
              <Link to="/login" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <FaRegUserCircle />
              </Link>
            )}
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="sm:hidden p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <FaBars />
            </button>
          </div>
        </nav>
      </header>

   
      <div className="flex flex-col sm:flex-row">
        <aside
          className={`${
            showCategories ? "block" : "hidden"
          } sm:block w-full sm:w-56 sticky top-24 bg-white shadow rounded-xl p-6 m-4 sm:m-6 transition-all duration-300`}
        >
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <ul className="grid sm:block sm:space-y-2 gap-2 sm:gap-0 grid-cols-2">
            {categories.map((cat, i) => (
              <li key={i}>
                <button
                  onClick={() => {
                    setCategory(cat);
                    if (window.innerWidth < 640) setShowCategories(false);
                  }}
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
        <main className="flex-1 px-4 sm:px-6 py-6">
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
                      onClick={(e) => Addtocart(e, product)}
                      className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800"
                    >
                      Add to Cart
                    </button>
                    <Link
                      onClick={() => bigger(product.id)}
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
              {user ? (
                <Link to="/chat" className="hover:text-white">FAQ</Link>
              ) : (
                <Link to="/login" className="hover:text-white">FAQ</Link>
              )}
              <li className="hover:text-white">Returns</li>
              <li className="hover:text-white">Shipping</li>
              <li className="hover:text-white">Order Tracking</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
            <div className="flex space-x-4 text-xl">
              <a className="hover:text-white"><FaInstagram /></a>
              <a className="hover:text-white"><FaFacebook /></a>
              <a className="hover:text-white"><FaTwitter /></a>
              <a className="hover:text-white"><FaLinkedin /></a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

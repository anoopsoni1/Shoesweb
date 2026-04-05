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
import {
  shoeImageForProduct,
  shoeImageFallbackForProduct,
} from "../utils/productImages.js";

export const products = [
  {
    id: 1,
    name: "Nike Air Max",
    price: 1050,
    image: shoeImageForProduct(1),
    category: "Sportswear",
  },
  {
    id: 2,
    name: "Nike Air Jordan 1",
    price: 1299,
    image: shoeImageForProduct(2),
    category: "Sneaker",
  },
  {
    id: 3,
    name: "Nike Air Max Mesh Runner",
    price: 1599,
    image: shoeImageForProduct(3),
    category: "Sportswear",
  },
  {
    id: 4,
    name: "Reebok Classic",
    price: 1399,
    image: shoeImageForProduct(4),
    category: "Casual Shoes",
  },
  {
    id: 5,
    name: "Jordan 1 Retro",
    price: 17999,
    image: shoeImageForProduct(5),
    category: "Sneaker",
  },
  {
    id: 6,
    name: "New Balance 574",
    price: 8999,
    image: shoeImageForProduct(6),
    category: "Casual Shoes",
  },
  {
    id: 7,
    name: "Adidas Ultraboost Light",
    price: 16999,
    image: shoeImageForProduct(7),
    category: "Sportswear",
  },
  {
    id: 8,
    name: "Puma RS-X Bold",
    price: 8499,
    image: shoeImageForProduct(8),
    category: "Sneaker",
  },
  {
    id: 9,
    name: "Asics Gel-Kayano Trail",
    price: 14299,
    image: shoeImageForProduct(9),
    category: "Sportswear",
  },
  {
    id: 10,
    name: "Converse Chuck 70 High",
    price: 6499,
    image: shoeImageForProduct(10),
    category: "Casual Shoes",
  },
  {
    id: 11,
    name: "Vans Old Skool Pro",
    price: 5999,
    image: shoeImageForProduct(11),
    category: "Sneaker",
  },
  {
    id: 12,
    name: "Brooks Ghost Max",
    price: 13499,
    image: shoeImageForProduct(12),
    category: "Sportswear",
  },
  {
    id: 13,
    name: "Hoka Clifton 9",
    price: 14999,
    image: shoeImageForProduct(13),
    category: "Sportswear",
  },
  {
    id: 14,
    name: "Clarks Desert Boot",
    price: 9999,
    image: shoeImageForProduct(14),
    category: "Boots",
  },
  {
    id: 15,
    name: "Cole Haan Grand Wingtip",
    price: 18999,
    image: shoeImageForProduct(15),
    category: "Dress Shoes",
  },
  {
    id: 16,
    name: "Birkenstock Arizona EVA",
    price: 4999,
    image: shoeImageForProduct(16),
    category: "Sandals",
  },
  {
    id: 17,
    name: "Crocs Classic Clog",
    price: 3499,
    image: shoeImageForProduct(17),
    category: "Slippers",
  },
  {
    id: 18,
    name: "NB Fresh Foam X",
    price: 11299,
    image: shoeImageForProduct(18),
    category: "Sneaker",
  },
  {
    id: 19,
    name: "Skechers Go Walk Arch",
    price: 6999,
    image: "https://images.unsplash.com/photo-1560762484-813fc976a56e?q=80&w=2070&auto=format&fit=crby1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Casual Shoes",
  },
  {
    id: 20,
    name: "Under Armour HOVR Phantom",
    price: 12499,
    image: shoeImageForProduct(20),
    category: "Sportswear",
  },
  {
    id: 21,
    name: "Salomon XT-6 GTX",
    price: 16499,
    image: shoeImageForProduct(21),
    category: "Sportswear",
  },
];

export const productRoutes = {
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

const routes = productRoutes;

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
    if (!user?._id) {
      toast.error("Please log in to add items to your cart");
      return;
    }
    const cartPayload = {
      userId: user._id,
      items: [
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image ?? "",
        },
      ],
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

          <div className="flex gap-3 items-center ">
             {user ? ( <Link to="/cart" className=" px-2 py-2 rounded-xl bg-gray-100 text-black">
                <FaShoppingBag />
              </Link>) : (<Link className=" px-2 py-2 rounded-xl text-black bg-gray-100 " to="/Cart">
                   <FaShoppingBag />
              </Link>)}
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
                    className="w-full h-64 object-cover rounded-t-xl bg-gray-100"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      const fb = shoeImageFallbackForProduct(product.id);
                      if (e.currentTarget.src !== fb) {
                        e.currentTarget.src = fb;
                      }
                    }}
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
                      to={routes[product.id] ?? "/list"}
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

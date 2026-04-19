import { useEffect, useMemo, useState } from "react";
import {
  FaRegHeart,
  FaHeart,
  FaSearch,
  FaBars,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaRegStar,
  FaStar,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector, useStore } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { clearUser } from "../Feature/Slicetwo";
import { addLineToCart } from "../utils/addToCart.js";
import {
  shoeImageFallbackForProduct,
  shoeImageForProduct,
} from "../utils/productImages";
import { useTheme } from "../context/ThemeContext";
import SiteHeader from "./SiteHeader.jsx";

const API_USER = "https://shoesbackend-4.onrender.com/api/v1/user";
const WISHLIST_STORAGE = "solemate_wishlist";
const REVIEWS_STORAGE = "solemate_reviews";

export const products = [
  { id: 1, name: "Nike Air Max", price: 1050, image: shoeImageForProduct(1), category: "men", type: "Sportswear", popularity: 84, releasedAt: "2026-03-09" },
  { id: 2, name: "Nike Air Jordan 1", price: 1299, image: shoeImageForProduct(2), category: "men", type: "Sneaker", popularity: 92, releasedAt: "2026-01-11" },
  { id: 3, name: "Nike Air Max Mesh Runner", price: 1599, image: shoeImageForProduct(3), category: "women", type: "Sportswear", popularity: 79, releasedAt: "2026-04-10" },
  { id: 4, name: "Reebok Classic", price: 1399, image: shoeImageForProduct(4), category: "women", type: "Casual Shoes", popularity: 68, releasedAt: "2025-11-17" },
  { id: 5, name: "Jordan 1 Retro", price: 17999, image: shoeImageForProduct(5), category: "men", type: "Sneaker", popularity: 97, releasedAt: "2025-12-20" },
  { id: 6, name: "New Balance 574", price: 8999, image: shoeImageForProduct(6), category: "unisex", type: "Casual Shoes", popularity: 81, releasedAt: "2026-02-03" },
  { id: 7, name: "Adidas Ultraboost Light", price: 16999, image: shoeImageForProduct(7), category: "men", type: "Sportswear", popularity: 89, releasedAt: "2026-03-30" },
  { id: 8, name: "Puma RS-X Bold", price: 8499, image: shoeImageForProduct(8), category: "women", type: "Sneaker", popularity: 73, releasedAt: "2026-02-26" },
  { id: 9, name: "Asics Gel-Kayano Trail", price: 14299, image: shoeImageForProduct(9), category: "unisex", type: "Sportswear", popularity: 85, releasedAt: "2025-10-15" },
  { id: 10, name: "Converse Chuck 70 High", price: 6499, image: shoeImageForProduct(10), category: "unisex", type: "Casual Shoes", popularity: 77, releasedAt: "2025-09-08" },
  { id: 11, name: "Vans Old Skool Pro", price: 5999, image: shoeImageForProduct(11), category: "women", type: "Sneaker", popularity: 71, releasedAt: "2025-12-04" },
  { id: 12, name: "Brooks Ghost Max", price: 13499, image: shoeImageForProduct(12), category: "men", type: "Sportswear", popularity: 80, releasedAt: "2026-04-03" },
  { id: 13, name: "Hoka Clifton 9", price: 14999, image: shoeImageForProduct(13), category: "women", type: "Sportswear", popularity: 86, releasedAt: "2026-01-24" },
  { id: 14, name: "Clarks Desert Boot", price: 9999, image: shoeImageForProduct(14), category: "men", type: "Boots", popularity: 66, releasedAt: "2025-11-21" },
  { id: 15, name: "Cole Haan Grand Wingtip", price: 18999, image: shoeImageForProduct(15), category: "men", type: "Dress Shoes", popularity: 64, releasedAt: "2025-10-28" },
  { id: 16, name: "Birkenstock Arizona EVA", price: 4999, image: shoeImageForProduct(16), category: "women", type: "Sandals", popularity: 76, releasedAt: "2026-03-18" },
  { id: 17, name: "Crocs Classic Clog", price: 3499, image: shoeImageForProduct(17), category: "unisex", type: "Slippers", popularity: 82, releasedAt: "2025-09-30" },
  { id: 18, name: "NB Fresh Foam X", price: 11299, image: shoeImageForProduct(18), category: "women", type: "Sneaker", popularity: 74, releasedAt: "2026-04-08" },
  { id: 19, name: "Skechers Go Walk Arch", price: 6999, image: "https://images.unsplash.com/photo-1560762484-813fc976a56e?q=80&w=2070&auto=format&fit=crop", category: "women", type: "Casual Shoes", popularity: 72, releasedAt: "2026-02-01" },
  { id: 20, name: "Under Armour HOVR Phantom", price: 12499, image: shoeImageForProduct(20), category: "men", type: "Sportswear", popularity: 88, releasedAt: "2026-03-25" },
  { id: 21, name: "Salomon XT-6 GTX", price: 16499, image: shoeImageForProduct(21), category: "unisex", type: "Sportswear", popularity: 91, releasedAt: "2026-04-14" },
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

const genderTabs = [
  { label: "All", value: "all" },
  { label: "Men", value: "men" },
  { label: "Women", value: "women" },
];

const sortingOptions = [
  { value: "popular", label: "Popular" },
  { value: "newest", label: "Newest" },
  { value: "priceAsc", label: "Price: Low to High" },
  { value: "priceDesc", label: "Price: High to Low" },
];

const loadFromStorage = (key, fallback) => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "");
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const seedReviewData = () => ({
  1: [{ name: "Rahul", rating: 5, comment: "Great comfort for daily wear.", createdAt: new Date().toISOString() }],
  7: [{ name: "Aditi", rating: 4, comment: "Very responsive sole and premium look.", createdAt: new Date().toISOString() }],
  21: [{ name: "Karan", rating: 5, comment: "Excellent grip and quality.", createdAt: new Date().toISOString() }],
});

export default function List() {
  const dispatch = useDispatch();
  const store = useStore();
  const user = useSelector((state) => state.user.userData);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [gender, setGender] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(
    Math.max(...products.map((item) => item.price))
  );
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const [reviewMap, setReviewMap] = useState({});
  const [reviewingProductId, setReviewingProductId] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 5,
    comment: "",
  });

  const availableMaxPrice = useMemo(
    () => Math.max(...products.map((item) => item.price)),
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingProducts(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setWishlistIds(loadFromStorage(WISHLIST_STORAGE, []));
    const storedReviews = loadFromStorage(REVIEWS_STORAGE, null);
    if (storedReviews) {
      setReviewMap(storedReviews);
    } else {
      const seeded = seedReviewData();
      setReviewMap(seeded);
      localStorage.setItem(REVIEWS_STORAGE, JSON.stringify(seeded));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_USER}/logout`,
        {},
        { withCredentials: true }
      );
      dispatch(clearUser());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const Addtocart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const result = await addLineToCart({
        product,
        user,
        dispatch,
        getState: store.getState,
      });
      if (result.ok) {
        toast.success(`${product.name} added to cart`);
      } else {
        toast.error(result.message || "Could not add to cart");
      }
    } catch (error) {
      console.error("Add to cart failed", error);
      toast.error("Network error. Please try again.");
    }
  };

  const suggestions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return [];
    return products
      .filter((product) => product.name.toLowerCase().includes(query))
      .slice(0, 5);
  }, [searchTerm]);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesGender =
          gender === "all" ||
          product.category === gender ||
          product.category === "unisex";
        const matchesSearch = product.name
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase());
        const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
        const matchesWishlist = !showWishlistOnly || wishlistIds.includes(product.id);
        return matchesGender && matchesSearch && matchesPrice && matchesWishlist;
      }),
    [gender, maxPrice, minPrice, searchTerm, showWishlistOnly, wishlistIds]
  );

  const sortedProducts = useMemo(() => {
    const copy = [...filteredProducts];
    copy.sort((a, b) => {
      if (sortBy === "priceAsc") return a.price - b.price;
      if (sortBy === "priceDesc") return b.price - a.price;
      if (sortBy === "newest") {
        return new Date(b.releasedAt).getTime() - new Date(a.releasedAt).getTime();
      }
      return b.popularity - a.popularity;
    });
    return copy;
  }, [filteredProducts, sortBy]);

  const toggleWishlist = (productId) => {
    const next = wishlistIds.includes(productId)
      ? wishlistIds.filter((id) => id !== productId)
      : [...wishlistIds, productId];
    setWishlistIds(next);
    localStorage.setItem(WISHLIST_STORAGE, JSON.stringify(next));
  };

  const getReviewStats = (productId) => {
    const list = reviewMap[String(productId)] || [];
    if (!list.length) return { average: 0, total: 0 };
    const sum = list.reduce((acc, item) => acc + Number(item.rating || 0), 0);
    return { average: sum / list.length, total: list.length };
  };

  const handleReviewSubmit = (event) => {
    event.preventDefault();
    if (!reviewingProductId) return;

    const trimmed = reviewForm.comment.trim();
    if (!trimmed) {
      toast.error("Please enter a review comment.");
      return;
    }

    const payload = {
      name: reviewForm.name.trim() || "Anonymous",
      rating: Number(reviewForm.rating),
      comment: trimmed,
      createdAt: new Date().toISOString(),
    };

    const key = String(reviewingProductId);
    const nextMap = {
      ...reviewMap,
      [key]: [payload, ...(reviewMap[key] || [])].slice(0, 8),
    };
    setReviewMap(nextMap);
    localStorage.setItem(REVIEWS_STORAGE, JSON.stringify(nextMap));
    setReviewForm({ name: "", rating: 5, comment: "" });
    setReviewingProductId(null);
    toast.success("Review added.");
  };

  const reviewingProduct = products.find((product) => product.id === reviewingProductId);

  const pageTheme = isDark
    ? "bg-slate-950 text-slate-100"
    : "bg-slate-50 text-slate-900";
  const cardTheme = isDark
    ? "bg-slate-900 border-slate-800 text-slate-100"
    : "bg-white border-gray-100 text-gray-900";
  const mutedText = isDark ? "text-slate-400" : "text-gray-500";

  return (
    <>
    <div className={`min-h-screen ${pageTheme}`}>
      <SiteHeader
        onLogout={handleLogout}
        middleSlot={
          <div className="relative w-full sm:w-72">
            <div
              className={`flex items-center border rounded-full px-3 py-2 ${
                isDark ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-200"
              }`}
            >
              <FaSearch
                className={`${isDark ? "text-slate-400" : "text-gray-400"} mr-2 shrink-0`}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search shoes..."
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>
            {suggestions.length > 0 && (
              <ul
                className={`absolute left-0 right-0 shadow-lg rounded-lg mt-2 overflow-hidden z-[60] ${
                  isDark ? "bg-slate-900 border border-slate-700" : "bg-white border border-gray-100"
                }`}
              >
                {suggestions.map((s) => (
                  <li
                    key={s.id}
                    onClick={() => setSearchTerm(s.name)}
                    className={`px-4 py-2 cursor-pointer text-sm ${
                      isDark ? "hover:bg-slate-800" : "hover:bg-gray-100"
                    }`}
                  >
                    {s.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        }
        extraActions={
          <button
            type="button"
            onClick={() => setShowCategories(!showCategories)}
            className={`sm:hidden p-2 rounded-full ${
              isDark
                ? "bg-slate-800 hover:bg-slate-700 text-slate-200"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
            aria-label="Toggle categories"
          >
            <FaBars />
          </button>
        }
      />

   
      <div className="flex flex-col sm:flex-row">
        <aside
          className={`${
            showCategories ? "block" : "hidden"
          } sm:block w-full sm:w-56 sticky top-24 shadow rounded-xl p-6 m-4 sm:m-6 transition-all duration-300 border ${cardTheme}`}
        >
          <h2 className="text-lg font-semibold mb-4">Shop by Gender</h2>
          <div className="space-y-2">
            {genderTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setGender(tab.value);
                  if (window.innerWidth < 640) setShowCategories(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg transition ${
                  gender === tab.value
                    ? "bg-black text-white"
                    : isDark
                    ? "hover:bg-slate-800"
                    : "hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <h3 className="text-base font-semibold mt-6 mb-3">Price Range</h3>
          <div className="space-y-3">
            <div>
              <label className={`text-xs ${mutedText}`}>Min: ₹{minPrice}</label>
              <input
                type="range"
                min={0}
                max={availableMaxPrice}
                value={minPrice}
                onChange={(e) =>
                  setMinPrice(Math.min(Number(e.target.value), maxPrice))
                }
                className="w-full"
              />
            </div>
            <div>
              <label className={`text-xs ${mutedText}`}>Max: ₹{maxPrice}</label>
              <input
                type="range"
                min={0}
                max={availableMaxPrice}
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(Math.max(Number(e.target.value), minPrice))
                }
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) =>
                  setMinPrice(Math.max(0, Math.min(Number(e.target.value) || 0, maxPrice)))
                }
                className={`w-full rounded-md border px-2 py-1 text-sm bg-transparent ${isDark ? "border-slate-700" : ""}`}
                placeholder="Min"
              />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(
                    Math.min(
                      availableMaxPrice,
                      Math.max(Number(e.target.value) || 0, minPrice)
                    )
                  )
                }
                className={`w-full rounded-md border px-2 py-1 text-sm bg-transparent ${isDark ? "border-slate-700" : ""}`}
                placeholder="Max"
              />
            </div>
          </div>

          <h3 className="text-base font-semibold mt-6 mb-3">Wishlist</h3>
          <button
            onClick={() => setShowWishlistOnly((prev) => !prev)}
            className={`w-full px-3 py-2 rounded-lg text-left ${
              showWishlistOnly ? "bg-pink-600 text-white" : isDark ? "bg-slate-800" : "bg-pink-50 text-pink-700"
            }`}
          >
            {showWishlistOnly ? "Showing wishlist only" : `Show wishlist (${wishlistIds.length})`}
          </button>
        </aside>
        <main className="flex-1 px-4 sm:px-6 py-6">
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className={`text-sm ${mutedText}`}>
              Showing {sortedProducts.length} products
            </p>
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`rounded-lg px-3 py-2 text-sm border ${isDark ? "bg-slate-900 border-slate-700" : "bg-white"}`}
              >
                {sortingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            <p className={`text-sm ${mutedText}`}>
              Sections: Boys / Men and Girls / Women
            </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {isLoadingProducts
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className={`rounded-2xl border p-4 shadow-sm ${cardTheme}`}>
                    <div className="h-56 w-full animate-pulse rounded-xl bg-gray-200" />
                    <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                    <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-gray-200" />
                    <div className="mt-4 h-10 w-full animate-pulse rounded bg-gray-200" />
                  </div>
                ))
              : sortedProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`group rounded-2xl shadow-sm border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${cardTheme}`}
                  >
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover rounded-t-2xl bg-gray-100"
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
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className={`absolute top-3 right-3 p-2 rounded-full shadow-sm group-hover:scale-110 transition ${isDark ? "bg-slate-800/90" : "bg-white/90"}`}
                      >
                        {wishlistIds.includes(product.id) ? (
                          <FaHeart className="text-pink-500" />
                        ) : (
                          <FaRegHeart />
                        )}
                      </button>
                    </div>
                    <div className="p-5">
                      <p className={`text-xs uppercase tracking-wider mb-1 ${mutedText}`}>
                        {product.category}
                      </p>
                      <h3 className="text-lg font-semibold min-h-14">{product.name}</h3>
                      <p className={`${mutedText} mb-2`}>₹{product.price}</p>
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, index) => {
                            const rating = getReviewStats(product.id).average;
                            return index < Math.round(rating) ? (
                              <FaStar key={index} className="text-amber-400 text-xs" />
                            ) : (
                              <FaRegStar key={index} className="text-amber-400 text-xs" />
                            );
                          })}
                          <span className={`text-xs ${mutedText}`}>
                            ({getReviewStats(product.id).total})
                          </span>
                        </div>
                        <button
                          onClick={() => setReviewingProductId(product.id)}
                          className={`text-xs underline ${isDark ? "text-slate-300" : "text-gray-700"}`}
                        >
                          Write review
                        </button>
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={(e) => Addtocart(e, product)}
                          className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                        >
                          Add to Cart
                        </button>
                        <Link
                          to={productRoutes[product.id] ?? "/list"}
                          className={`flex-1 border py-2 rounded-lg text-center transition ${isDark ? "hover:bg-slate-800 border-slate-700" : "hover:bg-gray-100"}`}
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
          {!isLoadingProducts && sortedProducts.length === 0 && (
            <div className={`rounded-xl border border-dashed p-8 text-center mt-8 ${mutedText}`}>
              No products match the selected filters.
            </div>
          )}
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
              <Link to="/faq" className="hover:text-white">
                FAQ
              </Link>
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
      {reviewingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl ${cardTheme}`}>
            <h3 className="text-xl font-semibold mb-1">Review {reviewingProduct.name}</h3>
            <p className={`text-sm mb-4 ${mutedText}`}>Share your experience with other shoppers.</p>
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Your name"
                value={reviewForm.name}
                onChange={(e) => setReviewForm((prev) => ({ ...prev, name: e.target.value }))}
                className={`w-full rounded-lg border px-3 py-2 bg-transparent ${isDark ? "border-slate-700" : ""}`}
              />
              <select
                value={reviewForm.rating}
                onChange={(e) =>
                  setReviewForm((prev) => ({ ...prev, rating: Number(e.target.value) }))
                }
                className={`w-full rounded-lg border px-3 py-2 bg-transparent ${isDark ? "border-slate-700" : ""}`}
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} Star{rating > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
              <textarea
                rows={4}
                placeholder="Write your review"
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm((prev) => ({ ...prev, comment: e.target.value }))
                }
                className={`w-full rounded-lg border px-3 py-2 bg-transparent ${isDark ? "border-slate-700" : ""}`}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewingProductId(null)}
                  className={`px-4 py-2 rounded-lg border ${isDark ? "border-slate-700" : ""}`}
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-black text-white">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </>
  );
}

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector, useStore } from "react-redux";
import axios from "axios";
import { Heart, ShoppingBag, Trash2, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import SiteHeader from "./SiteHeader.jsx";
import {
  products,
  productRoutes,
  WISHLIST_STORAGE,
  WISHLIST_CHANGED_EVENT,
} from "./List.jsx";
import { addLineToCart } from "../utils/addToCart.js";
import { clearUser } from "../Feature/Slicetwo.jsx";
import { clearCart } from "../Feature/slice.jsx";
import { clearCheckoutData } from "../Feature/Slicethree.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import {
  resolveCartItemImage,
  CART_IMAGE_FALLBACK,
} from "../utils/cartImage.js";

const API_USER = "https://shoesbackend-4.onrender.com/api/v1/user";

function loadWishlistIds() {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(Number).filter(Boolean) : [];
  } catch {
    return [];
  }
}

export default function Wishlist() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const store = useStore();
  const user = useSelector((s) => s.user.userData);
  const [ids, setIds] = useState(loadWishlistIds);

  const refresh = useCallback(() => setIds(loadWishlistIds()), []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === WISHLIST_STORAGE || e.key === null) refresh();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(WISHLIST_CHANGED_EVENT, refresh);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(WISHLIST_CHANGED_EVENT, refresh);
    };
  }, [refresh]);

  useEffect(() => {
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);

  const likedProducts = useMemo(
    () => products.filter((p) => ids.includes(p.id)),
    [ids]
  );

  const removeFromWishlist = (productId) => {
    const next = ids.filter((id) => id !== productId);
    setIds(next);
    try {
      localStorage.setItem(WISHLIST_STORAGE, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(WISHLIST_CHANGED_EVENT));
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_USER}/logout`, {}, { withCredentials: true });
    } catch {
      /* still sign out locally */
    }
    dispatch(clearUser());
    dispatch(clearCart());
    dispatch(clearCheckoutData());
    navigate("/login");
  };

  const handleAddToCart = async (product) => {
    const result = await addLineToCart({
      product,
      user,
      dispatch,
      getState: store.getState,
    });
    if (result.ok) {
      toast.success(user?._id ? "Added to your cart" : "Added to cart (saved on this device)");
    } else {
      toast.error(result.message || "Could not add to cart");
    }
  };

  const shell = isDark ? "min-h-screen bg-zinc-950 text-zinc-100" : "min-h-screen bg-zinc-100 text-zinc-900";
  const card = isDark
    ? "rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-lg"
    : "rounded-2xl border border-zinc-200 bg-white shadow-md";

  return (
    <div className={shell}>
      <SiteHeader onLogout={handleLogout} maxWidthClass="max-w-5xl" />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden />
          <Link to="/list" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Shop
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden />
          <span className="text-zinc-800 dark:text-zinc-200">Wishlist</span>
        </nav>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-600 dark:text-pink-400">
              Saved
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
              Liked shoes
            </h1>
            <p className="mt-2 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
              Items you heart on the shop page show up here. Wishlist is stored on this
              browser until you clear it.
            </p>
          </div>
          <Link
            to="/list"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow transition hover:bg-indigo-500"
          >
            Continue shopping
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        {likedProducts.length === 0 ? (
          <div className={`flex flex-col items-center justify-center px-6 py-20 text-center ${card}`}>
            <Heart className="mb-4 h-14 w-14 text-pink-500/80" strokeWidth={1.25} aria-hidden />
            <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Nothing saved yet</p>
            <p className="mt-2 max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
              Tap the heart on any product in the shop to add it to your wishlist.
            </p>
            <Link
              to="/list"
              className="mt-6 inline-flex rounded-xl bg-pink-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-pink-500"
            >
              Browse shop
            </Link>
          </div>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2">
            {likedProducts.map((product) => (
              <li key={product.id} className={`overflow-hidden ${card}`}>
                <div className="flex gap-4 p-4 sm:p-5">
                  <Link
                    to={productRoutes[product.id] ?? "/list"}
                    className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800"
                  >
                    <img
                      src={resolveCartItemImage(product.image, product.id)}
                      alt={product.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = CART_IMAGE_FALLBACK;
                      }}
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      to={productRoutes[product.id] ?? "/list"}
                      className="font-semibold text-zinc-900 hover:text-indigo-600 dark:text-zinc-50 dark:hover:text-indigo-400"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      ₹{Number(product.price).toLocaleString("en-IN")} · {product.category}
                    </p>
                    <div className="mt-auto flex flex-wrap gap-2 pt-4">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-500 sm:text-sm"
                      >
                        <ShoppingBag className="h-4 w-4" aria-hidden />
                        Add to cart
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(product.id)}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold sm:text-sm ${
                          isDark
                            ? "border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                            : "border-zinc-300 text-zinc-700 hover:bg-zinc-50"
                        }`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../Feature/slice.jsx";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import SiteHeader from "./SiteHeader.jsx";
import {
  setCheckoutData,
  clearCheckoutData,
  ADDRESS_CONFIRMED_KEY,
} from "../Feature/Slicethree.jsx";
import { clearUser } from "../Feature/Slicetwo.jsx";
import axios from "axios";
import { useEffect } from "react";
import { setCart, setCartItemQuantity } from "../Feature/slice.jsx";
import {
  resolveCartItemImage,
  CART_IMAGE_FALLBACK,
} from "../utils/cartImage.js";
import { useTheme } from "../context/ThemeContext.jsx";

const API_USER = "https://shoesbackend-4.onrender.com/api/v1/user";

function Cart() {
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  const payal = useNavigate();

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
    (total, item) =>
      total + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );

  useEffect(() => {
    const getCart = async () => {
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

    if (user?._id) getCart();
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
    } catch {
      /* still sign out locally */
    }
    dispatch(clearUser());
    dispatch(clearCart());
    dispatch(clearCheckoutData());
    payal("/login");
  };

  const shell = isDark ? "min-h-screen bg-zinc-950 text-zinc-100" : "min-h-screen bg-zinc-100 text-zinc-900";
  const panel = isDark
    ? "rounded-2xl border border-zinc-800 bg-zinc-900/95 shadow-xl shadow-black/30"
    : "rounded-2xl border border-zinc-200 bg-white shadow-lg shadow-zinc-200/50";
  const row = isDark
    ? "rounded-xl border border-zinc-800 bg-zinc-800/50 p-4"
    : "rounded-xl border border-zinc-200 bg-zinc-50 p-4";
  const guestBanner = isDark
    ? "rounded-xl border border-amber-900/50 bg-amber-950/30 px-4 py-3 text-sm text-amber-100"
    : "rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950";

  return (
    <div className={shell}>
      <SiteHeader onLogout={handleLogout} maxWidthClass="max-w-5xl" />

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        {!user?._id ? (
          <div className={`mb-6 ${guestBanner}`}>
            <span className="font-semibold">Browsing as a guest.</span> Your bag is saved on
            this device.{" "}
            <Link to="/login" className="font-bold text-indigo-600 underline dark:text-indigo-400">
              Sign in
            </Link>{" "}
            to sync it to your account (we merge your guest items when you log in).
          </div>
        ) : null}

        <div className={`p-5 sm:p-8 ${panel}`}>
          <div className="mb-6 flex items-center gap-2">
            <ShoppingCart className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">My cart</h2>
          </div>

          {cart.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-zinc-600 dark:text-zinc-400">Your cart is empty.</p>
              <Link
                to="/list"
                className="mt-4 inline-block text-sm font-bold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Browse the shop
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item, rowIndex) => (
                <div
                  key={cartItemKey(item) || `cart-row-${rowIndex}`}
                  className={row}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={resolveCartItemImage(
                          item.image,
                          item.id ?? item._id
                        )}
                        alt={item.name}
                        className="h-16 w-16 rounded-lg border border-zinc-200 bg-zinc-100 object-cover dark:border-zinc-700 dark:bg-zinc-900"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = CART_IMAGE_FALLBACK;
                        }}
                      />
                      <div>
                        <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                          {item.name}
                        </p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          ₹{Number(item.price).toLocaleString("en-IN")} each
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => handleDecrease(e, item)}
                          className="rounded-full bg-red-100 p-2 text-red-600 transition hover:bg-red-200 dark:bg-red-950/60 dark:text-red-300 dark:hover:bg-red-900/50"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-[2ch] px-2 text-center font-semibold text-zinc-900 dark:text-zinc-100">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => increaseQuantity(e, item)}
                          className="rounded-full bg-emerald-100 p-2 text-emerald-700 transition hover:bg-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-900/40"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                          ₹
                          {(
                            (Number(item.price) || 0) * (Number(item.quantity) || 0)
                          ).toLocaleString("en-IN")}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleRemove(cartItemKey(item))}
                          className="rounded-full border border-red-200 bg-white p-2 text-red-600 transition hover:bg-red-50 dark:border-red-900/60 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-red-950/40"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cart.length > 0 && (
            <div className="mt-8 flex flex-col items-stretch gap-4 border-t border-zinc-200 pt-6 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                Subtotal: ₹{subtotal.toLocaleString("en-IN")}
              </h3>
              <button
                type="button"
                onClick={handlecheckout}
                className="rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white shadow-md transition hover:bg-indigo-500"
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;

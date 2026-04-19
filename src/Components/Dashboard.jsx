import { useEffect, useState, useMemo } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  LayoutGrid,
  ShoppingBag,
  Package,
  Phone,
  MessageCircle,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  Loader2,
  UserRound,
} from "lucide-react";
import { clearUser, setUser } from "../Feature/Slicetwo.jsx";
import { clearCart } from "../Feature/slice.jsx";
import { clearCheckoutData } from "../Feature/Slicethree.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const API_USER = "https://shoesbackend-4.onrender.com/api/v1/user";

function userInitials(user) {
  const a = (user?.FirstName || "").trim().slice(0, 1);
  const b = (user?.LastName || "").trim().slice(0, 1);
  if (a || b) return (a + b).toUpperCase();
  const email = (user?.email || "").trim();
  return email ? email.slice(0, 1).toUpperCase() : "?";
}

const navItems = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Browse shop", icon: LayoutGrid, path: "/list" },
  { label: "Cart", icon: ShoppingBag, path: "/cart" },
  { label: "Orders", icon: Package, path: "/orders" },
  { label: "Contact", icon: Phone, path: "/contact" },
  { label: "Help & chat", icon: MessageCircle, path: "/chat" },
];

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const user = useSelector((state) => state.user.userData);
  const cartItems = useSelector((state) => state.cart?.cartitem ?? []);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileReady, setProfileReady] = useState(false);

  const cartCount = useMemo(
    () => cartItems.reduce((n, i) => n + (Number(i.quantity) || 0), 0),
    [cartItems]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`${API_USER}/profile`, { withCredentials: true });
        if (!cancelled && res.data?.user) dispatch(setUser(res.data.user));
      } catch (e) {
        if (!cancelled && e?.response?.status === 401) dispatch(clearUser());
      } finally {
        if (!cancelled) setProfileReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

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

  const shell = isDark
    ? "bg-zinc-950 text-zinc-100"
    : "bg-gradient-to-br from-zinc-100 via-slate-50 to-zinc-200 text-zinc-900";

  const sidebarShell = isDark
    ? "border-zinc-800 bg-zinc-900/95 shadow-xl shadow-black/40"
    : "border-zinc-200/80 bg-white/95 shadow-lg shadow-zinc-300/40";

  const linkBase = isDark
    ? "text-zinc-300 hover:bg-zinc-800 hover:text-white"
    : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900";

  const linkActive = isDark
    ? "bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-500/40"
    : "bg-indigo-50 text-indigo-800 ring-1 ring-indigo-200";

  const afterNav = () => setSidebarOpen(false);

  const NavBlock = ({ onNavigate }) => (
    <nav className="flex flex-col gap-1" aria-label="Account">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === "/"}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${linkBase} ${
              isActive ? linkActive : ""
            }`
          }
        >
          <item.icon className="h-[18px] w-[18px] shrink-0 opacity-90" aria-hidden />
          {item.label}
          <ChevronRight className="ml-auto h-4 w-4 opacity-40" aria-hidden />
        </NavLink>
      ))}
    </nav>
  );

  const UserBlock = () => (
    <div
      className={`mb-6 flex items-center gap-4 rounded-2xl border p-4 ${
        isDark ? "border-zinc-700 bg-zinc-800/60" : "border-zinc-200 bg-zinc-50"
      }`}
    >
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold ${
          isDark
            ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white"
            : "bg-gradient-to-br from-indigo-600 to-violet-600 text-white"
        }`}
        aria-hidden
      >
        {userInitials(user)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold leading-tight text-zinc-900 dark:text-zinc-50">
          {user?.FirstName} {user?.LastName}
        </p>
        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{user?.email}</p>
      </div>
    </div>
  );

  if (!profileReady) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center ${shell}`}
        role="status"
        aria-label="Loading dashboard"
      >
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`flex min-h-screen flex-col items-center justify-center px-6 ${shell}`}>
        <div
          className={`max-w-md rounded-3xl border p-10 text-center ${
            isDark ? "border-zinc-800 bg-zinc-900" : "border-zinc-200 bg-white shadow-xl"
          }`}
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
            <UserRound className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Sign in required</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Log in to view your account, orders, and saved cart.
          </p>
          <Link
            to="/login"
            className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-500"
          >
            Go to login
          </Link>
          <Link
            to="/"
            className="mt-3 inline-block text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${shell}`}>
      <header
        className={`fixed left-0 right-0 top-0 z-30 flex items-center justify-between border-b px-4 py-3 backdrop-blur-md md:hidden ${
          isDark ? "border-zinc-800 bg-zinc-900/90" : "border-zinc-200 bg-white/90"
        }`}
      >
        <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
          SoleMate
        </span>
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className={`rounded-xl p-2.5 ${isDark ? "hover:bg-zinc-800" : "hover:bg-zinc-100"}`}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      <div className="flex min-h-screen pt-[52px] md:pt-0">
        <aside
          className={`sticky top-0 hidden h-screen w-[280px] shrink-0 flex-col border-r p-6 md:flex ${sidebarShell}`}
        >
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
            Account
          </p>
          <UserBlock />
          <NavBlock />
          <button
            type="button"
            onClick={handleLogout}
            className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-red-500"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </aside>

        <AnimatePresence>
          {sidebarOpen ? (
            <>
              <motion.button
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 cursor-default bg-black/60 backdrop-blur-sm md:hidden"
                aria-label="Close menu"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 320 }}
                className={`fixed bottom-0 left-0 top-0 z-50 flex w-[min(88vw,300px)] flex-col border-r p-6 md:hidden ${sidebarShell}`}
              >
                <div className="mb-4 flex justify-end">
                  <button
                    type="button"
                    onClick={afterNav}
                    className={`rounded-xl p-2 ${isDark ? "hover:bg-zinc-800" : "hover:bg-zinc-100"}`}
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <UserBlock />
                <NavBlock onNavigate={afterNav} />
                <button
                  type="button"
                  onClick={() => {
                    afterNav();
                    handleLogout();
                  }}
                  className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-red-500"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </motion.aside>
            </>
          ) : null}
        </AnimatePresence>

        <main className="flex-1 px-4 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-3xl space-y-8">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                Welcome back
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                Hi, {user?.FirstName || "there"}
              </h1>
              <p className="mt-2 max-w-xl text-zinc-600 dark:text-zinc-400">
                Pick up where you left off—track orders, manage your cart, or explore new
                drops in the shop.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                to="/list"
                className={`group flex flex-col rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:shadow-lg ${
                  isDark
                    ? "border-zinc-800 bg-zinc-900 hover:border-indigo-500/50"
                    : "border-zinc-200 bg-white hover:border-indigo-300"
                }`}
              >
                <LayoutGrid className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <span className="mt-3 font-bold text-zinc-900 dark:text-white">Browse products</span>
                <span className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  See the full catalog and add favourites to your cart.
                </span>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  Go to shop
                  <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>

              <Link
                to="/orders"
                className={`group flex flex-col rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:shadow-lg ${
                  isDark
                    ? "border-zinc-800 bg-zinc-900 hover:border-indigo-500/50"
                    : "border-zinc-200 bg-white hover:border-indigo-300"
                }`}
              >
                <Package className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <span className="mt-3 font-bold text-zinc-900 dark:text-white">Your orders</span>
                <span className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  View order history and delivery details.
                </span>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  View orders
                  <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>

              <Link
                to="/cart"
                className={`group flex flex-col rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:shadow-lg ${
                  isDark
                    ? "border-zinc-800 bg-zinc-900 hover:border-indigo-500/50"
                    : "border-zinc-200 bg-white hover:border-indigo-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  {cartCount > 0 ? (
                    <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-bold text-white">
                      {cartCount}
                    </span>
                  ) : null}
                </div>
                <span className="mt-3 font-bold text-zinc-900 dark:text-white">Shopping cart</span>
                <span className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {cartCount > 0
                    ? `${cartCount} item${cartCount === 1 ? "" : "s"} in your cart.`
                    : "Your cart is empty—start shopping anytime."}
                </span>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  Open cart
                  <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>

              <Link
                to="/chat"
                className={`group flex flex-col rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:shadow-lg ${
                  isDark
                    ? "border-zinc-800 bg-zinc-900 hover:border-indigo-500/50"
                    : "border-zinc-200 bg-white hover:border-indigo-300"
                }`}
              >
                <MessageCircle className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <span className="mt-3 font-bold text-zinc-900 dark:text-white">Need help?</span>
                <span className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Chat with support for sizing, orders, or returns.
                </span>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  Open chat
                  <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;

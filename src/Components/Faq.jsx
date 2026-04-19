import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, MessageCircle, Mail } from "lucide-react";
import SiteHeader from "./SiteHeader.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { clearUser } from "../Feature/Slicetwo.jsx";
import { clearCart } from "../Feature/slice.jsx";

const API_USER = "https://shoesbackend-4.onrender.com/api/v1/user";

const FAQ_ITEMS = [
  {
    q: "How do I place an order?",
    a: "Browse the shop, add items to your cart, then go to checkout. Enter your delivery address and complete payment. You will receive a confirmation when payment succeeds.",
  },
  {
    q: "Do I need an account to buy?",
    a: "You can add items to the cart without logging in. For checkout and saved addresses, signing in (or continuing as a guest where offered) keeps your experience smooth.",
  },
  {
    q: "How does shipping work?",
    a: "Shipping options and timelines are confirmed at checkout. You will see delivery estimates before you pay. Promotional banners on the home page may include free-shipping thresholds.",
  },
  {
    q: "What is your return policy?",
    a: "Contact us with your order details if something arrives wrong or does not fit. We will guide you through returns or exchanges based on your order status.",
  },
  {
    q: "Which payment methods are supported?",
    a: "Checkout uses our secure payment partner (Cashfree). Supported methods appear on the payment screen when you complete your order.",
  },
  {
    q: "How do I track my order?",
    a: "Open My orders from your account menu after signing in. You will see past orders and can revisit payment or delivery details there.",
  },
];

export default function Faq() {
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user.userData);
  const [open, setOpen] = useState(0);

  const handleLogout = async () => {
    try {
      await axios.post(`${API_USER}/logout`, {}, { withCredentials: true });
    } catch {
      /* still sign out locally */
    }
    dispatch(clearUser());
    dispatch(clearCart());
  };

  const shell = isDark ? "bg-zinc-950 text-zinc-100" : "bg-zinc-100 text-zinc-900";
  const card = isDark
    ? "rounded-xl border border-zinc-800 bg-zinc-900"
    : "rounded-xl border border-zinc-200 bg-zinc-50";

  return (
    <div className={`min-h-screen ${shell}`}>
      <SiteHeader onLogout={handleLogout} maxWidthClass="max-w-3xl" />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
          Help center
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Frequently asked questions
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Quick answers about shopping, shipping, and your SoleMate account. For
          personal help, use{" "}
          <Link to="/contact" className="font-semibold text-indigo-600 underline dark:text-indigo-400">
            Contact
          </Link>{" "}
          or the{" "}
          <Link to="/chat" className="font-semibold text-indigo-600 underline dark:text-indigo-400">
            chat assistant
          </Link>
          .
        </p>

        <div className="mt-10 space-y-2">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className={`overflow-hidden ${card}`}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100/80 dark:text-zinc-100 dark:hover:bg-zinc-800/80 sm:px-5 sm:text-base"
                  aria-expanded={isOpen}
                >
                  {item.q}
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-zinc-500 transition-transform dark:text-zinc-400 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                </button>
                {isOpen ? (
                  <div
                    className="border-t border-zinc-200 px-4 py-4 text-sm leading-relaxed text-zinc-600 dark:border-zinc-700 dark:text-zinc-300 sm:px-5"
                    id={`faq-panel-${i}`}
                    role="region"
                  >
                    {item.a}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/contact"
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${
              isDark
                ? "border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800"
                : "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50"
            }`}
          >
            <Mail className="h-4 w-4" aria-hidden />
            Contact us
          </Link>
          <Link
            to="/chat"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-indigo-500"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Open chat
          </Link>
        </div>

        {!user ? (
          <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Have an account?{" "}
            <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400">
              Sign in
            </Link>{" "}
            to see orders and saved details.
          </p>
        ) : null}
      </main>
    </div>
  );
}

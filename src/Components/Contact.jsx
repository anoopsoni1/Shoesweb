import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  MessageCircle,
  Clock,
  ChevronRight,
} from "lucide-react";
import SiteHeader from "./SiteHeader.jsx";
import { clearUser } from "../Feature/Slicetwo.jsx";
import { clearCart } from "../Feature/slice.jsx";
import { clearCheckoutData } from "../Feature/Slicethree.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const API_USER = "https://shoesbackend-4.onrender.com/api/v1/user";

const ContactUs = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const user = useSelector((state) => state.user.userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      ...prev,
      name: [user.FirstName, user.LastName].filter(Boolean).join(" ").trim() || prev.name,
      email: (user.email || "").trim() || prev.email,
    }));
  }, [user]);

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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.email?.trim() || !formData.message?.trim()) {
      toast.error("Please fill in name, email, and message.");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API_USER}/contact`, formData);
      toast.success("Thanks — your message was sent.");
      setFormData((prev) => ({
        name: user ? prev.name : "",
        email: user ? prev.email : "",
        phone: "",
        message: "",
      }));
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Could not send your message. Try again or use chat.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const shell = isDark ? "bg-zinc-950 text-zinc-100" : "bg-zinc-100 text-zinc-900";
  const card = isDark
    ? "rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-xl shadow-black/30"
    : "rounded-2xl border border-zinc-200 bg-white shadow-lg shadow-zinc-200/60";
  const input = isDark
    ? "w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
    : "w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25";

  const quickLink = isDark
    ? "flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-800/50 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:border-indigo-500/50 hover:bg-zinc-800"
    : "flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-800 transition hover:border-indigo-300 hover:bg-white";

  return (
    <div className={`min-h-screen ${shell}`}>
      <SiteHeader onLogout={handleLogout} maxWidthClass="max-w-6xl" />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        <nav
          className="mb-8 flex flex-wrap items-center gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400"
          aria-label="Breadcrumb"
        >
          <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden />
          <span className="text-zinc-800 dark:text-zinc-200">Contact</span>
        </nav>

        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
            SoleMate
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Contact us
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base">
            Questions about an order, sizing, or returns? Send a note—we usually reply within
            one business day. For quick answers, see{" "}
            <Link to="/faq" className="font-semibold text-indigo-600 underline dark:text-indigo-400">
              FAQ
            </Link>{" "}
            or{" "}
            <Link to="/chat" className="font-semibold text-indigo-600 underline dark:text-indigo-400">
              chat
            </Link>
            .
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch">
          <div className="relative overflow-hidden rounded-2xl lg:col-span-5">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/cona.jpg')" }}
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/35" aria-hidden />
            <div className="relative flex min-h-[340px] flex-col justify-between p-8 text-white lg:min-h-full">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Direct lines</h2>
                <ul className="mt-6 space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                        Phone
                      </p>
                      <a href="tel:+919981872497" className="font-semibold hover:underline">
                        +91 99818 72497
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                        Email
                      </p>
                      <a
                        href="mailto:support@shoestore.com"
                        className="break-all font-semibold hover:underline"
                      >
                        support@shoestore.com
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                        Location
                      </p>
                      <p className="font-semibold">Bhopal, India</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                        Hours
                      </p>
                      <p className="font-semibold">Mon–Sat, 10:00–19:00 IST</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-white/20 pt-6">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-xl text-white transition hover:bg-white/25"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://wa.me/919981872497"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-xl text-white transition hover:bg-white/25"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp />
                </a>
              </div>
            </div>
          </div>

          <div className={`flex flex-col p-6 sm:p-8 lg:col-span-7 ${card}`}>
            <div className="mb-6 flex items-start gap-3">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  isDark ? "bg-indigo-500/20 text-indigo-300" : "bg-indigo-100 text-indigo-700"
                }`}
              >
                <MessageCircle className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  Send a message
                </h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {user
                    ? "You’re signed in—we prefilled your name and email."
                    : "No account needed. Add your email so we can reply."}
                </p>
              </div>
            </div>

            <div className="mb-6 grid gap-3 sm:grid-cols-2">
              <Link to="/faq" className={quickLink}>
                FAQ
                <ChevronRight className="h-4 w-4 opacity-60" aria-hidden />
              </Link>
              <Link to="/chat" className={quickLink}>
                Live chat
                <ChevronRight className="h-4 w-4 opacity-60" aria-hidden />
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Full name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    className={input}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    className={input}
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Phone <span className="font-normal normal-case text-zinc-400">(optional)</span>
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  className={input}
                />
              </div>
              <div className="flex min-h-0 flex-1 flex-col">
                <label htmlFor="contact-message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className={`${input} min-h-[140px] flex-1 resize-y`}
                  required
                  placeholder="Order number, product name, or anything we should know…"
                />
              </div>

              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {!user ? (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400">
                      Sign in
                    </Link>
                  </p>
                ) : (
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Signed in as {user.email}
                  </span>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[160px]"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" aria-hidden />
                      Send message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactUs;

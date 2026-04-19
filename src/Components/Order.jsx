import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Home,
  Loader2,
  MapPin,
  Package,
  Trash2,
  Truck,
} from "lucide-react";
import { useSelector } from "react-redux";
import {
  resolveCartItemImage,
  CART_IMAGE_FALLBACK,
} from "../utils/cartImage.js";
import { useTheme } from "../context/ThemeContext.jsx";
import SiteHeader from "./SiteHeader.jsx";

const API_USER = "https://shoesbackend-4.onrender.com/api/v1/user";

function formatShippingAddress(addr) {
  if (addr == null) return "No address on file.";
  if (typeof addr === "string") {
    try {
      const parsed = JSON.parse(addr);
      return formatShippingAddress(parsed);
    } catch {
      return addr;
    }
  }
  if (typeof addr !== "object") return "No address on file.";
  if (addr.raw != null && Object.keys(addr).length <= 2) {
    return String(addr.raw);
  }

  const lines = [];
  const name =
    [addr.firstName, addr.lastName].filter(Boolean).join(" ").trim() ||
    addr.name;
  if (name) lines.push(name);
  if (addr.email) lines.push(addr.email);

  const street = [addr.streetAddress, addr.area].filter(Boolean).join(", ");
  if (street) lines.push(street);

  const cityParts = [addr.city, addr.state, addr.country].filter(Boolean);
  if (cityParts.length) lines.push(cityParts.join(", "));

  const pin = addr.postalCode || addr.pincode;
  if (pin) lines.push(`Pincode: ${pin}`);

  const phone = addr.phoneNumber || addr.phone;
  if (phone) lines.push(`Phone: ${phone}`);

  return lines.length ? lines.join(" · ") : "No address on file.";
}

function shortOrderId(order) {
  const id = order?._id;
  if (!id) return "—";
  const s = typeof id === "string" ? id : String(id);
  return s.length > 10 ? s.slice(-10).toUpperCase() : s.toUpperCase();
}

function paymentBadgeClass(status) {
  const s = (status || "").toLowerCase();
  if (s === "success" || s === "paid" || s === "completed")
    return "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-800";
  if (s === "failed" || s === "cancelled")
    return "bg-red-50 text-red-800 ring-1 ring-red-200 dark:bg-red-950/40 dark:text-red-200 dark:ring-red-800";
  return "bg-amber-50 text-amber-900 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-100 dark:ring-amber-800";
}

function orderStatusMeta(status) {
  const s = (status || "processing").toLowerCase();
  if (s === "delivered")
    return {
      label: "Delivered",
      pill:
        "bg-emerald-600 text-white dark:bg-emerald-500",
      step: 3,
    };
  if (s === "shipped")
    return {
      label: "Shipped",
      pill:
        "bg-[#2874f0] text-white dark:bg-blue-500",
      step: 2,
    };
  if (s === "cancelled")
    return {
      label: "Cancelled",
      pill: "bg-zinc-600 text-white dark:bg-zinc-500",
      step: 0,
    };
  return {
    label: "Processing",
    pill:
      "bg-amber-500 text-white dark:bg-amber-600",
    step: 1,
  };
}

function OrderTimeline({ step, cancelled }) {
  const steps = [
    { k: "confirmed", title: "Order confirmed" },
    { k: "shipped", title: "Shipped" },
    { k: "delivery", title: "Out for delivery" },
  ];
  if (cancelled) {
    return (
      <div className="px-4 py-3 border-b border-zinc-200/80 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
        <p className="text-xs text-zinc-800 dark:text-zinc-300">
          This order was cancelled.
        </p>
      </div>
    );
  }
  return (
    <div className="px-4 sm:px-5 py-4 border-b border-zinc-200/80 dark:border-zinc-700 bg-[#fbfdff] dark:bg-zinc-800/40">
      <div className="flex items-center justify-between gap-1 sm:gap-2 max-w-2xl mx-auto">
        {steps.map((st, i) => {
          const n = i + 1;
          const active = step >= n;
          const lineDone = step > n;
          return (
            <React.Fragment key={st.k}>
              <div className="flex flex-col items-center min-w-0 flex-1">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 ${
                    active
                      ? "bg-[#2874f0] text-white shadow-sm"
                      : "bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-400"
                  }`}
                >
                  {n}
                </div>
                <span className="mt-1.5 text-[10px] sm:text-xs text-center text-zinc-800 dark:text-zinc-300 leading-tight px-0.5">
                  {st.title}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 min-w-[12px] max-w-[48px] sm:max-w-[72px] -mt-5 sm:-mt-6 self-start translate-y-3.5 ${
                    lineDone ? "bg-[#2874f0]" : "bg-zinc-200 dark:bg-zinc-700"
                  }`}
                  aria-hidden
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

const Orders = () => {
  const { isDark } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");
  const user = useSelector((state) => state.user.userData);

  const fetchOrders = useCallback(async () => {
    if (!user?._id) {
      setOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_USER}/getorder/${user._id}`);
      const data = res.data;
      let list = [];
      if (Array.isArray(data)) list = data;
      else if (data?.orders && Array.isArray(data.orders)) list = data.orders;
      setOrders(list);
    } catch (err) {
      if (err.response?.status === 404) {
        setOrders([]);
      } else {
        console.error("Error fetching orders:", err);
        setError("Could not load orders. Please try again.");
        setOrders([]);
      }
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleDelete = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    setDeleting(orderId);
    try {
      await axios.delete(`${API_USER}/deleteorder/${orderId}`);
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Failed to cancel the order. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex flex-col ${
          isDark ? "bg-zinc-950" : "bg-[#f1f3f6]"
        }`}
      >
        <SiteHeader />
        <div className="flex flex-1 flex-col items-center justify-center px-4">
          <Loader2 className="w-9 h-9 text-[#2874f0] animate-spin" />
          <p className="mt-3 text-sm text-zinc-800 dark:text-zinc-300">
            Loading your orders…
          </p>
        </div>
      </div>
    );
  }

  if (!user?._id) {
    return (
      <div
        className={`min-h-screen flex flex-col ${
          isDark ? "bg-zinc-950" : "bg-[#f1f3f6]"
        }`}
      >
        <SiteHeader />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-12">
          <Package className="w-14 h-14 text-zinc-400" />
          <p className="text-zinc-700 dark:text-zinc-300 text-lg font-medium">
            Log in to see your orders
          </p>
          <Link
            to="/login"
            className="px-8 py-2.5 bg-[#2874f0] text-white text-sm font-semibold uppercase tracking-wide rounded-sm shadow hover:bg-[#1a5dcc] transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen pb-12 flex flex-col ${
        isDark ? "bg-zinc-950 text-zinc-100" : "bg-[#f1f3f6] text-zinc-900"
      }`}
    >
      <SiteHeader />
      <div className="max-w-4xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6 flex-1 w-full">
        <nav
          className="flex items-center gap-1 text-xs sm:text-sm text-zinc-700 dark:text-zinc-400 mb-4"
          aria-label="Breadcrumb"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-0.5 text-zinc-800 dark:text-zinc-300 hover:text-[#2874f0] dark:hover:text-blue-400"
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-zinc-600 dark:text-zinc-500" />
          <span className="text-zinc-900 dark:text-zinc-200 font-semibold">
            My Orders
          </span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
          <h1 className="text-xl sm:text-2xl font-medium tracking-tight">
            My Orders
          </h1>
          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-400">
            {orders.length}{" "}
            {orders.length === 1 ? "order" : "orders"} placed
          </p>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded border border-red-100 dark:border-red-900/50">
            {error}
          </p>
        )}

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => {
              const meta = orderStatusMeta(order.orderStatus);
              const cancelled =
                (order.orderStatus || "").toLowerCase() === "cancelled";
              const placed = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "—";
              const eta =
                order.createdAt &&
                new Date(
                  new Date(order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000
                ).toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                });

              return (
                <article
                  key={order._id}
                  className={`rounded-sm border overflow-hidden shadow-sm ${
                    isDark
                      ? "bg-zinc-900 border-zinc-800"
                      : "bg-zinc-50 border-zinc-200"
                  }`}
                >
                  <div
                    className={`flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 text-xs sm:text-sm border-b ${
                      isDark
                        ? "bg-zinc-800/80 border-zinc-700"
                        : "bg-[#f8f9fa] border-zinc-200/80"
                    }`}
                  >
                    <div>
                      <span className="text-zinc-700 dark:text-zinc-400 block text-[10px] uppercase tracking-wider font-medium">
                        Order placed
                      </span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {placed}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-700 dark:text-zinc-400 block text-[10px] uppercase tracking-wider font-medium">
                        Order ID
                      </span>
                      <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">
                        {shortOrderId(order)}
                      </span>
                    </div>
                    <div className="sm:ml-auto flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wide ${paymentBadgeClass(
                          order.paymentStatus
                        )}`}
                      >
                        {(order.paymentStatus || "Pending").toString()}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold ${meta.pill}`}
                      >
                        {meta.label}
                      </span>
                    </div>
                  </div>

                  <OrderTimeline step={meta.step} cancelled={cancelled} />

                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {(order.items || []).map((item, i) => (
                      <div
                        key={`${order._id}-${i}-${item.name}`}
                        className="flex gap-3 sm:gap-4 px-4 sm:px-5 py-4"
                      >
                        <div
                          className={`shrink-0 w-[72px] h-[72px] sm:w-20 sm:h-20 rounded border overflow-hidden ${
                            isDark ? "border-zinc-700 bg-zinc-800" : "border-zinc-200 bg-zinc-50"
                          }`}
                        >
                          <img
                            src={resolveCartItemImage(item.image, item.id)}
                            alt={item.name || "Product"}
                            className="w-full h-full object-contain p-1"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = CART_IMAGE_FALLBACK;
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm sm:text-[15px] font-medium text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2">
                              {item.name || "Item"}
                            </p>
                            <p className="text-xs text-zinc-700 dark:text-zinc-400 mt-1">
                              Seller: Solemate
                            </p>
                            <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1">
                              Qty: {item.quantity ?? 1}
                              <span className="text-zinc-600 dark:text-zinc-500 mx-1.5">
                                ·
                              </span>
                              ₹
                              {Number(item.price ?? 0).toLocaleString("en-IN")}{" "}
                              each
                            </p>
                          </div>
                          <p className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 sm:text-right shrink-0">
                            ₹
                            {(
                              Number(item.price ?? 0) *
                              Number(item.quantity ?? 1)
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    className={`px-4 sm:px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t ${
                      isDark
                        ? "bg-zinc-800/50 border-zinc-700"
                        : "bg-[#fafbfc] border-zinc-100"
                    }`}
                  >
                    <div className="flex items-start gap-2 text-xs sm:text-sm text-zinc-800 dark:text-zinc-300 min-w-0">
                      <Truck className="w-4 h-4 text-[#2874f0] shrink-0 mt-0.5" />
                      <span>
                        {cancelled ? (
                          "No delivery for cancelled orders."
                        ) : (
                          <>
                            <span className="font-medium text-zinc-800 dark:text-zinc-200">
                              Delivery expected by {eta}
                            </span>
                            <span className="text-zinc-700 dark:text-zinc-500">
                              {" "}
                              · Standard shipping
                            </span>
                          </>
                        )}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 sm:text-right">
                      Order Total: ₹
                      {Number(order.totalAmount ?? 0).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div
                    className={`px-4 sm:px-5 py-3 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between border-t ${
                      isDark ? "border-zinc-700" : "border-zinc-100"
                    }`}
                  >
                    <div className="flex items-start gap-2 min-w-0 text-xs sm:text-sm">
                      <MapPin className="w-4 h-4 text-[#2874f0] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200 block mb-0.5">
                          Shipping address
                        </span>
                        <p className="text-zinc-800 dark:text-zinc-300 leading-relaxed">
                          {formatShippingAddress(order.shippingAddress)}
                        </p>
                      </div>
                    </div>
                    {!cancelled && (
                      <button
                        type="button"
                        onClick={() => handleDelete(order._id)}
                        className="self-start sm:self-center inline-flex items-center gap-1.5 text-[#2874f0] hover:underline text-xs sm:text-sm font-semibold disabled:opacity-50"
                        disabled={deleting === order._id}
                      >
                        {deleting === order._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        {deleting === order._id ? "Cancelling…" : "Cancel order"}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div
            className={`rounded-sm border text-center py-16 px-4 ${
              isDark
                ? "bg-zinc-900 border-zinc-800"
                : "bg-zinc-50 border-zinc-200 shadow-sm"
            }`}
          >
            <Package className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-600 mb-3" />
            <p className="text-zinc-700 dark:text-zinc-300 font-medium">
              You have not placed any orders yet
            </p>
            <p className="text-sm text-zinc-700 dark:text-zinc-400 mt-1 mb-6">
              When you buy something, it will show up here.
            </p>
            <Link
              to="/list"
              className="inline-block px-8 py-2.5 bg-[#2874f0] text-white text-sm font-semibold uppercase tracking-wide rounded-sm shadow hover:bg-[#1a5dcc] transition-colors"
            >
              Start shopping
            </Link>
          </div>
        )}

        <p className="mt-8 text-center text-xs text-zinc-700 dark:text-zinc-500">
          Need help?{" "}
          <Link
            to="/contact"
            className="text-[#2874f0] dark:text-blue-400 font-medium hover:underline"
          >
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Orders;

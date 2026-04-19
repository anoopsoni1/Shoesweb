import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  Loader2,
  ChevronRight,
  Home,
  Package,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Truck,
} from "lucide-react";
import { store } from "../Store/Store.js";
import { clearCheckoutData } from "../Feature/Slicethree.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import SiteHeader from "./SiteHeader.jsx";

const API_USER = "https://shoesbackend-4.onrender.com/api/v1/user";
const RECEIPT_KEY = "solemate_payment_receipt";

function readReceipt(orderId) {
  if (!orderId) return null;
  try {
    const raw = sessionStorage.getItem(RECEIPT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.order_id === orderId && parsed.payment) return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

function writeReceipt(orderId, payment, extra = {}) {
  if (!orderId || !payment) return;
  try {
    sessionStorage.setItem(
      RECEIPT_KEY,
      JSON.stringify({
        order_id: orderId,
        payment,
        savedAt: Date.now(),
        ...extra,
      })
    );
  } catch {
    /* quota / private mode */
  }
}

function extractPaymentRow(data) {
  if (!data) return null;
  if (Array.isArray(data) && data.length > 0) return data[0];
  if (Array.isArray(data?.payments) && data.payments.length > 0)
    return data.payments[0];
  if (data.cf_payment_id || data.payment_status) return data;
  return null;
}

function resolveOrderId(searchParams) {
  const q =
    searchParams.get("order_id") ||
    searchParams.get("orderId") ||
    searchParams.get("cf_order_id");
  if (q) return q.trim();
  const fromStorage = localStorage.getItem("orderId");
  return fromStorage?.trim() || null;
}

function PaymentResult() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isDark } = useTheme();
  const [status, setStatus] = useState("Verifying...");
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [fromCache, setFromCache] = useState(false);
  const [missingRef, setMissingRef] = useState(false);

  const loadCartItems = useCallback(() => {
    try {
      const raw = localStorage.getItem("cart");
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, []);

  useEffect(() => {
    const order_id = resolveOrderId(searchParams);

    if (!order_id) {
      setMissingRef(true);
      setLoading(false);
      setStatus("No payment reference");
      setPaymentData(null);
      return;
    }

    localStorage.setItem("orderId", order_id);

    const cached = readReceipt(order_id);
    if (cached?.payment) {
      setPaymentData(cached.payment);
      setStatus(cached.payment.payment_status || "Unknown");
      setFromCache(true);
      setLoading(false);
    }

    const trySaveOrder = async (row) => {
      if (row.payment_status?.toLowerCase() !== "success") return;
      const receipt = readReceipt(order_id);
      if (receipt?.savedToBackend) return;

      const cartItems = loadCartItems();
      const userId = store.getState().user.userData?._id;
      if (!userId || cartItems.length === 0) return;

      try {
        const response = await fetch(`${API_USER}/saveorder`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            items: cartItems,
            totalAmount: row.payment_amount,
            address: localStorage.getItem("savedAddress"),
            paymentStatus: "Success",
          }),
        });
        await response.json().catch(() => null);
        if (response.ok) {
          writeReceipt(order_id, row, { savedToBackend: true });
          store.dispatch(clearCheckoutData());
        }
      } catch (e) {
        console.error("saveorder", e);
      }
    };

    (async () => {
      try {
        const res = await fetch(`${API_USER}/verifypayment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_id }),
        });

        const data = await res.json().catch(() => null);
        const row = extractPaymentRow(data);

        if (row) {
          writeReceipt(order_id, row, {
            savedToBackend: readReceipt(order_id)?.savedToBackend === true,
          });
          setPaymentData(row);
          setStatus(row.payment_status || "Unknown");
          setFromCache(false);
          await trySaveOrder(row);
        } else if (cached?.payment) {
          setPaymentData(cached.payment);
          setStatus(cached.payment.payment_status || "Unknown");
          setFromCache(true);
        } else {
          setStatus("No payment data found");
          setPaymentData(null);
        }
      } catch (error) {
        console.error(error);
        if (cached?.payment) {
          setPaymentData(cached.payment);
          setStatus(cached.payment.payment_status || "Unknown");
          setFromCache(true);
        } else {
          setStatus("Error verifying payment");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [searchParams, loadCartItems]);

  const renderValue = (value) => {
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return value ?? "N/A";
  };

  const today = new Date();
  const estimated = new Date(today);
  estimated.setDate(today.getDate() + 5);
  const formattedEta = estimated.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const success =
    !loading &&
    !missingRef &&
    status.toLowerCase() === "success" &&
    paymentData;
  const failed =
    !loading &&
    !missingRef &&
    (status.toLowerCase() === "failed" ||
      status.toLowerCase() === "error verifying payment");

  const shell = isDark ? "bg-zinc-950" : "bg-[#f1f3f6]";
  const card = isDark
    ? "bg-zinc-900 border border-zinc-800"
    : "bg-zinc-50 border border-zinc-200 shadow-sm";

  return (
    <div className={`min-h-screen ${shell} pb-10 flex flex-col`}>
      <SiteHeader />
      <div className="max-w-lg mx-auto px-3 sm:px-4 pt-4 sm:pt-6 flex-1 w-full">
        <nav
          className="flex items-center gap-1 text-xs text-zinc-800 dark:text-zinc-400 mb-4"
          aria-label="Breadcrumb"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-0.5 text-zinc-800 dark:text-zinc-300 hover:text-[#2874f0] dark:hover:text-blue-400"
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-500 shrink-0" />
          <span className="text-zinc-800 dark:text-zinc-200 font-medium">
            Payment
          </span>
        </nav>

        <div className={`rounded-sm overflow-hidden ${card}`}>
          <div
            className={`px-5 py-6 text-center border-b ${
              isDark ? "border-zinc-800 bg-zinc-800/30" : "border-zinc-100 bg-[#fbfdff]"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-12 h-12 mx-auto text-[#2874f0] animate-spin mb-3" />
                <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Verifying payment
                </h1>
                <p className="text-sm text-zinc-800 dark:text-zinc-400 mt-1">
                  Please wait…
                </p>
              </>
            ) : success ? (
              <>
                <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  Your order has been placed
                </h1>
                <p className="text-sm text-zinc-800 dark:text-zinc-300 mt-2 leading-relaxed">
                  Thank you for shopping with Solemate. We have sent the
                  confirmation to your registered details.
                </p>
              </>
            ) : failed || missingRef ? (
              <>
                <div className="mx-auto w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center mb-3">
                  <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
                <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  {missingRef ? "Could not verify checkout" : "Payment not completed"}
                </h1>
                <p className="text-sm text-zinc-800 dark:text-zinc-300 mt-2">
                  {missingRef
                    ? "This page needs a valid order reference. If you already paid, check My orders or your bank SMS."
                    : "If money was debited, it is usually reversed within a few days."}
                </p>
              </>
            ) : (
              <>
                <div className="mx-auto w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center mb-3">
                  <Package className="w-9 h-9 text-amber-600 dark:text-amber-400" />
                </div>
                <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  Payment status
                </h1>
                <p
                  className={`text-sm font-semibold mt-2 ${
                    status.toLowerCase() === "success"
                      ? "text-emerald-600"
                      : status.toLowerCase() === "failed"
                      ? "text-red-600"
                      : "text-amber-600"
                  }`}
                >
                  {status}
                </p>
              </>
            )}
          </div>

          {!loading && paymentData && (
            <div className="px-5 py-4 space-y-3 text-sm border-b border-zinc-100 dark:border-zinc-800">
              {fromCache && (
                <p className="text-[11px] text-zinc-800 dark:text-zinc-400 -mt-1 mb-2">
                  Receipt saved in this browser (safe to refresh).
                </p>
              )}
              <div className="flex justify-between gap-4">
                <span className="text-zinc-800 dark:text-zinc-400">
                  Order ID
                </span>
                <span className="font-mono text-xs text-right text-zinc-900 dark:text-zinc-100 break-all max-w-[60%]">
                  {renderValue(paymentData.order_id)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-zinc-800 dark:text-zinc-400">
                  Transaction ID
                </span>
                <span className="font-mono text-xs text-right text-zinc-800 dark:text-zinc-200 break-all max-w-[60%]">
                  {renderValue(paymentData.cf_payment_id)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-zinc-800 dark:text-zinc-400">Amount</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  ₹{renderValue(paymentData.payment_amount)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-zinc-800 dark:text-zinc-400">Method</span>
                <span className="text-right text-zinc-800 dark:text-zinc-200 text-xs max-w-[60%]">
                  {renderValue(
                    paymentData.payment_method?.upi?.channel ||
                      paymentData.payment_method
                  )}
                </span>
              </div>
              {paymentData.payment_time && (
                <div className="flex justify-between gap-4">
                  <span className="text-zinc-800 dark:text-zinc-400">Paid on</span>
                  <span className="text-xs text-right text-zinc-700 dark:text-zinc-300">
                    {new Date(paymentData.payment_time).toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </div>
          )}

          {!loading && success && (
            <div
              className={`px-5 py-3 flex items-start gap-2 text-sm ${
                isDark ? "bg-zinc-800/40" : "bg-[#f8f9fa]"
              }`}
            >
              <Truck className="w-5 h-5 text-[#2874f0] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Delivery expected by {formattedEta}
                </span>
                <p className="text-xs text-zinc-800 dark:text-zinc-400 mt-0.5">
                  You can track shipment details from My orders.
                </p>
              </div>
            </div>
          )}

          <div className="p-5 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="w-full py-3 bg-[#2874f0] hover:bg-[#1a5dcc] text-white text-sm font-bold uppercase tracking-wide rounded-sm shadow transition-colors flex items-center justify-center gap-2"
            >
              <Package className="w-5 h-5" />
              View orders
            </button>
            <button
              type="button"
              onClick={() => navigate("/list")}
              className="w-full py-3 border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-[#2874f0] dark:text-blue-400 text-sm font-bold uppercase tracking-wide rounded-sm hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue shopping
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-700 dark:text-zinc-500 mt-6">
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
}

export default PaymentResult;

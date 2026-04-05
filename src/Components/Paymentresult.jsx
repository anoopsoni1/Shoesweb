import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CreditCard, Truck, Home, Package } from "lucide-react";
import { store } from "../Store/Store.js";

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

/** Cashfree verify may return an array, or an object with nested payments */
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
  const formatted = estimated.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg text-center animate-fadeIn">
        <CreditCard className="mx-auto mb-4 text-blue-500 w-16 h-16" />
        <h2 className="text-2xl font-bold mb-2">Payment Status</h2>

        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
            <p className="text-gray-500">Verifying your payment...</p>
          </div>
        ) : (
          <div>
            {missingRef && (
              <p className="text-sm text-gray-600 mb-4">
                We could not find this checkout session (missing order id). If
                you already paid, open{" "}
                <span className="font-medium">My Orders</span> or check your
                email. Starting a new payment sets a new order reference.
              </p>
            )}

            {fromCache && paymentData && (
              <p className="text-xs text-gray-500 mb-2">
                Showing saved receipt for this browser session (refresh-safe).
              </p>
            )}

            <p
              className={`text-xl font-semibold mb-4 ${
                status.toLowerCase() === "success"
                  ? "text-green-600"
                  : status.toLowerCase() === "failed"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {status}
            </p>

            {paymentData && (
              <div className="text-left space-y-2 bg-gray-50 p-4 rounded-lg shadow-inner">
                <p>
                  <span className="font-semibold">Order ID:</span>{" "}
                  {renderValue(paymentData.order_id)}
                </p>
                <p>
                  <span className="font-semibold">Transaction ID:</span>{" "}
                  {renderValue(paymentData.cf_payment_id)}
                </p>
                <p>
                  <span className="font-semibold">Bank Reference:</span>{" "}
                  {renderValue(paymentData.bank_reference)}
                </p>
                <p>
                  <span className="font-semibold">Amount:</span> ₹
                  {renderValue(paymentData.payment_amount)}
                </p>
                <p>
                  <span className="font-semibold">Currency:</span>{" "}
                  {renderValue(paymentData.payment_currency)}
                </p>
                <p>
                  <span className="font-semibold">Payment Gateway:</span>{" "}
                  {renderValue(
                    paymentData.payment_gateway_details?.gateway_name
                  )}
                </p>
                <p>
                  <span className="font-semibold">Payment Method:</span>{" "}
                  {renderValue(
                    paymentData.payment_method?.upi?.channel ||
                      paymentData.payment_method
                  )}
                </p>
                <p>
                  <span className="font-semibold">Payment Time:</span>{" "}
                  {paymentData.payment_time
                    ? new Date(paymentData.payment_time).toLocaleString()
                    : "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Payment Message:</span>{" "}
                  {renderValue(paymentData.payment_message)}
                </p>
                <p>
                  <span className="font-semibold">Payment Group:</span>{" "}
                  {renderValue(paymentData.payment_group)}
                </p>
                <p className="flex items-center gap-2 mt-4 text-gray-700 font-semibold">
                  <Truck className="w-5 h-5 text-blue-500" /> Estimated
                  delivery: {formatted}
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => navigate("/orders")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded flex items-center justify-center gap-2"
              >
                <Package className="w-5 h-5" />
                My orders
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentResult;

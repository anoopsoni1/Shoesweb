import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Truck, MapPin, Trash2, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import {
  resolveCartItemImage,
  CART_IMAGE_FALLBACK,
} from "../utils/cartImage.js";

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
  if (pin) lines.push(`Postal code: ${pin}`);

  const phone = addr.phoneNumber || addr.phone;
  if (phone) lines.push(`Phone: ${phone}`);

  return lines.length ? lines.join("\n") : "No address on file.";
}

function paymentLabelClass(status) {
  const s = (status || "").toLowerCase();
  if (s === "success" || s === "paid" || s === "completed")
    return "text-green-600";
  if (s === "failed" || s === "cancelled") return "text-red-600";
  return "text-amber-600";
}

const Orders = () => {
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
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
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

  const getStatusColor = (status) => {
    const s = (status || "processing").toLowerCase();
    switch (s) {
      case "processing":
        return "text-yellow-600 bg-yellow-100";
      case "shipped":
        return "text-blue-600 bg-blue-100";
      case "delivered":
        return "text-green-600 bg-green-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!user?._id) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600 text-lg">Log in to see your orders.</p>
        <Link
          to="/login"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
        My Orders
      </h1>

      {error && (
        <p className="text-center text-red-600 mb-6 text-sm">{error}</p>
      )}

      {orders.length > 0 ? (
        <div className="max-w-5xl mx-auto space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-wrap justify-between items-center p-6 border-b border-gray-100 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold text-gray-800">
                    #
                    {order._id && typeof order._id === "string"
                      ? order._id.slice(-8)
                      : String(order._id).slice(-8)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Placed On</p>
                  <p className="font-semibold text-gray-800">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment</p>
                  <p
                    className={`font-semibold ${paymentLabelClass(
                      order.paymentStatus
                    )}`}
                  >
                    {order.paymentStatus || "Pending"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus || "Processing"}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDelete(order._id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700 transition"
                    disabled={deleting === order._id}
                  >
                    {deleting === order._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      {deleting === order._id ? "Deleting..." : "Cancel"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {(order.items || []).map((item, i) => (
                  <div
                    key={`${order._id}-${i}-${item.name}`}
                    className="flex flex-wrap justify-between items-center border-b pb-4 last:border-none gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={resolveCartItemImage(item.image, item.id)}
                        alt={item.name || "Product"}
                        className="w-16 h-16 object-cover rounded-lg border shrink-0 bg-gray-100"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = CART_IMAGE_FALLBACK;
                        }}
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate">
                          {item.name || "Item"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity ?? 1} × ₹
                          {Number(item.price ?? 0).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">
                      ₹
                      {(
                        Number(item.price ?? 0) * Number(item.quantity ?? 1)
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-gray-50 rounded-b-2xl grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" /> Shipping
                    address
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                    {formatShippingAddress(order.shippingAddress)}
                  </p>
                </div>

                <div className="flex flex-col justify-between sm:items-end">
                  <p className="text-lg font-semibold text-gray-800">
                    Total: ₹
                    {Number(order.totalAmount ?? 0).toLocaleString("en-IN")}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700 text-sm mt-2">
                    <Truck className="w-4 h-4 text-blue-500" />
                    Estimated delivery:{" "}
                    <span className="font-medium">
                      {order.createdAt
                        ? new Date(
                            new Date(order.createdAt).getTime() +
                              5 * 24 * 60 * 60 * 1000
                          ).toLocaleDateString()
                        : "—"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">No orders yet 🛍️</p>
      )}

      <div className="max-w-5xl mx-auto mt-10 text-center">
        <Link to="/" className="text-indigo-600 hover:underline text-sm font-medium">
          ← Back to home
        </Link>
      </div>
    </div>
  );
};

export default Orders;

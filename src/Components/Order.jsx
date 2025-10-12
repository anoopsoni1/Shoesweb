import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Truck,
  PackageCheck,
  CreditCard,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const userId = "670a9c22b1234567890abcde";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/order/getorder/${userId}`
        );
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
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

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No orders yet 🛍️</p>
      ) : (
        <div className="max-w-5xl mx-auto space-y-8">
          {orders.map((order, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-wrap justify-between items-center p-6 border-b border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold text-gray-800">
                    #{order._id?.slice(-8)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Placed On</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment</p>
                  <p
                    className={`font-semibold ${
                      order.paymentStatus === "Paid"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {order.paymentStatus}
                  </p>
                </div>
                <div>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-wrap justify-between items-center border-b pb-4 last:border-none"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">
                      ₹{item.price}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-gray-50 rounded-b-2xl grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" /> Shipping Address
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {order.shippingAddress.name} <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    - {order.shippingAddress.pincode} <br />
                    📞 {order.shippingAddress.phone}
                  </p>
                </div>

                <div className="flex flex-col justify-between sm:items-end">
                  <p className="text-lg font-semibold text-gray-800">
                    Total Amount: ₹{order.totalAmount}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700 text-sm mt-2">
                    <Truck className="w-4 h-4 text-blue-500" />
                    Estimated Delivery:{" "}
                    <span className="font-medium">
                      {new Date(
                        new Date(order.createdAt).getTime() +
                          5 * 24 * 60 * 60 * 1000
                      ).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

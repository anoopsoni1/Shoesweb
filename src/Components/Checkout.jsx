import React, { useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import { Loader2, CreditCard } from "lucide-react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../Feature/Slicetwo";
import axios from "axios";
import SiteHeader from "./SiteHeader.jsx";

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { name, email, amount } = useSelector((state) => state.checkout);

  const initiatePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://shoesbackend-4.onrender.com/api/v1/user/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount,
          name: name,
          email: email,
          phone: "9876543210",
        }),
      });

      
      const data = await res.json();
 
      localStorage.setItem("orderId", data.order_id);
        console.log("Order created:", data);

      const sessionId = data.payment_session_id;
      const cashfree = await load({ mode: "sandbox" });

      cashfree.checkout({
        paymentSessionId: sessionId,
        redirectTarget: "_self",
      });
    } catch (err) {
      console.error("Payment error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://shoesbackend-4.onrender.com/api/v1/user/logout",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout failed", error);
    }
    dispatch(clearUser());
    navigate("/login");
  };

  return (
    <>
      <SiteHeader onLogout={handleLogout} />
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="flex flex-1 items-center justify-center p-6">
      <div className="shadow-2xl rounded-2xl p-8 w-full max-w-md transition-transform transform hover:scale-[1.01] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col items-center text-center">
          <CreditCard className="w-14 h-14 text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Secure Payment
          </h1>
          <p className="text-gray-500 mb-6">
            Complete your payment safely using Cashfree's secure gateway.
          </p>

          <button
            onClick={initiatePayment}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" /> Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" /> Pay ₹{amount}
              </>
            )}
          </button>

          <p className="text-xs text-gray-400 mt-4">
             Your payment is encrypted and 100% secure.
          </p>
        </div>
      </div>
    </div>
    </div>
      </>
  );
};

export default Checkout;

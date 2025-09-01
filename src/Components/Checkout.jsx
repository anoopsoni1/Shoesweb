import React, { useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";


const Checkout = () => {
  const [loading, setLoading] = useState(false);

  const initiatePayment = async () => {
    setLoading(true);

    try {
  
      const res = await fetch("http://localhost:5000/api/v1/user/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 5,
           name: "Anoop Soni",
           email: "anoop@example.com",
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

  return (
  


    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Cashfree Payment</h1>
      <button
        onClick={initiatePayment}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        {loading ? "Processing..." : "Pay ₹500"}
      </button>
    </div>
  );
};

export default Checkout;

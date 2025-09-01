import { useEffect, useState } from "react";

function PaymentResult() {
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const order_id = localStorage.getItem("orderId");
      console.log(order_id);

   fetch("http://localhost:5000/api/v1/user/verifypayment", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "SUCCESS") {
          setStatus("✅ Payment Successful!");
        } else {
          setStatus("Payment Failed or Pending.");
        }
      })
      .catch((e) => setStatus(" Error verifying payment" ,e));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Payment Status</h2>
      <p>{status}</p>
    </div>
  );
}

export default PaymentResult;

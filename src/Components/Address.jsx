import React, { useState, useEffect } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import { CreditCard, Loader2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { clearUser } from "../Feature/Slicetwo";
import { FaRegHeart, FaShoppingBag, FaRegUserCircle } from "react-icons/fa";
import axios from "axios";

const API_USER = "https://shoesbackend-4.onrender.com/api/v1/user";

const emptyAddressForm = () => ({
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  country: "",
  city: "",
  streetAddress: "",
  area: "",
  postalCode: "",
});

/** MongoDB docs include _id, userId, etc. — keep only fields bound to inputs */
function pickAddressFields(src) {
  if (!src || typeof src !== "object") return emptyAddressForm();
  const base = emptyAddressForm();
  for (const key of Object.keys(base)) {
    const v = src[key];
    base[key] = v != null && v !== "" ? String(v) : "";
  }
  return base;
}

const FormInput = ({ id, placeholder, fullWidth = false, ...props }) => (
  <div className={fullWidth ? "md:col-span-2" : ""}>
    <input
      id={id}
      name={id}
      placeholder={placeholder}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
      {...props}
    />
  </div>
);

export default function CheckoutWithAddress() {
  const user = useSelector((state) => state.user.userData);
  const checkoutData = useSelector((state) => state.checkout);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(emptyAddressForm);

  const [loading, setLoading] = useState(false);
  const [addressSaved, setAddressSaved] = useState(false);
  const [savedAddress, setSavedAddress] = useState(null);
  const [saveError, setSaveError] = useState("");

  // Fetch saved address from backend or localStorage
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await fetch(`${API_USER}/getaddress/${user?._id}`, {
          headers: { "Content-Type": "application/json" },
        });
        if (res.status === 404) return;
        if (!res.ok) throw new Error("Failed to fetch saved address");
        const data = await res.json();

        if (data.addresses) {
          const fields = pickAddressFields(data.addresses);
          setSavedAddress(fields);
          setFormData(fields);
          localStorage.setItem("savedAddress", JSON.stringify(fields));
        }
      } catch (err) {
        console.error(err);
      }
    };

    const localAddress = localStorage.getItem("savedAddress");
    if (localAddress) {
      try {
        const parsed = JSON.parse(localAddress);
        const fields = pickAddressFields(parsed);
        setFormData(fields);
        setSavedAddress(fields);
      } catch {
        localStorage.removeItem("savedAddress");
      }
    } else if (user?._id) {
      fetchAddress();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSaveError("");
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      localStorage.setItem("savedAddress", JSON.stringify(updated));
      return updated;
    });
  };

  const handleLogout = async () => {
    dispatch(clearUser());
    try {
      await axios.post(
        `${API_USER}/logout`,
        {},
        { withCredentials: true }
      );
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const saveAddress = async (e) => {
    e.preventDefault();
    setSaveError("");
    if (!user?._id) {
      setSaveError("Please log in to save your address.");
      return;
    }
    try {
      const res = await fetch(`${API_USER}/address`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, formData }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSaveError(
          payload.message ||
            payload.error ||
            "Could not save address. Check all fields and try again."
        );
        return;
      }

      const normalized = pickAddressFields(payload.data ?? formData);
      setSavedAddress(normalized);
      setFormData(normalized);
      setAddressSaved(true);
      localStorage.setItem("savedAddress", JSON.stringify(normalized));
    } catch (err) {
      console.error(err);
      setSaveError("Network error while saving address.");
    }
  };

  const initiatePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_USER}/payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: checkoutData.amount,
            name: checkoutData.name,
            email: checkoutData.email,
            phone: "9876543210",
          }),
        }
      );
      const data = await res.json();
      console.log(data);

      localStorage.setItem("orderId", data.order_id);

      const cashfree = await load({ mode: "sandbox" });
      cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_self",
      });
    } catch (err) {
      console.error("Payment error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="relative">
        <nav className="pt-2 ml-5 flex justify-between">
          <div>
            <p className="text-2xl font-medium text-black">SoleMate</p>
          </div>

          <div className="sm:block hidden">
            <ul className="flex gap-8 mt-1 font-semibold place-items-center mr-5 text-white">
              <li className="bg-amber-100 p-3 rounded-[5px] text-black">
                <FaRegHeart />
              </li>
              <Link
                to="/cart"
                className="bg-amber-100 p-3 rounded-[5px] text-black"
              >
                <FaShoppingBag />
              </Link>

              {user ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Logout
                  </button>
                  <Link
                    to="/dashboard"
                    className="bg-amber-100 p-3 rounded-[5px] text-black"
                  >
                    <FaRegUserCircle />
                  </Link>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-amber-100 p-3 rounded-[5px] text-black"
                >
                  <FaRegUserCircle />
                </Link>
              )}
            </ul>
          </div>
        </nav>
      </header>

      <div className="flex flex-col items-center min-h-screen p-6 gap-8 w-full">
        {savedAddress && !addressSaved && (
          <div className="w-full max-w-3xl bg-green-100 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Saved Address
            </h2>
            <div className="text-gray-700">
              <p>
                <strong>Name:</strong> {savedAddress.firstName}{" "}
                {savedAddress.lastName}
              </p>
              <p>
                <strong>Email:</strong> {savedAddress.email}
              </p>
              <p>
                <strong>Phone:</strong> {savedAddress.phoneNumber}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {savedAddress.streetAddress}, {savedAddress.area},{" "}
                {savedAddress.city}, {savedAddress.country},{" "}
                {savedAddress.postalCode}
              </p>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-yellow-400 rounded-2xl"
              onClick={() => setAddressSaved(true)}
            >
              Use This Address
            </button>
          </div>
        )}

        {!addressSaved && (
          <div className="w-full max-w-3xl bg-white p-6 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Billing Address
            </h1>
            <form
              onSubmit={saveAddress}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {saveError && (
                <p className="md:col-span-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm text-center">
                  {saveError}
                </p>
              )}
              <FormInput
                id="firstName"
                placeholder="First Name"
                required
                onChange={handleInputChange}
                value={formData.firstName}
              />
              <FormInput
                id="lastName"
                placeholder="Last Name"
                required
                onChange={handleInputChange}
                value={formData.lastName}
              />
              <FormInput
                id="email"
                placeholder="Email"
                type="email"
                required
                fullWidth
                onChange={handleInputChange}
                value={formData.email}
              />
              <FormInput
                id="phoneNumber"
                placeholder="Phone Number"
                type="tel"
                required
                fullWidth
                onChange={handleInputChange}
                value={formData.phoneNumber}
              />
              <FormInput
                id="country"
                placeholder="Country"
                required
                onChange={handleInputChange}
                value={formData.country}
              />
              <FormInput
                id="city"
                placeholder="City"
                required
                onChange={handleInputChange}
                value={formData.city}
              />
              <FormInput
                id="streetAddress"
                placeholder="Street Address"
                required
                fullWidth
                onChange={handleInputChange}
                value={formData.streetAddress}
              />
              <FormInput
                id="area"
                placeholder="Area"
                required
                onChange={handleInputChange}
                value={formData.area}
              />
              <FormInput
                id="postalCode"
                placeholder="Postal Code"
                required
                onChange={handleInputChange}
                value={formData.postalCode}
              />

              <div className="md:col-span-2 grid justify-center">
                <button
                  type="submit"
                  className="p-3 bg-amber-400 rounded-2xl text-[18px]"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        )}

        {addressSaved && (
          <div className="shadow-2xl rounded-2xl p-8 w-full max-w-md transition-transform transform hover:scale-[1.01]">
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
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" /> Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" /> Pay ₹{checkoutData.amount}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 mt-4">
                Your payment is encrypted and 100% secure.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}



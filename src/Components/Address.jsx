import React, { useEffect, useMemo, useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import {
  CreditCard,
  Loader2,
  ChevronRight,
  Home,
  MapPin,
  Lock,
  ShieldCheck,
  Tag,
  PencilLine,
  CheckCircle2,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { clearUser } from "../Feature/Slicetwo";
import {
  setCheckoutData,
  clearCheckoutData,
  ADDRESS_CONFIRMED_KEY,
} from "../Feature/Slicethree.jsx";
import SiteHeader from "./SiteHeader.jsx";
import axios from "axios";
import {
  getDailyCoupon,
  markCouponUsage,
  validateCoupon,
} from "../utils/coupons";
import { useTheme } from "../context/ThemeContext.jsx";

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

function pickAddressFields(src) {
  if (!src || typeof src !== "object") return emptyAddressForm();
  const base = emptyAddressForm();
  for (const key of Object.keys(base)) {
    const v = src[key];
    base[key] = v != null && v !== "" ? String(v) : "";
  }
  return base;
}

function formatMoney(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return "0";
  return x.toLocaleString("en-IN");
}

function isAddressComplete(a) {
  return !!(
    a.firstName &&
    a.lastName &&
    a.email &&
    a.phoneNumber &&
    a.streetAddress &&
    a.area &&
    a.city &&
    a.country &&
    a.postalCode
  );
}

const FormField = ({
  id,
  label,
  hint,
  fullWidth = false,
  className = "",
  ...props
}) => (
  <div className={fullWidth ? "md:col-span-2" : ""}>
    <label
      htmlFor={id}
      className="block text-xs font-semibold uppercase tracking-wide text-zinc-800 dark:text-zinc-400 mb-1.5"
    >
      {label}
    </label>
    <input
      id={id}
      name={id}
      className={`w-full px-3.5 py-2.5 text-sm rounded-sm border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-300 dark:border-zinc-600 placeholder:text-zinc-500 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#2874f0] focus:border-[#2874f0] transition ${className}`}
      {...props}
    />
    {hint ? (
      <p className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-500">{hint}</p>
    ) : null}
  </div>
);

export default function CheckoutWithAddress() {
  const { isDark } = useTheme();
  const user = useSelector((state) => state.user.userData);
  const checkoutData = useSelector((state) => state.checkout);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(emptyAddressForm);
  const [loading, setLoading] = useState(false);
  const [addressSaved, setAddressSaved] = useState(false);
  const [savedAddress, setSavedAddress] = useState(null);
  const [saveError, setSaveError] = useState("");
  const [couponInput, setCouponInput] = useState(checkoutData.couponCode || "");
  const [couponMessage, setCouponMessage] = useState("");
  const [couponError, setCouponError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  /** When false and we have a saved snapshot, show “Deliver here” instead of the full form. */
  const [addressFormExpanded, setAddressFormExpanded] = useState(true);

  const dailyCoupon = useMemo(() => getDailyCoupon(), []);
  const subtotal = Number(checkoutData.subtotal || checkoutData.amount || 0);
  const discount = Number(checkoutData.discount || 0);
  const finalAmount = Math.max(0, subtotal - discount);

  const shell = isDark ? "bg-zinc-950 text-zinc-100" : "bg-[#f1f3f6] text-zinc-900";
  /* Use off-white card in light mode so copy stays readable even if global dark CSS targets .bg-white */
  const card = isDark
    ? "bg-zinc-900 border border-zinc-800 shadow-sm"
    : "bg-zinc-50 border border-zinc-200 shadow-sm";

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
          if (isAddressComplete(fields)) setAddressFormExpanded(false);
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
        if (isAddressComplete(fields)) setAddressFormExpanded(false);
      } catch {
        localStorage.removeItem("savedAddress");
      }
    } else if (user?._id) {
      fetchAddress();
    }
  }, [user]);

  /** After refresh, restore “address confirmed → show payment” when flag + saved address exist. */
  useEffect(() => {
    try {
      if (localStorage.getItem(ADDRESS_CONFIRMED_KEY) !== "true") return;
      if (!isAddressComplete(formData)) return;
      setAddressSaved(true);
      setAddressFormExpanded(false);
    } catch {
      /* ignore */
    }
  }, [formData]);

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
    dispatch(clearCheckoutData());
    try {
      await axios.post(`${API_USER}/logout`, {}, { withCredentials: true });
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const addressSummaryLines = useMemo(() => {
    const a = formData;
    const name = [a.firstName, a.lastName].filter(Boolean).join(" ");
    const line1 = [a.streetAddress, a.area].filter(Boolean).join(", ");
    const line2 = [a.city, a.country, a.postalCode].filter(Boolean).join(", ");
    return { name, line1, line2, email: a.email, phone: a.phoneNumber };
  }, [formData]);

  const hasAddressBasics = isAddressComplete(formData);

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
      setAddressFormExpanded(false);
      localStorage.setItem("savedAddress", JSON.stringify(normalized));
      try {
        localStorage.setItem(ADDRESS_CONFIRMED_KEY, "true");
      } catch {
        /* ignore */
      }
    } catch (err) {
      console.error(err);
      setSaveError("Network error while saving address.");
    }
  };

  const useLoadedAddress = () => {
    if (!hasAddressBasics) {
      setSaveError("Complete the address form or fill all required fields.");
      return;
    }
    setAddressSaved(true);
    setAddressFormExpanded(false);
    setSaveError("");
    try {
      localStorage.setItem(ADDRESS_CONFIRMED_KEY, "true");
    } catch {
      /* ignore */
    }
  };

  const initiatePayment = async () => {
    setPaymentError("");
    if (!hasAddressBasics) {
      setPaymentError("Add a complete delivery address before paying.");
      setAddressSaved(false);
      return;
    }
    setLoading(true);
    try {
      const payerName =
        checkoutData.name ||
        [formData.firstName, formData.lastName].filter(Boolean).join(" ") ||
        "Guest User";
      const payerEmail =
        checkoutData.email || formData.email || "guest@solemate.local";
      const payerPhone = (formData.phoneNumber || "").replace(/\D/g, "") || "9876543210";

      const res = await fetch(`${API_USER}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          name: payerName,
          email: payerEmail,
          phone: payerPhone,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPaymentError(
          data.message || data.error || "Could not start payment. Try again."
        );
        return;
      }
      if (!data.payment_session_id || !data.order_id) {
        setPaymentError("Invalid response from payment server.");
        return;
      }

      localStorage.setItem("orderId", data.order_id);
      if (checkoutData.couponCode) {
        markCouponUsage(checkoutData.couponCode);
      }

      const mode =
        import.meta.env?.VITE_CASHFREE_MODE === "production"
          ? "production"
          : "sandbox";
      const cashfree = await load({ mode });
      cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_self",
      });
    } catch (err) {
      console.error("Payment error:", err);
      setPaymentError("Something went wrong. Check your connection and retry.");
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = () => {
    setCouponError("");
    setCouponMessage("");
    const result = validateCoupon(couponInput, subtotal);
    if (!result.valid) {
      setCouponError(result.message);
      return;
    }

    dispatch(
      setCheckoutData({
        ...checkoutData,
        amount: result.finalTotal,
        discount: result.discount,
        couponCode: result.coupon.code,
        couponType: result.coupon.type,
        couponValue: result.coupon.value,
        subtotal,
      })
    );
    setCouponMessage(result.message);
  };

  const clearAppliedCoupon = () => {
    setCouponInput("");
    setCouponMessage("");
    setCouponError("");
    dispatch(
      setCheckoutData({
        ...checkoutData,
        amount: subtotal,
        discount: 0,
        couponCode: "",
        couponType: "",
        couponValue: 0,
        subtotal,
      })
    );
  };

  const openAddressEditor = () => {
    try {
      localStorage.removeItem(ADDRESS_CONFIRMED_KEY);
    } catch {
      /* ignore */
    }
    setAddressSaved(false);
    setAddressFormExpanded(true);
    setSaveError("");
  };

  const showSavedAddressCard =
    Boolean(savedAddress) &&
    !addressSaved &&
    hasAddressBasics &&
    !addressFormExpanded;

  const showAddressForm =
    !addressSaved &&
    (!savedAddress || !hasAddressBasics || addressFormExpanded);

  return (
    <div className={`min-h-screen ${shell}`}>
      <SiteHeader onLogout={handleLogout} maxWidthClass="max-w-6xl" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <nav
          className="flex items-center gap-1 text-xs text-zinc-800 dark:text-zinc-400 mb-6"
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
          <Link
            to="/cart"
            className="text-zinc-800 dark:text-zinc-300 hover:text-[#2874f0] dark:hover:text-blue-400"
          >
            Cart
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-500 shrink-0" />
          <span className="text-zinc-900 dark:text-zinc-200 font-semibold">
            Checkout
          </span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-start">
          <div className="flex-1 min-w-0 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2 text-sm">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    !addressSaved
                      ? "bg-[#2874f0] text-white"
                      : "bg-emerald-500 text-white"
                  }`}
                >
                  {!addressSaved ? "1" : <CheckCircle2 className="w-4 h-4" />}
                </span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-100">
                  Delivery
                </span>
              </div>
              <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700 max-w-[48px]" />
              <div className="flex items-center gap-2 text-sm">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    addressSaved
                      ? "bg-[#2874f0] text-white"
                      : "bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-400"
                  }`}
                >
                  2
                </span>
                <span
                  className={`font-semibold ${
                    addressSaved
                      ? "text-zinc-800 dark:text-zinc-100"
                      : "text-zinc-700 dark:text-zinc-500"
                  }`}
                >
                  Payment
                </span>
              </div>
            </div>

            {showSavedAddressCard && (
              <div className={`rounded-sm p-5 ${card}`}>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-[#2874f0]/10 text-[#2874f0]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                      Use saved address?
                    </h2>
                    <p className="text-sm text-zinc-800 dark:text-zinc-300 mt-2 leading-relaxed">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {addressSummaryLines.name}
                      </span>
                      <br />
                      {addressSummaryLines.line1}
                      <br />
                      {addressSummaryLines.line2}
                      <br />
                      <span className="text-xs text-zinc-700 dark:text-zinc-400">
                        {addressSummaryLines.email} · {addressSummaryLines.phone}
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-3 mt-4">
                      <button
                        type="button"
                        onClick={useLoadedAddress}
                        className="px-5 py-2.5 text-sm font-bold uppercase tracking-wide rounded-sm bg-[#2874f0] text-white hover:bg-[#1a5dcc] transition shadow-sm"
                      >
                        Deliver here
                      </button>
                      <button
                        type="button"
                        onClick={openAddressEditor}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-sm border border-zinc-400 dark:border-zinc-600 text-zinc-900 dark:text-zinc-200 bg-white dark:bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                      >
                        <PencilLine className="w-4 h-4" />
                        Edit address
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showAddressForm && (
              <div className={`rounded-sm p-5 sm:p-6 ${card}`}>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-5 h-5 text-[#2874f0]" />
                  <h1 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    Delivery address
                  </h1>
                </div>
                <p className="text-sm text-zinc-800 dark:text-zinc-400 mb-6">
                  Enter the address where you want your order delivered.
                </p>

                <form
                  onSubmit={saveAddress}
                  className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4"
                >
                  {saveError && (
                    <p className="md:col-span-2 p-3 rounded-sm bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-sm border border-red-100 dark:border-red-900/50">
                      {saveError}
                    </p>
                  )}
                  <FormField
                    id="firstName"
                    name="firstName"
                    label="First name"
                    placeholder="e.g. Rahul"
                    required
                    autoComplete="given-name"
                    onChange={handleInputChange}
                    value={formData.firstName}
                  />
                  <FormField
                    id="lastName"
                    name="lastName"
                    label="Last name"
                    placeholder="e.g. Sharma"
                    required
                    autoComplete="family-name"
                    onChange={handleInputChange}
                    value={formData.lastName}
                  />
                  <FormField
                    id="email"
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    fullWidth
                    autoComplete="email"
                    onChange={handleInputChange}
                    value={formData.email}
                  />
                  <FormField
                    id="phoneNumber"
                    name="phoneNumber"
                    label="Mobile number"
                    type="tel"
                    placeholder="10-digit mobile"
                    required
                    fullWidth
                    autoComplete="tel"
                    onChange={handleInputChange}
                    value={formData.phoneNumber}
                    hint="Used for delivery updates only."
                  />
                  <FormField
                    id="streetAddress"
                    name="streetAddress"
                    label="Street / house no."
                    placeholder="Flat, building, street"
                    required
                    fullWidth
                    onChange={handleInputChange}
                    value={formData.streetAddress}
                  />
                  <FormField
                    id="area"
                    name="area"
                    label="Area / locality"
                    placeholder="Area, sector, landmark"
                    required
                    fullWidth
                    onChange={handleInputChange}
                    value={formData.area}
                  />
                  <FormField
                    id="city"
                    name="city"
                    label="City"
                    placeholder="City"
                    required
                    onChange={handleInputChange}
                    value={formData.city}
                  />
                  <FormField
                    id="country"
                    name="country"
                    label="Country"
                    placeholder="Country"
                    required
                    onChange={handleInputChange}
                    value={formData.country}
                  />
                  <FormField
                    id="postalCode"
                    name="postalCode"
                    label="Pincode"
                    placeholder="6 digits"
                    required
                    onChange={handleInputChange}
                    value={formData.postalCode}
                  />

                  <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center flex-wrap gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-8 py-3 text-sm font-bold uppercase tracking-wide rounded-sm bg-[#2874f0] text-white hover:bg-[#1a5dcc] transition shadow-sm disabled:opacity-50"
                      disabled={!user?._id}
                    >
                      Save & continue
                    </button>
                    {!user?._id && hasAddressBasics && (
                      <button
                        type="button"
                        onClick={() => {
                          setAddressSaved(true);
                          setAddressFormExpanded(false);
                          setSaveError("");
                          try {
                            localStorage.setItem(ADDRESS_CONFIRMED_KEY, "true");
                          } catch {
                            /* ignore */
                          }
                        }}
                        className="px-8 py-3 text-sm font-bold uppercase tracking-wide rounded-sm border-2 border-[#2874f0] text-[#2874f0] dark:text-blue-400 dark:border-blue-400 hover:bg-[#2874f0]/5 transition"
                      >
                        Continue as guest
                      </button>
                    )}
                    {!user?._id && (
                      <span className="text-sm text-amber-800 dark:text-amber-400 w-full sm:w-auto">
                        Save & continue requires an account. Guests can use
                        continue as guest.
                      </span>
                    )}
                  </div>
                </form>
              </div>
            )}

            {addressSaved && (
              <div className={`rounded-sm p-5 ${card}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                        Delivering to
                      </h2>
                      <p className="text-sm text-zinc-800 dark:text-zinc-300 mt-2 leading-relaxed">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {addressSummaryLines.name}
                        </span>
                        <br />
                        {addressSummaryLines.line1}
                        <br />
                        {addressSummaryLines.line2}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={openAddressEditor}
                    className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2874f0] dark:text-blue-400 hover:underline"
                  >
                    <PencilLine className="w-4 h-4" />
                    Change
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-24 space-y-4">
            <div className={`rounded-sm p-5 ${card}`}>
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-400 mb-4">
                Price details
              </h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-zinc-800 dark:text-zinc-300 font-medium">
                  <span>Subtotal</span>
                  <span>₹{formatMoney(subtotal)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                  <span>Discount</span>
                  <span>− ₹{formatMoney(discount)}</span>
                </div>
                <div className="border-t border-zinc-200 dark:border-zinc-700 pt-3 mt-3 flex justify-between items-baseline">
                  <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    Total
                  </span>
                  <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    ₹{formatMoney(finalAmount)}
                  </span>
                </div>
              </div>
              {checkoutData.couponCode && (
                <button
                  type="button"
                  onClick={clearAppliedCoupon}
                  className="mt-3 text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
                >
                  Remove coupon ({checkoutData.couponCode})
                </button>
              )}
            </div>

            {addressSaved && (
              <div className={`rounded-sm p-5 ${card}`}>
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-[#2874f0]" />
                  <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    Payment
                  </h2>
                </div>

                <div
                  className={`rounded-sm p-3 mb-4 text-xs border ${
                    isDark
                      ? "bg-amber-950/30 border-amber-900/40 text-amber-100"
                      : "bg-amber-50 border-amber-100 text-amber-950"
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold mb-1">
                    <Tag className="w-3.5 h-3.5" />
                    Today&apos;s offer
                  </div>
                  <p>
                    Code <span className="font-mono font-bold">{dailyCoupon.code}</span> —{" "}
                    {dailyCoupon.description}
                  </p>
                </div>

                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-800 dark:text-zinc-400 block mb-1.5">
                  Coupon
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) =>
                      setCouponInput(e.target.value.toUpperCase())
                    }
                    placeholder="Enter code"
                    className="flex-1 min-w-0 px-3 py-2.5 text-sm rounded-sm border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="px-4 py-2.5 text-sm font-bold uppercase rounded-sm bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition shrink-0"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-3">
                    {couponMessage}
                  </p>
                )}
                {couponError && (
                  <p className="text-xs text-red-600 dark:text-red-400 mb-3">
                    {couponError}
                  </p>
                )}

                {paymentError && (
                  <p className="mb-3 p-2.5 rounded-sm text-sm bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-900/50">
                    {paymentError}
                  </p>
                )}

                <button
                  type="button"
                  onClick={initiatePayment}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-bold uppercase tracking-wide rounded-sm bg-[#2874f0] text-white hover:bg-[#1a5dcc] shadow-sm transition disabled:opacity-55 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" />
                      Starting…
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 opacity-90" />
                      Pay ₹{formatMoney(finalAmount)}
                    </>
                  )}
                </button>

                <div className="mt-4 flex flex-col gap-2 text-xs text-zinc-800 dark:text-zinc-400">
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    Secured by Cashfree. Cards, UPI, and wallets supported.
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Lock className="w-4 h-4 text-zinc-600 dark:text-zinc-500 shrink-0" />
                    Your payment details are encrypted in transit.
                  </span>
                </div>
              </div>
            )}

            {!addressSaved && (
              <div
                className={`rounded-sm p-4 text-sm text-zinc-900 dark:text-zinc-300 border border-dashed font-medium ${
                  isDark ? "border-zinc-700 bg-zinc-900/50" : "border-zinc-400 bg-white"
                }`}
              >
                <Lock className="w-4 h-4 inline mr-1.5 text-zinc-700 dark:text-zinc-400 align-text-bottom" />
                Complete your delivery address to unlock payment and apply
                coupons.
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

const BASE_COUPONS = [
  {
    code: "SOLE10",
    type: "percentage",
    value: 10,
    description: "10% off on your order",
    usageLimit: 120,
  },
  {
    code: "RUN200",
    type: "flat",
    value: 200,
    description: "Flat ₹200 off",
    usageLimit: 180,
  },
  {
    code: "MOVE15",
    type: "percentage",
    value: 15,
    description: "15% off for premium picks",
    usageLimit: 90,
  },
];

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const COUPON_STORAGE_KEY = "coupon_usage_state";

const normalizeDay = (date) => new Date(date).toISOString().slice(0, 10);

const createExpiryFromDay = (dayStamp, daysToAdd = 1) => {
  const base = new Date(`${dayStamp}T00:00:00.000Z`);
  return new Date(base.getTime() + daysToAdd * DAY_IN_MS).toISOString();
};

const getUsageState = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(COUPON_STORAGE_KEY) || "{}");
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
};

const saveUsageState = (state) => {
  localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(state));
};

export const getDailyCoupon = (date = new Date()) => {
  const dayStamp = normalizeDay(date);
  const seed = Math.floor(new Date(dayStamp).getTime() / DAY_IN_MS);
  const picked = BASE_COUPONS[Math.abs(seed) % BASE_COUPONS.length];

  return {
    ...picked,
    dayStamp,
    expiresAt: createExpiryFromDay(dayStamp, 1),
  };
};

export const validateCoupon = (couponInput, subtotal) => {
  const code = String(couponInput || "").trim().toUpperCase();
  if (!code) {
    return { valid: false, message: "Please enter a coupon code." };
  }

  if (!Number.isFinite(subtotal) || subtotal <= 0) {
    return { valid: false, message: "Your cart is empty." };
  }

  const dailyCoupon = getDailyCoupon();
  if (dailyCoupon.code !== code) {
    return { valid: false, message: "Invalid coupon for today." };
  }

  const now = Date.now();
  if (new Date(dailyCoupon.expiresAt).getTime() <= now) {
    return { valid: false, message: "Coupon expired. Try today's new coupon." };
  }

  const usageState = getUsageState();
  const currentDay = dailyCoupon.dayStamp;
  const dayUsage = usageState[currentDay] || {};
  const currentUsage = Number(dayUsage[code] || 0);
  if (currentUsage >= dailyCoupon.usageLimit) {
    return { valid: false, message: "Coupon usage limit reached for today." };
  }

  const discount =
    dailyCoupon.type === "percentage"
      ? Math.round((subtotal * dailyCoupon.value) / 100)
      : Math.round(dailyCoupon.value);

  const safeDiscount = Math.max(0, Math.min(discount, subtotal));
  return {
    valid: true,
    message: `Coupon ${code} applied successfully.`,
    coupon: dailyCoupon,
    discount: safeDiscount,
    finalTotal: Math.max(0, subtotal - safeDiscount),
  };
};

export const markCouponUsage = (couponCode, date = new Date()) => {
  const code = String(couponCode || "").trim().toUpperCase();
  if (!code) return;

  const dayStamp = normalizeDay(date);
  const state = getUsageState();
  const dayUsage = state[dayStamp] || {};
  dayUsage[code] = Number(dayUsage[code] || 0) + 1;
  state[dayStamp] = dayUsage;
  saveUsageState(state);
};

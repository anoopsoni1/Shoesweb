import { setCart } from "../Feature/slice.jsx";

const API_USER = "https://shoesbackend-4.onrender.com/api/v1/user";

function normalizeLine(product) {
  return {
    id: product.id,
    name: product.name,
    price: Number(product.price) || 0,
    quantity: 1,
    image: product.image != null ? String(product.image) : "",
  };
}

function mergeGuestLine(prevCart, product) {
  const cart = Array.isArray(prevCart) ? [...prevCart] : [];
  const sid = String(product.id);
  const idx = cart.findIndex((item) => String(item.id ?? item._id) === sid);
  if (idx === -1) {
    return [...cart, { ...product, ...normalizeLine(product), quantity: 1 }];
  }
  return cart.map((item, i) =>
    i === idx
      ? {
          ...item,
          quantity: (Number(item.quantity) || 1) + 1,
        }
      : item
  );
}

/**
 * Add one unit of a product to the cart (guest: Redux + localStorage; logged-in: POST then sync from server).
 * @param {{ product: object, user: object | null, dispatch: import("@reduxjs/toolkit").Dispatch, getState: () => object }} args
 * @returns {Promise<{ ok: boolean, message?: string, guest?: boolean }>}
 */
export async function addLineToCart({ product, user, dispatch, getState }) {
  if (product == null || product.id == null) {
    return { ok: false, message: "Invalid product." };
  }

  if (!user?._id) {
    const prev = getState().cart?.cartitem ?? [];
    dispatch(setCart(mergeGuestLine(prev, product)));
    return { ok: true, guest: true };
  }

  const res = await fetch(`${API_USER}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      userId: user._id,
      items: [normalizeLine(product)],
    }),
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    const msg =
      (typeof data.message === "string" && data.message) ||
      (typeof data.error === "string" && data.error) ||
      `Could not add to cart (${res.status})`;
    return { ok: false, message: msg };
  }

  if (!Array.isArray(data.items)) {
    return {
      ok: false,
      message: "Server returned an invalid cart. Please try again.",
    };
  }

  dispatch(setCart(data.items));
  return { ok: true };
}

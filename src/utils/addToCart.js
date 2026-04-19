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

async function syncCartFromServer(userId, dispatch) {
  try {
    const cartdata = await fetch(`${API_USER}/getcart/${userId}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const data = await cartdata.json().catch(() => ({}));
    if (Array.isArray(data.items)) dispatch(setCart(data.items));
  } catch (e) {
    console.error("syncCartFromServer", e);
  }
}

/**
 * After login: push local guest cart lines to the server cart (merge quantities),
 * then replace Redux with the saved server cart.
 */
export async function mergeGuestCartAfterLogin(userId, dispatch, getState) {
  const id = String(userId ?? "").trim();
  if (!id) return;
  const local = getState().cart?.cartitem ?? [];
  if (!Array.isArray(local) || local.length === 0) {
    await syncCartFromServer(id, dispatch);
    return;
  }

  const items = local.map((i) => ({
    id: i.id ?? i._id,
    name: i.name,
    price: Number(i.price) || 0,
    quantity: Math.max(1, Number(i.quantity) || 1),
    image: i.image != null ? String(i.image) : "",
  }));

  try {
    const res = await fetch(`${API_USER}/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userId: id, items }),
    });
    const data = await res.json().catch(() => ({}));
    if (Array.isArray(data.items)) {
      dispatch(setCart(data.items));
      return;
    }
  } catch (e) {
    console.error("mergeGuestCartAfterLogin", e);
  }
  await syncCartFromServer(id, dispatch);
}

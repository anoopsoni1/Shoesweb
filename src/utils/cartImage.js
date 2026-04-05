import {
  defaultShoeThumbnailUrl,
  shoeImageForProduct,
} from "./productImages.js";

/** Shoe-only thumbnail if URL is missing or fails to load */
export const CART_IMAGE_FALLBACK = defaultShoeThumbnailUrl(200);

/**
 * Cart/API may store `./List01.jpg` (breaks on /cart/...) or full URLs.
 * If empty, uses a shoe photo for that product id when possible.
 */
export function resolveCartItemImage(src, productId) {
  const s = typeof src === "string" ? src.trim() : "";
  if (!s) {
    const n = Number(productId);
    if (Number.isFinite(n) && n >= 1) return shoeImageForProduct(n, 256);
    return CART_IMAGE_FALLBACK;
  }
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith("//")) return `https:${s}`;
  if (s.startsWith("/")) return s;
  const file = s.replace(/^\.\//, "").split("/").pop();
  return file ? `/${file}` : CART_IMAGE_FALLBACK;
}

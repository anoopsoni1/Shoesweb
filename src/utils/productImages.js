/**
 * Footwear-only Unsplash photo slugs (sneakers, boots, sandals, dress shoes).
 * CDN: ixlib + fit=max keeps loads reliable.
 */
export const SHOE_CATALOG_SLUGS = [
  "photo-1542291026-7eec264c27ff",
  "photo-1595950653106-6c9ebd614d3a",
  "photo-1606107557195-0e29a4b5b4aa",
  "photo-1525966222134-fcfa99b8ae77",
  "photo-1551107696-4b2c5a8560c8",
  "photo-1560769629-975ec94e6a86",
  "photo-1543163521-1bf539c55dd2",
  "photo-1549298916-b41d501d3772",
  "photo-1460353581641-37baddab0fa2",
  "photo-1591561954557-17932c501fd6",
  "photo-1578118190859-43f98edd2ab9",
  "photo-1556906781-9a412961c28c",
  "photo-1594736797933-d0801ba62e17",
  "photo-1533867617858-e7b97e060509",
  "photo-1614252369475-531eba43653c",
  "photo-1603487742131-416185ec15ac",
  "photo-1582582621959-536a623750b5",
  "photo-1579338559194-7ea3a35cf0b4",
  "photo-1514986888952-8cd320577b68",
  "photo-1544441893-675973e319f0",
  "photo-1608231387042-94d928691516",
];

export function buildUnsplashUrl(photoSlug, width = 800) {
  const slug = String(photoSlug).trim().replace(/^\//, "");
  return `https://images.unsplash.com/${slug}?ixlib=rb-4.0.3&auto=format&fit=max&w=${width}&q=80`;
}

/** One shoe image per catalog product id (1-based). */
export function shoeImageForProduct(productId, width = 800) {
  const n = Number(productId);
  const idx = Number.isFinite(n) && n >= 1 ? (n - 1) % SHOE_CATALOG_SLUGS.length : 0;
  return buildUnsplashUrl(SHOE_CATALOG_SLUGS[idx], width);
}

/** Alternate shoe URL if primary fails (still footwear only). */
export function shoeImageFallbackForProduct(productId, width = 800) {
  const n = Number(productId);
  const idx =
    Number.isFinite(n) && n >= 1
      ? (n + 6) % SHOE_CATALOG_SLUGS.length
      : 3 % SHOE_CATALOG_SLUGS.length;
  return buildUnsplashUrl(SHOE_CATALOG_SLUGS[idx], width);
}

export const defaultShoeThumbnailUrl = (width = 200) =>
  buildUnsplashUrl(SHOE_CATALOG_SLUGS[0], width);

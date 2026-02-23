/** Brand name → logo SVG path mapping */
const BRAND_LOGOS: Record<string, string> = {
  Sigenergy: '/brands/sigenergy.png',
  FoxESS: '/brands/foxess.png',
  Huawei: '/brands/huawei.png',
  GoodWe: '/brands/goodwe.png',
  Dyness: '/brands/dyness.png',
  'Keno Energy': '/brands/keno.png',
  Keno: '/brands/keno.png',
};

/**
 * Get logo path(s) for a brand string.
 * Handles compound brands like "GoodWe/Dyness" or "GoodWe + Lynx".
 * Returns array of { src, alt } objects.
 */
export function getBrandLogos(brand: string): { src: string; alt: string }[] {
  // Try exact match first
  if (BRAND_LOGOS[brand]) {
    return [{ src: BRAND_LOGOS[brand], alt: brand }];
  }

  // Split compound brands: "GoodWe/Dyness", "GoodWe + Dyness", "GoodWe / Dyness"
  const parts = brand.split(/[\/+]/).map((p) => p.trim());
  const logos: { src: string; alt: string }[] = [];

  for (const part of parts) {
    if (BRAND_LOGOS[part]) {
      logos.push({ src: BRAND_LOGOS[part], alt: part });
    }
  }

  // Fallback: return logo for first recognized part, or empty
  return logos.length > 0 ? logos : [{ src: BRAND_LOGOS[parts[0]] || '', alt: brand }];
}

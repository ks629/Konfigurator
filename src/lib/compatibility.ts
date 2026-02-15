import { InstallationType, Product, Inverter } from './types';
import { allProducts, inverters, availableCapacities } from '@/data/products';

export function roundToNearestCapacity(capacity: number): number {
  let nearest = availableCapacities[0];
  let minDiff = Math.abs(capacity - nearest);

  for (const cap of availableCapacities) {
    const diff = Math.abs(capacity - cap);
    if (diff < minDiff) {
      minDiff = diff;
      nearest = cap;
    }
  }
  return nearest;
}

export function calculateRecommendedCapacity(
  pvPowerKwp: number,
  hasHeatPump: boolean,
  hasEV: boolean,
  backupImportant: boolean
): number {
  let base = pvPowerKwp * 2;
  // Pompa ciepła i EV zwiększają zapotrzebowanie na energię (w kalkulacji ROI),
  // ale NIE zwiększają wymaganej pojemności magazynu (wymóg dotacji: PV×2)
  base = Math.max(base, 10); // minimalna pojemność 10 kWh
  return roundToNearestCapacity(base);
}

function findInverterForProduct(productId: string): Inverter | undefined {
  return inverters.find((inv) => inv.compatible_batteries.includes(productId));
}

export interface RecommendationSet {
  recommended: {
    product: Product;
    inverter?: Inverter;
  };
  economic: {
    product: Product;
    inverter?: Inverter;
  } | null;
  premium: {
    product: Product;
    inverter?: Inverter;
  } | null;
}

export function getRecommendations(
  installationType: InstallationType,
  pvPowerKwp: number,
  hasHeatPump: boolean,
  hasEV: boolean,
  backupImportant: boolean
): RecommendationSet | null {
  const recCapacity = calculateRecommendedCapacity(
    pvPowerKwp,
    hasHeatPump,
    hasEV,
    backupImportant
  );

  // Sortuj wszystkie produkty: najpierw po bliskości pojemności, potem po cenie (najtańsza)
  const sorted = [...allProducts].sort((a, b) => {
    const diffA = Math.abs(a.capacity_kwh - recCapacity);
    const diffB = Math.abs(b.capacity_kwh - recCapacity);
    if (diffA !== diffB) return diffA - diffB;
    return a.price_gross - b.price_gross;
  });

  if (sorted.length === 0) return null;

  // Najtańsza opcja o najbliższej pojemności = rekomendacja
  const recProduct = sorted[0];

  // Zbierz kolejne opcje (inne marki/zestawy) o zbliżonej pojemności
  const candidates = sorted.filter(p => p.id !== recProduct.id);

  // Zapewnij min 1× Sigenergy lub Huawei w wynikach
  const premiumBrands = ['Sigenergy', 'Huawei'];
  const isPremiumRec = premiumBrands.includes(recProduct.brand);

  let econResult: { product: Product; inverter?: Inverter } | null = null;
  let premResult: { product: Product; inverter?: Inverter } | null = null;

  if (isPremiumRec) {
    // Rekomendacja to premium marka — szukaj 2 innych (najtańszych)
    const others = candidates.filter(p => p.id !== recProduct.id);
    if (others.length >= 1) {
      econResult = { product: others[0], inverter: findInverterForProduct(others[0].id) };
    }
    if (others.length >= 2) {
      premResult = { product: others[1], inverter: findInverterForProduct(others[1].id) };
    }
  } else {
    // Rekomendacja to standard — szukaj 1 innej standard + 1 premium
    const otherStandard = candidates.find(p => !premiumBrands.includes(p.brand));
    const premiumOption = candidates.find(p => premiumBrands.includes(p.brand));

    if (otherStandard) {
      econResult = { product: otherStandard, inverter: findInverterForProduct(otherStandard.id) };
    }
    if (premiumOption) {
      premResult = { product: premiumOption, inverter: findInverterForProduct(premiumOption.id) };
    }

    // Jeśli brak drugiej opcji, bierz cokolwiek
    if (!econResult && candidates.length >= 1) {
      econResult = { product: candidates[0], inverter: findInverterForProduct(candidates[0].id) };
    }
    if (!premResult && candidates.length >= 2) {
      const alt = candidates.find(p => p.id !== econResult?.product.id);
      if (alt) premResult = { product: alt, inverter: findInverterForProduct(alt.id) };
    }
  }

  return {
    recommended: { product: recProduct, inverter: findInverterForProduct(recProduct.id) },
    economic: econResult,
    premium: premResult,
  };
}

export interface ProductOption {
  product: Product;
  inverter?: Inverter;
}

/** Marki best-seller (FoxESS) */
const BESTSELLER_BRANDS = ['FoxESS'];
/** Marki premium (Sigenergy) */
const PREMIUM_BRANDS = ['Sigenergy'];

/**
 * Get all eligible products for a given min capacity.
 * Min capacity = pvPowerKwp × 2 (subsidy requirement), at least 10 kWh.
 */
export function getAllEligibleProducts(
  pvPowerKwp: number,
  hasHeatPump: boolean,
  hasEV: boolean,
  backupImportant: boolean
): ProductOption[] {
  // Min capacity = PV×2 (wymóg dotacji), min 10 kWh
  // Pompa/EV wpływają na zapotrzebowanie, nie na pojemność
  let minCapacity = pvPowerKwp * 2;
  minCapacity = Math.max(minCapacity, 10);

  const eligible = allProducts
    .filter(p => p.capacity_kwh >= minCapacity)
    .sort((a, b) => {
      if (a.capacity_kwh !== b.capacity_kwh) return a.capacity_kwh - b.capacity_kwh;
      return a.price_gross - b.price_gross;
    });

  return eligible.map(p => ({
    product: p,
    inverter: findInverterForProduct(p.id),
  }));
}

export interface TopPicks {
  cheapest: ProductOption;       // Najtańszy — GoodWe/Dyness
  bestSeller: ProductOption;     // Best Seller — FoxESS
  premium: ProductOption;        // Premium — Sigenergy
}

/**
 * @deprecated Use getRecommendedProducts instead
 */
export function getTopPicks(
  pvPowerKwp: number,
  hasHeatPump: boolean,
  hasEV: boolean,
): TopPicks | null {
  const result = getRecommendedProducts(pvPowerKwp, hasHeatPump, hasEV);
  if (!result) return null;
  return {
    cheapest: result.recommended,
    bestSeller: result.others[0] || result.recommended,
    premium: result.others[1] || result.recommended,
  };
}

export interface RecommendedProducts {
  recommended: ProductOption;     // Wyróżniony zestaw (najtańszy pasujący)
  others: ProductOption[];        // Kolejne unikalne zestawy (max 5)
}

/**
 * 1 wyróżniony zestaw + max 5 kolejnych pasujących (bez duplikatów).
 * Najtańszy z każdej marki, potem kolejne warianty.
 * Sortowanie: najtańszy z każdej marki najpierw, potem reszta po cenie.
 */
export function getRecommendedProducts(
  pvPowerKwp: number,
  hasHeatPump: boolean,
  hasEV: boolean,
): RecommendedProducts | null {
  let minCapacity = pvPowerKwp * 2;
  minCapacity = Math.max(minCapacity, 10);

  const eligible = allProducts
    .filter(p => p.capacity_kwh >= minCapacity)
    .sort((a, b) => a.price_gross - b.price_gross);

  if (eligible.length === 0) return null;

  // Wyróżniony = najtańszy ogółem
  const recommended = eligible[0];

  // Zbierz najtańszego z każdej marki (poza rekomendowanym)
  const brandCheapest = new Map<string, Product>();
  for (const p of eligible) {
    if (p.id === recommended.id) continue;
    const baseBrand = p.brand.split('/')[0]; // GoodWe/Dyness -> GoodWe
    if (!brandCheapest.has(baseBrand)) {
      brandCheapest.set(baseBrand, p);
    }
  }

  // Najpierw najtańsi z każdej marki (sortowani po cenie), potem reszta
  const brandPicks = [...brandCheapest.values()].sort((a, b) => a.price_gross - b.price_gross);
  const usedIds = new Set([recommended.id, ...brandPicks.map(p => p.id)]);
  const remaining = eligible.filter(p => !usedIds.has(p.id));

  const others = [...brandPicks, ...remaining]
    .slice(0, 5)
    .map(p => ({ product: p, inverter: findInverterForProduct(p.id) }));

  return {
    recommended: { product: recommended, inverter: findInverterForProduct(recommended.id) },
    others,
  };
}

/**
 * Get all products of a specific brand that meet subsidy requirements.
 * Used when user clicks on a brand card to see their full range.
 */
export function getBrandProducts(
  brand: string,
  pvPowerKwp: number,
  hasHeatPump: boolean,
  hasEV: boolean,
): ProductOption[] {
  // Min capacity = PV×2 (wymóg dotacji), min 10 kWh
  let minCapacity = pvPowerKwp * 2;
  minCapacity = Math.max(minCapacity, 10);

  // Dla GoodWe — pokaż też GoodWe/Dyness i GoodWe/BYD
  const eligible = allProducts
    .filter(p => p.capacity_kwh >= minCapacity && p.brand.startsWith(brand))
    .sort((a, b) => {
      if (a.capacity_kwh !== b.capacity_kwh) return a.capacity_kwh - b.capacity_kwh;
      return a.price_gross - b.price_gross;
    });

  return eligible.map(p => ({
    product: p,
    inverter: findInverterForProduct(p.id),
  }));
}

export function isACCompatible(): boolean {
  return true; // AC batteries are universally compatible
}

export function isDCCompatible(inverterBrand: string): boolean {
  const dcBrands = ['Huawei', 'Sigenergy', 'GoodWe', 'FoxESS'];
  return dcBrands.includes(inverterBrand);
}

export function getCompatibilityMessage(
  installationType: InstallationType,
  inverterBrand: string
): string | null {
  if (installationType === 'retrofit') {
    return 'Magazyn AC można podłączyć do każdego istniejącego falownika stringowego. Nie musisz wymieniać swojego obecnego falownika.';
  }

  if (
    (installationType === 'hybrid' || installationType === 'upgrade') &&
    !isDCCompatible(inverterBrand)
  ) {
    return `Twój obecny falownik ${inverterBrand} nie obsługuje bezpośrednio magazynów DC. Rekomendujemy rozwiązanie AC Retrofit lub wymianę falownika na hybrydowy.`;
  }

  return null;
}

export function getBackupEstimate(
  capacityKwh: number,
  hasHeatPump: boolean
): { hours_min: number; hours_max: number } {
  const baseConsumption = hasHeatPump ? 1.5 : 0.5; // kW average
  const usableCapacity = capacityKwh * 0.9; // 90% DoD
  const hoursMin = Math.round(usableCapacity / (baseConsumption * 1.5));
  const hoursMax = Math.round(usableCapacity / (baseConsumption * 0.8));
  return { hours_min: hoursMin, hours_max: hoursMax };
}

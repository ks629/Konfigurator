import { InstallationType, Product, Inverter } from './types';
import { productsAC, productsDC, inverters } from '@/data/products';

const availableCapacities = [5, 7, 10, 12, 15, 20];

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
  let base = pvPowerKwp * 1.2;
  if (hasHeatPump) base += 5;
  if (hasEV) base += 5;
  if (backupImportant) base += 2;
  return roundToNearestCapacity(base);
}

function getAdjacentCapacities(capacity: number): {
  smaller: number | null;
  larger: number | null;
} {
  const idx = availableCapacities.indexOf(capacity);

  if (idx === -1) {
    const sorted = [...availableCapacities, capacity].sort((a, b) => a - b);
    const newIdx = sorted.indexOf(capacity);
    return {
      smaller: newIdx > 0 ? sorted[newIdx - 1] : null,
      larger: newIdx < sorted.length - 1 ? sorted[newIdx + 1] : null,
    };
  }

  return {
    smaller: idx > 0 ? availableCapacities[idx - 1] : null,
    larger:
      idx < availableCapacities.length - 1
        ? availableCapacities[idx + 1]
        : null,
  };
}

function findBestProduct(
  products: Product[],
  targetCapacity: number
): Product | null {
  if (products.length === 0) return null;

  const sorted = [...products].sort(
    (a, b) =>
      Math.abs(a.capacity_kwh - targetCapacity) -
      Math.abs(b.capacity_kwh - targetCapacity)
  );
  return sorted[0];
}

function findBestInverter(pvPowerKwp: number): Inverter {
  const sorted = [...inverters].sort(
    (a, b) =>
      Math.abs(a.power_kw - pvPowerKwp) -
      Math.abs(b.power_kw - pvPowerKwp)
  );
  return sorted[0];
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
  const { smaller, larger } = getAdjacentCapacities(recCapacity);

  const products =
    installationType === 'retrofit' ? productsAC : productsDC;
  const needsInverter =
    installationType === 'hybrid' || installationType === 'upgrade';

  const recProduct = findBestProduct(products, recCapacity);
  if (!recProduct) return null;

  const inverter = needsInverter ? findBestInverter(pvPowerKwp) : undefined;

  const econProduct = smaller
    ? findBestProduct(products, smaller)
    : null;
  const premProduct = larger
    ? findBestProduct(products, larger)
    : null;

  return {
    recommended: { product: recProduct, inverter },
    economic:
      econProduct && econProduct.id !== recProduct.id
        ? { product: econProduct, inverter }
        : null,
    premium:
      premProduct && premProduct.id !== recProduct.id
        ? { product: premProduct, inverter }
        : null,
  };
}

export function isACCompatible(): boolean {
  return true; // AC batteries are universally compatible
}

export function isDCCompatible(inverterBrand: string): boolean {
  const dcBrands = ['Huawei'];
  return dcBrands.includes(inverterBrand);
}

export function getCompatibilityMessage(
  installationType: InstallationType,
  inverterBrand: string
): string | null {
  if (installationType === 'retrofit') {
    return 'Magazyn AC mozna podlaczyc do kazdego istniejacego falownika stringowego. Nie musisz wymieniac swojego obecnego falownika.';
  }

  if (
    (installationType === 'hybrid' || installationType === 'upgrade') &&
    !isDCCompatible(inverterBrand)
  ) {
    return `Twoj obecny falownik ${inverterBrand} nie obsluguje bezposrednio magazynow DC. Rekomendujemy rozwiazanie AC Retrofit lub wymiane falownika na hybrydowy.`;
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

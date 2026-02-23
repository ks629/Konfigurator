import type {
  PVSizingInput,
  PVSizingResult,
  PVVariant,
  PVVariantTier,
} from './types';
import { PV_PANEL, AVAILABLE_INVERTER_POWERS_KW, calculatePVPrice, maxPanelsOnRoof, getPanelById } from '@/data/pv-panels';
import { allProducts, inverters } from '@/data/products';

/**
 * Srednia roczna produkcja PV na 1 kWp w Polsce (kWh).
 * Wartosc dla centralnej Polski wg PV-GIS.
 */
const KWH_PER_KWP_PER_YEAR = 1050;

/**
 * Minimalna pojemnosc magazynu wymagana przez Moj Prad 7.0.
 */
const MP7_MIN_BATTERY_KWH = 10;

// ────────────── Algorytm doboru PV ──────────────

export function calculatePVSizing(input: PVSizingInput): PVSizingResult {
  // Calkowite zapotrzebowanie roczne (bazowe + planowana elektryfikacja)
  let totalDemandKwh = input.annualConsumptionKwh;
  if (input.plansEV) totalDemandKwh += input.evExtraKwh;
  if (input.plansHeatPump) totalDemandKwh += input.heatPumpExtraKwh;
  totalDemandKwh += input.otherExtraKwh;

  // Wymagana moc PV
  const orientationMul = Math.max(input.orientationMultiplier, 0.1);
  const requiredKwp = totalDemandKwh / (KWH_PER_KWP_PER_YEAR * orientationMul);

  // Wymiary panelu — z inputu lub domyslne
  const panelWattPeak = input.panelWattPeak ?? PV_PANEL.wattPeak;
  const panelWidthMm = input.panelWidthMm ?? PV_PANEL.widthMm;
  const panelHeightMm = input.panelHeightMm ?? PV_PANEL.heightMm;

  // Liczba paneli
  const panelCount = Math.ceil((requiredKwp * 1000) / panelWattPeak);

  // Max paneli na dachu
  let maxRoofPanels: number | null = null;
  if (input.roofWidth && input.roofLength && input.mountType !== 'ground') {
    maxRoofPanels = maxPanelsOnRoof(input.roofWidth, input.roofLength, panelWidthMm, panelHeightMm);
  }

  // Rekomendowany magazyn: min. 2x moc PV, minimum 10 kWh (wymog MP7)
  const actualKwp = (panelCount * panelWattPeak) / 1000;
  const recommendedBatteryKwh = Math.max(actualKwp * 2, MP7_MIN_BATTERY_KWH);

  // Rekomendowany falownik: najblizszy dostepny >= moc PV
  const recommendedInverterKw = findNearestInverterPower(actualKwp);

  return {
    totalDemandKwh: Math.round(totalDemandKwh),
    requiredKwp: Math.round(requiredKwp * 100) / 100,
    panelCount,
    maxRoofPanels,
    recommendedBatteryKwh: Math.round(recommendedBatteryKwh * 10) / 10,
    recommendedInverterKw,
  };
}

function findNearestInverterPower(pvKwp: number): number {
  for (const power of AVAILABLE_INVERTER_POWERS_KW) {
    if (power >= pvKwp) return power;
  }
  return AVAILABLE_INVERTER_POWERS_KW[AVAILABLE_INVERTER_POWERS_KW.length - 1];
}

// ────────────── Generator wariantow ──────────────

interface VariantConfig {
  tier: PVVariantTier;
  label: string;
  multiplier: number;
  hasSZR: boolean;
}

const VARIANT_CONFIGS: VariantConfig[] = [
  { tier: 'economic', label: 'Ekonomiczny', multiplier: 1.0, hasSZR: false },
  { tier: 'recommended', label: 'Rekomendowany', multiplier: 1.15, hasSZR: false },
  { tier: 'premium', label: 'Premium', multiplier: 1.3, hasSZR: true },
];

export function generatePVVariants(
  sizing: PVSizingResult,
  orientationMultiplier: number,
  mountType: 'roof_angled' | 'roof_flat' | 'ground' = 'roof_angled',
  panelId: string = 'keno-455'
): PVVariant[] {
  const panel = getPanelById(panelId);

  // Oblicz max paneli na dachu dla tego konkretnego panelu
  // (sizing.maxRoofPanels moze byc dla innego panelu, wiec przeliczamy)
  const maxRoofPanels = sizing.maxRoofPanels; // juz przeliczone w calculatePVSizing

  return VARIANT_CONFIGS.map((config) => {
    // Skaluj moc PV
    const scaledKwp = sizing.requiredKwp * config.multiplier;
    let panelCount = Math.ceil((scaledKwp * 1000) / panel.wattPeak);

    // TWARDY CAP: dach ogranicza liczbe paneli
    let roofLimited = false;
    if (maxRoofPanels !== null && panelCount > maxRoofPanels) {
      panelCount = maxRoofPanels;
      roofLimited = true;
    }

    const actualKwp = (panelCount * panel.wattPeak) / 1000;

    // Magazyn: 2x PV kWp, min 10 kWh
    const targetBatteryKwh = Math.max(actualKwp * 2, MP7_MIN_BATTERY_KWH);

    // Falownik
    const inverterKw = findNearestInverterPower(actualKwp);

    // Znajdz najblizszy produkt >= target kWh
    const batteryProduct = findBestBattery(targetBatteryKwh, config.hasSZR);
    const inverterProduct = findBestInverter(inverterKw, batteryProduct?.id);

    const batteryPrice = batteryProduct
      ? (config.hasSZR ? batteryProduct.price_gross_b : batteryProduct.price_gross)
      : 0;
    const pvPrice = calculatePVPrice(actualKwp, mountType);

    // Autokonsumpcja — szacunek
    const selfConsumption = estimateSelfConsumption(
      actualKwp,
      batteryProduct?.capacity_kwh ?? targetBatteryKwh,
      orientationMultiplier
    );

    return {
      tier: config.tier,
      label: config.label,
      pvKwp: Math.round(actualKwp * 100) / 100,
      panelCount,
      panelId: panel.id,
      roofLimited,
      maxRoofPanels,
      inverterKw,
      batteryKwh: batteryProduct?.capacity_kwh ?? Math.round(targetBatteryKwh),
      batteryProductId: batteryProduct?.id ?? '',
      inverterId: inverterProduct?.id ?? '',
      hasEMS: true,
      hasSZR: config.hasSZR,
      mp7Eligible: (batteryProduct?.capacity_kwh ?? targetBatteryKwh) >= MP7_MIN_BATTERY_KWH,
      selfConsumptionPercent: selfConsumption,
      pvPrice,
      batteryPrice,
      totalPrice: pvPrice + batteryPrice,
    };
  });
}

function findBestBattery(targetKwh: number, needsSZR: boolean) {
  // Sortuj wg pojemnosci rosnaco, filtruj >= target
  const candidates = allProducts
    .filter((p) => p.capacity_kwh >= targetKwh)
    .sort((a, b) => {
      // Sortuj po cenie (najtanszy pierwszy)
      const priceA = needsSZR ? a.price_gross_b : a.price_gross;
      const priceB = needsSZR ? b.price_gross_b : b.price_gross;
      return priceA - priceB;
    });

  return candidates[0] ?? allProducts
    .sort((a, b) => b.capacity_kwh - a.capacity_kwh)[0] ?? null;
}

function findBestInverter(targetKw: number, batteryId?: string) {
  if (!batteryId) return inverters[0] ?? null;

  // Znajdz kompatybilny falownik
  const compatible = inverters
    .filter((inv) => inv.compatible_batteries.includes(batteryId) && inv.power_kw >= targetKw)
    .sort((a, b) => a.price_gross - b.price_gross);

  if (compatible.length > 0) return compatible[0];

  // Fallback: jakikolwiek falownik >= target
  const fallback = inverters
    .filter((inv) => inv.power_kw >= targetKw)
    .sort((a, b) => a.price_gross - b.price_gross);

  return fallback[0] ?? inverters[0] ?? null;
}

function estimateSelfConsumption(
  pvKwp: number,
  batteryKwh: number,
  orientationMultiplier: number
): number {
  // Bazowa autokonsumpcja z magazynem: ~65% (typowa wartosc)
  let base = 0.65;

  // Wiecej kWh magazynu wzgledem PV = wyzsza autokonsumpcja
  const ratio = batteryKwh / pvKwp;
  if (ratio > 2.5) base += 0.05;
  if (ratio > 3.0) base += 0.03;

  // E+W orientacja daje szersze pokrycie = lepsza autokonsumpcja
  if (orientationMultiplier >= 0.85 && orientationMultiplier <= 0.90) {
    base += 0.03; // E+W bonus
  }

  return Math.min(Math.round(base * 100), 85);
}

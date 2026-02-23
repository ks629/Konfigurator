/**
 * Katalog paneli PV i cennik instalacji.
 * Dane z CENNIKI_ZATWIERDZONE_LUTY.xlsx — uzupelnic dokladne wartosci z XLS.
 */

import type { PVPanel } from '@/lib/types';

// ────────────── Katalog paneli PV ──────────────

export const pvPanels: PVPanel[] = [
  {
    id: 'keno-455',
    name: 'Keno 455Wp',
    brand: 'Keno Energy',
    model: 'KE455M-HBM',
    wattPeak: 455,
    widthMm: 1038,
    heightMm: 2094,
    image: '/products/panel-keno-455.png',
    warranty_product_years: 12,
    warranty_linear_years: 25,
    efficiency_percent: 21.3,
    price_per_panel: 650,
    segment: 'STANDARD',
    bifacial: false,
  },
  {
    id: 'keno-500',
    name: 'Keno 500Wp HE',
    brand: 'Keno Energy',
    model: 'KE500M-HBM',
    wattPeak: 500,
    widthMm: 1134,
    heightMm: 2278,
    image: '/products/panel-keno-500.png',
    warranty_product_years: 15,
    warranty_linear_years: 30,
    efficiency_percent: 22.1,
    price_per_panel: 780,
    segment: 'HIGH_EFFICIENCY',
    bifacial: false,
  },
  {
    id: 'keno-580',
    name: 'Keno 580Wp Premium',
    brand: 'Keno Energy',
    model: 'KE580M-HBM',
    wattPeak: 580,
    widthMm: 1134,
    heightMm: 2278,
    image: '/products/panel-keno-580.png',
    warranty_product_years: 15,
    warranty_linear_years: 30,
    efficiency_percent: 22.8,
    price_per_panel: 920,
    segment: 'PREMIUM',
    bifacial: true,
  },
];

export function getPanelById(id: string): PVPanel {
  return pvPanels.find((p) => p.id === id) ?? pvPanels[0];
}

// ────────────── Backward compat ──────────────

/** @deprecated Uzyj pvPanels[0] lub getPanelById() */
export const PV_PANEL = {
  wattPeak: pvPanels[0].wattPeak,
  widthMm: pvPanels[0].widthMm,
  heightMm: pvPanels[0].heightMm,
} as const;

// ────────────── Ceny instalacji PV ──────────────

export const PV_PRICING = {
  /** Cena netto za 1 kWp instalacji PV (panele + falownik hybrydowy + montaz) */
  pricePerKwp: 4200, // TODO: uzupelnic z XLS — orientacyjna cena brutto/kWp

  /** Staly koszt niezalezny od mocy (dokumentacja, projekt, transport) */
  fixedCost: 3500, // TODO: uzupelnic z XLS

  /** Doplata za montaz na gruncie (konstrukcja naziemna) */
  groundMountSurcharge: 2500, // TODO: uzupelnic z XLS
} as const;

// ────────────── Dostepne falowniki hybrydowe ──────────────

export const AVAILABLE_INVERTER_POWERS_KW = [6, 8, 10, 12, 15] as const;

// ────────────── Funkcja obliczania max paneli na dachu ──────────────

/**
 * Oblicza maksymalna liczbe paneli mieszczacych sie na dachu.
 * Uwzglednia marginesy bezpieczenstwa (50cm z kazdej strony).
 */
export function maxPanelsOnRoof(
  roofWidthM: number,
  roofLengthM: number,
  panelWidthMm?: number,
  panelHeightMm?: number,
): number {
  const margin = 0.5; // 50cm margines z kazdej strony
  const usableWidth = Math.max(roofWidthM - 2 * margin, 0);
  const usableLength = Math.max(roofLengthM - 2 * margin, 0);

  const panelW = (panelWidthMm ?? pvPanels[0].widthMm) / 1000;
  const panelH = (panelHeightMm ?? pvPanels[0].heightMm) / 1000;

  // Sprawdz oba ustawienia (portret i pejzaz) i wybierz lepsze
  const portrait = Math.floor(usableWidth / panelW) * Math.floor(usableLength / panelH);
  const landscape = Math.floor(usableWidth / panelH) * Math.floor(usableLength / panelW);

  return Math.max(portrait, landscape);
}

/**
 * Oblicza cene instalacji PV dla danej mocy.
 */
export function calculatePVPrice(
  kwp: number,
  mountType: 'roof_angled' | 'roof_flat' | 'ground'
): number {
  const base = PV_PRICING.fixedCost + kwp * PV_PRICING.pricePerKwp;
  const surcharge = mountType === 'ground' ? PV_PRICING.groundMountSurcharge : 0;
  return Math.round(base + surcharge);
}

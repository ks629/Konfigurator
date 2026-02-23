/**
 * Specyfikacja paneli PV i cennik instalacji.
 * Dane z CENNIKI_ZATWIERDZONE_LUTY.xlsx — uzupelnic dokladne wartosci z XLS.
 */

// ────────────── Panel PV ──────────────

export const PV_PANEL = {
  wattPeak: 455,
  widthMm: 1038,
  heightMm: 2094,
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
  roofLengthM: number
): number {
  const margin = 0.5; // 50cm margines z kazdej strony
  const usableWidth = Math.max(roofWidthM - 2 * margin, 0);
  const usableLength = Math.max(roofLengthM - 2 * margin, 0);

  const panelW = PV_PANEL.widthMm / 1000;
  const panelH = PV_PANEL.heightMm / 1000;

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

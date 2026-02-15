import type {
  OperatorPricing,
  DistributionFees,
  SelfConsumptionProfile,
  FinancingConfig,
} from '@/lib/types';

/** Ceny energii czynnej wg operatora (zł/kWh brutto, Q4/2025) */
export const operatorPricing: OperatorPricing[] = [
  { operator: 'tauron', label: 'Tauron', g11: 0.621, g12_day: 0.750, g12_night: 0.420 },
  { operator: 'pge', label: 'PGE', g11: 0.615, g12_day: 0.745, g12_night: 0.415 },
  { operator: 'enea', label: 'Enea', g11: 0.618, g12_day: 0.748, g12_night: 0.418 },
  { operator: 'energa', label: 'Energa', g11: 0.620, g12_day: 0.752, g12_night: 0.420 },
  { operator: 'innogy', label: 'innogy', g11: 0.625, g12_day: 0.755, g12_night: 0.425 },
];

/** Opłaty dystrybucyjne (zł/kWh brutto, średnia) */
export const distributionFees: DistributionFees = {
  variable: 0.280,
  quality: 0.012,
  transition: 0.009,
  oze: 0.027,
  cogeneration: 0.008,
  capacity: 0.163,
  total: 0.499,
};

/** Profile autokonsumpcji wg typu gospodarstwa */
export const selfConsumptionProfiles: SelfConsumptionProfile[] = [
  { profile: 'standard', label: 'Standardowe gospodarstwo', without_battery: 0.25, with_battery: 0.80 },
  { profile: 'heat_pump', label: 'Z pompą ciepła', without_battery: 0.35, with_battery: 0.85 },
  { profile: 'work_from_home', label: 'Praca zdalna z domu', without_battery: 0.40, with_battery: 0.85 },
  { profile: 'heat_pump_ev', label: 'Pompa ciepła + samochód EV', without_battery: 0.45, with_battery: 0.90 },
];

/** Konfiguracja finansowania Inbank */
export const inbankFinancing: FinancingConfig = {
  nominal_rate: 0.0899,
  rrso: 0.1109,
  min_amount: 10000,
  max_amount: 200000,
  min_months: 6,
  max_months: 120,
  monthly_fee: 10,
  periods: [6, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120],
};

/**
 * Profile godzinowej produkcji PV wg orientacji paneli.
 * Indeks = godzina (0-23), wartość = udział w dobowej produkcji.
 * Suma = 1.0 (znormalizowane).
 */
export const pvOrientationProfiles: Record<string, number[]> = {
  south: [
    0, 0, 0, 0, 0, 0,
    0.02, 0.05, 0.08, 0.11, 0.14, 0.15,
    0.15, 0.14, 0.11, 0.08, 0.05, 0.02,
    0, 0, 0, 0, 0, 0,
  ],
  east_west: [
    0, 0, 0, 0, 0, 0,
    0.04, 0.07, 0.10, 0.11, 0.12, 0.12,
    0.12, 0.12, 0.11, 0.10, 0.07, 0.04,
    0, 0, 0, 0, 0, 0,
  ],
  east: [
    0, 0, 0, 0, 0, 0,
    0.06, 0.10, 0.13, 0.14, 0.14, 0.12,
    0.10, 0.08, 0.06, 0.04, 0.02, 0.01,
    0, 0, 0, 0, 0, 0,
  ],
  west: [
    0, 0, 0, 0, 0, 0,
    0.01, 0.02, 0.04, 0.06, 0.08, 0.10,
    0.12, 0.14, 0.14, 0.13, 0.10, 0.06,
    0, 0, 0, 0, 0, 0,
  ],
};

/**
 * Godziny dzienne/nocne wg taryfy G12.
 * Dzień: 6:00-13:00 + 15:00-22:00 (godz. 6-12, 15-21)
 * Noc: 22:00-6:00 + 13:00-15:00 (godz. 0-5, 13-14, 22-23)
 */
export const g12DayHours = [6, 7, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 20, 21];
export const g12NightHours = [0, 1, 2, 3, 4, 5, 13, 14, 22, 23];

/**
 * Oblicz ważoną cenę energii dla taryfy G12 na podstawie profilu PV.
 * Zwraca średnią cenę ważoną udziałem produkcji PV w godzinach dziennych/nocnych.
 */
/**
 * Parametry taryfy dynamicznej (RCE).
 * Ceny netto z TGE, przeliczone na zł/kWh brutto (×1.23 VAT).
 * Bazowane na średnich danych RCE 2024-2025.
 */
export const dynamicTariffParams = {
  /** Średnia cena kupna w godzinach off-peak (noc 22-6, środek dnia 11-15): ~150-250 zł/MWh netto */
  offPeakPrice: 0.20, // zł/kWh czynna brutto (noc/środek dnia)
  /** Średnia cena kupna w godzinach szczytu (poranek 7-10, wieczór 17-21): ~500-800 zł/MWh netto */
  peakPrice: 0.75, // zł/kWh czynna brutto (szczyt)
  /** Średnia ważona cena całodobowa: ~350-500 zł/MWh netto */
  avgPrice: 0.50, // zł/kWh czynna brutto
  /** Sprawność cyklu ładowanie→rozładowanie magazynu */
  roundTripEfficiency: 0.90,
  /** Ile cykli arbitrażowych rocznie (ładowanie z sieci + oddanie) */
  arbitrageCyclesPerYear: 250,
};

export function calcWeightedG12Price(
  dayPrice: number,
  nightPrice: number,
  pvProfile: number[]
): number {
  let dayProduction = 0;
  let nightProduction = 0;

  for (let h = 0; h < 24; h++) {
    if (g12DayHours.includes(h)) {
      dayProduction += pvProfile[h];
    } else {
      nightProduction += pvProfile[h];
    }
  }

  const total = dayProduction + nightProduction;
  if (total === 0) return dayPrice;

  return (dayPrice * dayProduction + nightPrice * nightProduction) / total;
}

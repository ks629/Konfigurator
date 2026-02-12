import { CalcParams } from '@/lib/types';

export const defaultCalcParams: CalcParams = {
  // Ceny energii (fallback gdy nie podano operatora)
  energy_buy_price: 1.12,
  energy_sell_price_rce: 0.279,
  energy_sell_price_netmetering: 0.80,
  energy_price_growth: 0.05,

  // PV
  pv_production_per_kwp: 980,
  pv_degradation_yearly: 0.01,

  // Autokonsumpcja (fallback gdy nie podano profilu)
  self_consumption_without_battery: 0.25,
  self_consumption_with_battery_new: 0.80,
  self_consumption_with_battery_retrofit: 0.80,

  // Bateria
  battery_cycles_per_year: 300,
  battery_efficiency: 0.90,
  battery_degradation_yearly: 0.025,

  // Dotacje Mój Prąd 6.0
  subsidy_pme_netbilling_percent: 0.30,
  subsidy_pme_netbilling_per_kwh: 800,
  subsidy_pme_netbilling_max: 16000,
  subsidy_pme_netmetering_max: 8000,

  // Ulga termomodernizacyjna
  tax_relief_thermomodernization: 0.12,

  // Koszty montażu (wliczone w cenę produktu)
  installation_cost_base: 0,
  installation_cost_per_kwh: 0,
  backup_installation_cost: 2000,

  // Finansowanie
  financing_rrso: 0.1109,
  financing_periods: [6, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120],

  // Opłaty dystrybucyjne
  distribution_fees: {
    variable: 0.280,
    quality: 0.012,
    transition: 0.009,
    oze: 0.027,
    cogeneration: 0.008,
    capacity: 0.163,
    total: 0.499,
  },

  // Horyzont analizy
  analysis_horizon: 15,

  // Konfiguracja Inbank
  financing_config: {
    nominal_rate: 0.0899,
    rrso: 0.1109,
    min_amount: 10000,
    max_amount: 200000,
    min_months: 6,
    max_months: 120,
    monthly_fee: 10,
    periods: [6, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120],
  },
};

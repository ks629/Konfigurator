export type InstallationType = 'retrofit' | 'hybrid' | 'upgrade';

export type BillingSystem = 'net-billing' | 'net-metering' | 'unknown';

export type BackupPreference = 'yes' | 'no' | 'unknown';

export type Tariff = 'G11' | 'G12' | 'G12w' | 'G13' | 'unknown';

export type Priority =
  | 'savings'
  | 'independence'
  | 'blackout'
  | 'ecology'
  | 'subsidy';

export interface Product {
  id: string;
  name: string;
  brand: string;
  capacity_kwh: number;
  power_continuous_kw: number;
  power_peak_kw: number;
  type: 'AC' | 'DC';
  warranty_years: number;
  price_gross: number;
  eps_capable: boolean;
  image: string;
  compatible_inverters?: string[];
}

export interface Inverter {
  id: string;
  name: string;
  brand: string;
  power_kw: number;
  type: 'hybrid';
  price_gross: number;
  compatible_batteries: string[];
}

export interface ConfiguratorState {
  currentStep: number;
  installationType: InstallationType | null;
  pvPowerKwp: number;
  inverterBrand: string;
  inverterModel: string;
  installationYear: number;
  consumptionMode: 'kwh' | 'bill';
  annualConsumptionKwh: number;
  monthlyBill: number;
  tariff: Tariff;
  billingSystem: BillingSystem;
  hasHeatPump: boolean;
  hasEV: boolean;
  backupPreference: BackupPreference;
  priorities: Priority[];
  selectedProductId: string | null;
  selectedInverterId: string | null;
}

export interface RecommendedOption {
  product: Product;
  inverter?: Inverter;
  badge: string;
  badgeVariant: 'default' | 'secondary' | 'outline';
  description: string;
  isRecommended: boolean;
}

export interface InvestmentBreakdown {
  battery: number;
  inverter: number;
  installation: number;
  backup: number;
  total_gross: number;
  subsidy_pme: number;
  tax_relief: number;
  total_subsidies: number;
  net_cost: number;
}

export interface YearProjection {
  year: number;
  production: number;
  selfConsumption: number;
  sold: number;
  savings: number;
  cumulative: number;
}

export interface CalculationResult {
  investment: InvestmentBreakdown;
  annual_savings: number;
  roi_years: number | null;
  total_savings_20y: number;
  projection: YearProjection[];
  monthly_installment: Record<number, number>;
}

export interface LeadData {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  postalCode: string;
  config: ConfiguratorState;
  selectedProduct: Product;
  selectedInverter?: Inverter;
  calculation: CalculationResult;
  pdfDownloaded: boolean;
  auditBooked: boolean;
  auditDate: string | null;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  status: 'nowy' | 'w_trakcie' | 'zamkniety';
}

export interface CalcParams {
  energy_buy_price: number;
  energy_sell_price_rce: number;
  energy_sell_price_netmetering: number;
  energy_price_growth: number;
  pv_production_per_kwp: number;
  pv_degradation_yearly: number;
  self_consumption_without_battery: number;
  self_consumption_with_battery_new: number;
  self_consumption_with_battery_retrofit: number;
  battery_cycles_per_year: number;
  battery_efficiency: number;
  battery_degradation_yearly: number;
  subsidy_pme_netbilling_percent: number;
  subsidy_pme_netbilling_per_kwh: number;
  subsidy_pme_netbilling_max: number;
  subsidy_pme_netmetering_max: number;
  tax_relief_thermomodernization: number;
  installation_cost_base: number;
  installation_cost_per_kwh: number;
  backup_installation_cost: number;
  financing_rrso: number;
  financing_periods: number[];
}

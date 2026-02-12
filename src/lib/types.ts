// ───────────────────────── Istniejące typy ─────────────────────────

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

// ───────────────────────── Nowe typy ─────────────────────────

export type UserProfile = 'standard' | 'heat_pump' | 'work_from_home' | 'heat_pump_ev';

export type EnergyOperator = 'tauron' | 'pge' | 'enea' | 'energa' | 'innogy';

export type PVOrientation = 'south' | 'east_west' | 'east' | 'west';

export type TaxBracket = 12 | 32;

export interface OperatorPricing {
  operator: EnergyOperator;
  label: string;
  g11: number;
  g12_day: number;
  g12_night: number;
}

export interface DistributionFees {
  variable: number;
  quality: number;
  transition: number;
  oze: number;
  cogeneration: number;
  capacity: number;
  total: number;
}

export interface SelfConsumptionProfile {
  profile: UserProfile;
  label: string;
  without_battery: number;
  with_battery: number;
}

export interface FinancingConfig {
  nominal_rate: number;
  rrso: number;
  min_amount: number;
  max_amount: number;
  min_months: number;
  max_months: number;
  monthly_fee: number;
  periods: number[];
}

// ───────────────────────── Produkty ─────────────────────────

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

// ───────────────────────── Konfigurator ─────────────────────────

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
  // Nowe pola
  userProfile: UserProfile;
  energyOperator: EnergyOperator;
  pvOrientation: PVOrientation;
  wantsSubsidy: boolean;
  thermomodernizationUsedPercent: number;
  taxBracket: TaxBracket;
}

export interface RecommendedOption {
  product: Product;
  inverter?: Inverter;
  badge: string;
  badgeVariant: 'default' | 'secondary' | 'outline';
  description: string;
  isRecommended: boolean;
}

// ───────────────────────── Kalkulacja ─────────────────────────

export interface CalcInput {
  pv_power_kwp: number;
  annual_consumption_kwh: number;
  billing_system: BillingSystem;
  battery_capacity_kwh: number;
  battery_price_gross: number;
  installation_type: InstallationType;
  needs_inverter_upgrade: boolean;
  inverter_price_gross: number;
  needs_backup: boolean;
  // Nowe pola (opcjonalne — backward compatible)
  user_profile?: UserProfile;
  energy_operator?: EnergyOperator;
  tariff?: Tariff;
  pv_orientation?: PVOrientation;
  wants_subsidy?: boolean;
  thermomodernization_used_percent?: number;
  tax_bracket?: TaxBracket;
}

export interface ThermomodernizationDetails {
  pool_total: number;
  pool_used: number;
  pool_available: number;
  deduction: number;
  tax_bracket: TaxBracket;
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
  thermomodernization_details?: ThermomodernizationDetails;
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
  total_savings: number;
  horizon_years: number;
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
  // Nowe pola (opcjonalne)
  distribution_fees?: DistributionFees;
  analysis_horizon?: number;
  financing_config?: FinancingConfig;
}

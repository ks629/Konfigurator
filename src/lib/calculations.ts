import {
  CalcParams,
  CalcInput,
  CalculationResult,
  YearProjection,
  TaxBracket,
  ThermomodernizationDetails,
} from './types';
import { defaultCalcParams } from '@/data/params';
import {
  operatorPricing,
  distributionFees as defaultDistributionFees,
  selfConsumptionProfiles,
  pvOrientationProfiles,
  calcWeightedG12Price,
} from '@/data/energy-prices';

// ─────────────── Helpery wewnętrzne ───────────────

/**
 * Rozdzielanie ceny energii na podstawie operatora i taryfy.
 * Zwraca pełną cenę (czynna + dystrybucja).
 */
function resolveEnergyPrice(
  input: CalcInput,
  params: CalcParams
): { buyPrice: number; dayPrice?: number; nightPrice?: number } {
  const dist = params.distribution_fees || defaultDistributionFees;

  if (input.energy_operator && input.tariff) {
    const op = operatorPricing.find((o) => o.operator === input.energy_operator);
    if (op) {
      const tariff = input.tariff;
      if (tariff === 'G12' || tariff === 'G12w') {
        const dayFull = op.g12_day + dist.total;
        const nightFull = op.g12_night + dist.total;
        // Ważona średnia wg profilu PV
        const orientation = input.pv_orientation || 'south';
        const pvProfile = pvOrientationProfiles[orientation] || pvOrientationProfiles.south;
        const weighted = calcWeightedG12Price(dayFull, nightFull, pvProfile);
        return { buyPrice: weighted, dayPrice: dayFull, nightPrice: nightFull };
      }
      // G11, G13, unknown — jednostrefowa
      return { buyPrice: op.g11 + dist.total };
    }
  }

  // Fallback
  return { buyPrice: params.energy_buy_price };
}

/**
 * Współczynniki autokonsumpcji na podstawie profilu użytkownika.
 */
function resolveSelfConsumption(
  input: CalcInput,
  params: CalcParams
): { withBattery: number; withoutBattery: number } {
  if (input.user_profile) {
    const profile = selfConsumptionProfiles.find(
      (p) => p.profile === input.user_profile
    );
    if (profile) {
      return {
        withBattery: profile.with_battery,
        withoutBattery: profile.without_battery,
      };
    }
  }

  // Fallback do starych wartości per typ instalacji
  const withBattery =
    input.installation_type === 'retrofit'
      ? params.self_consumption_with_battery_retrofit
      : params.self_consumption_with_battery_new;
  return {
    withBattery,
    withoutBattery: params.self_consumption_without_battery,
  };
}

/**
 * Obliczenie dotacji Mój Prąd 6.0 z walidacją pojemności.
 */
function calculateSubsidy(
  input: CalcInput,
  totalInvestment: number,
  params: CalcParams
): number {
  // Sprawdź czy użytkownik chce dotację (domyślnie tak)
  if (input.wants_subsidy === false) return 0;

  if (
    input.billing_system === 'net-billing' ||
    input.billing_system === 'unknown'
  ) {
    // Net-billing: kwalifikowana pojemność 10-20 kWh
    if (input.battery_capacity_kwh < 10) return 0;

    const qualifiedCapacity = Math.min(input.battery_capacity_kwh, 20);
    const subsidyByPercent =
      totalInvestment * params.subsidy_pme_netbilling_percent;
    const subsidyByKwh =
      qualifiedCapacity * params.subsidy_pme_netbilling_per_kwh;
    return Math.min(
      subsidyByPercent,
      subsidyByKwh,
      params.subsidy_pme_netbilling_max
    );
  }

  // Net-metering
  return Math.min(
    totalInvestment * 0.3,
    params.subsidy_pme_netmetering_max
  );
}

/**
 * Obliczenie ulgi termomodernizacyjnej z uwzględnieniem puli 53 000 zł.
 */
function calculateThermoRelief(
  totalInvestment: number,
  taxBracket: TaxBracket = 12,
  usedPercent: number = 0
): { deduction: number; details: ThermomodernizationDetails } {
  const POOL_TOTAL = 53000;
  const poolUsed = Math.round(POOL_TOTAL * (usedPercent / 100));
  const poolAvailable = POOL_TOTAL - poolUsed;
  const eligibleAmount = Math.min(totalInvestment, poolAvailable);
  const deduction = Math.round(eligibleAmount * (taxBracket / 100));

  return {
    deduction,
    details: {
      pool_total: POOL_TOTAL,
      pool_used: poolUsed,
      pool_available: poolAvailable,
      deduction,
      tax_bracket: taxBracket,
    },
  };
}

/**
 * Oblicz ratę miesięczną z uwzględnieniem opłaty Inbank.
 */
function calculateMonthlyInstallment(
  principal: number,
  annualRate: number,
  months: number,
  monthlyFee: number = 0
): number {
  if (months <= 0 || principal <= 0) return 0;
  const monthlyRate = annualRate / 12;
  if (monthlyRate === 0) return Math.round(principal / months + monthlyFee);
  const annuity =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(annuity + monthlyFee);
}

// ─────────────── Główna funkcja ───────────────

export function calculateROI(
  input: CalcInput,
  params: CalcParams = defaultCalcParams
): CalculationResult {
  const horizon = params.analysis_horizon || 15;

  // 1. KOSZTY INWESTYCJI
  const installationCost =
    params.installation_cost_base +
    input.battery_capacity_kwh * params.installation_cost_per_kwh;

  const backupCost = input.needs_backup ? params.backup_installation_cost : 0;

  const totalInvestment =
    input.battery_price_gross +
    input.inverter_price_gross +
    installationCost +
    backupCost;

  // 2. DOTACJE
  const subsidy = calculateSubsidy(input, totalInvestment, params);

  // 3. ULGA TERMOMODERNIZACYJNA
  const taxBracket = input.tax_bracket || 12;
  const usedPercent = input.thermomodernization_used_percent || 0;
  const thermoResult = calculateThermoRelief(
    totalInvestment,
    taxBracket,
    usedPercent
  );
  const taxRelief = thermoResult.deduction;

  const totalSubsidies = subsidy + taxRelief;
  const netInvestment = totalInvestment - totalSubsidies;

  // 4. PRODUKCJA I ZUŻYCIE
  const annualProduction = input.pv_power_kwp * params.pv_production_per_kwp;
  const { buyPrice } = resolveEnergyPrice(input, params);
  const { withBattery: selfConsumptionRate, withoutBattery: selfConsumptionRateWithout } =
    resolveSelfConsumption(input, params);

  const sellPrice =
    input.billing_system === 'net-metering'
      ? buyPrice * params.energy_sell_price_netmetering
      : params.energy_sell_price_rce;

  // 5. OSZCZĘDNOŚCI ROCZNE (rok 1)
  const energyConsumedWithBattery = annualProduction * selfConsumptionRate;
  const energyConsumedWithout = annualProduction * selfConsumptionRateWithout;

  const energySoldWithBattery = annualProduction - energyConsumedWithBattery;
  const energySoldWithout = annualProduction - energyConsumedWithout;

  const savingsWithBattery =
    energyConsumedWithBattery * buyPrice + energySoldWithBattery * sellPrice;
  const savingsWithout =
    energyConsumedWithout * buyPrice + energySoldWithout * sellPrice;

  const annualSavingsFromBattery = savingsWithBattery - savingsWithout;

  // 6. PROJEKCJA (do max(horizon, 20) lat dla backward compat)
  const maxYears = Math.max(horizon, 20);
  const projection: YearProjection[] = [];
  let cumulativeSavings = -netInvestment;
  let roiYear: number | null = null;

  for (let year = 1; year <= maxYears; year++) {
    const pvDegradation = Math.pow(1 - params.pv_degradation_yearly, year);
    const batteryDegradation = Math.pow(
      1 - params.battery_degradation_yearly,
      year
    );
    const priceGrowth = Math.pow(1 + params.energy_price_growth, year);

    const yearlyProduction = annualProduction * pvDegradation;
    const effectiveCapacity =
      input.battery_capacity_kwh * batteryDegradation;

    const adjustedSelfConsumption =
      selfConsumptionRate *
      (0.7 + 0.3 * (effectiveCapacity / input.battery_capacity_kwh));

    const yearlyConsumed = yearlyProduction * adjustedSelfConsumption;
    const yearlySold = yearlyProduction - yearlyConsumed;

    const yearlySavings =
      yearlyConsumed * buyPrice * priceGrowth +
      yearlySold * sellPrice * priceGrowth;

    const yearlySavingsWithout =
      yearlyProduction *
        selfConsumptionRateWithout *
        buyPrice *
        priceGrowth +
      yearlyProduction *
        (1 - selfConsumptionRateWithout) *
        sellPrice *
        priceGrowth;

    const netYearlySavings = yearlySavings - yearlySavingsWithout;
    cumulativeSavings += netYearlySavings;

    if (cumulativeSavings >= 0 && roiYear === null) {
      roiYear = year;
    }

    projection.push({
      year,
      production: Math.round(yearlyProduction),
      selfConsumption: Math.round(yearlyConsumed),
      sold: Math.round(yearlySold),
      savings: Math.round(netYearlySavings),
      cumulative: Math.round(cumulativeSavings),
    });
  }

  // 7. RATY MIESIĘCZNE (Inbank)
  const finConfig = params.financing_config;
  const monthlyFee = finConfig?.monthly_fee || 0;
  const nominalRate = finConfig?.nominal_rate || params.financing_rrso;
  const periods = finConfig?.periods || params.financing_periods;

  const monthlyInstallment: Record<number, number> = {};
  for (const period of periods) {
    monthlyInstallment[period] = calculateMonthlyInstallment(
      netInvestment,
      nominalRate,
      period,
      monthlyFee
    );
  }

  // 8. WYNIKI
  const horizonProjection = projection.slice(0, horizon);
  const totalSavingsHorizon =
    horizonProjection.length > 0
      ? horizonProjection[horizonProjection.length - 1].cumulative + netInvestment
      : 0;

  const totalSavings20y =
    projection.length >= 20
      ? projection[19].cumulative + netInvestment
      : totalSavingsHorizon;

  return {
    investment: {
      battery: input.battery_price_gross,
      inverter: input.inverter_price_gross,
      installation: installationCost,
      backup: backupCost,
      total_gross: totalInvestment,
      subsidy_pme: Math.round(subsidy),
      tax_relief: Math.round(taxRelief),
      total_subsidies: Math.round(totalSubsidies),
      net_cost: Math.round(netInvestment),
      thermomodernization_details: thermoResult.details,
    },
    annual_savings: Math.round(annualSavingsFromBattery),
    roi_years: roiYear,
    total_savings_20y: Math.round(totalSavings20y),
    total_savings: Math.round(totalSavingsHorizon),
    horizon_years: horizon,
    projection: horizonProjection,
    monthly_installment: monthlyInstallment,
  };
}

// ─────────────── Narzędzia eksportowane ───────────────

export function calculateMonthlyFromBill(
  monthlyBill: number,
  buyPrice?: number
): number {
  const price = buyPrice || 1.12;
  return Math.round((monthlyBill / price) * 12);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('pl-PL').format(num);
}

import {
  CalcParams,
  CalculationResult,
  InstallationType,
  BillingSystem,
  YearProjection,
} from './types';
import { defaultCalcParams } from '@/data/params';

interface CalcInput {
  pv_power_kwp: number;
  annual_consumption_kwh: number;
  billing_system: BillingSystem;
  battery_capacity_kwh: number;
  battery_price_gross: number;
  installation_type: InstallationType;
  needs_inverter_upgrade: boolean;
  inverter_price_gross: number;
  needs_backup: boolean;
}

export function calculateROI(
  input: CalcInput,
  params: CalcParams = defaultCalcParams
): CalculationResult {
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
  let subsidy = 0;
  if (input.billing_system === 'net-billing' || input.billing_system === 'unknown') {
    const subsidyByPercent =
      totalInvestment * params.subsidy_pme_netbilling_percent;
    const subsidyByKwh =
      input.battery_capacity_kwh * params.subsidy_pme_netbilling_per_kwh;
    subsidy = Math.min(
      subsidyByPercent,
      subsidyByKwh,
      params.subsidy_pme_netbilling_max
    );
  } else {
    subsidy = Math.min(
      totalInvestment * 0.3,
      params.subsidy_pme_netmetering_max
    );
  }

  const taxRelief = totalInvestment * params.tax_relief_thermomodernization;
  const totalSubsidies = subsidy + taxRelief;
  const netInvestment = totalInvestment - totalSubsidies;

  // 3. PRODUKCJA I ZUŻYCIE
  const annualProduction = input.pv_power_kwp * params.pv_production_per_kwp;

  const selfConsumptionRate =
    input.installation_type === 'retrofit'
      ? params.self_consumption_with_battery_retrofit
      : params.self_consumption_with_battery_new;

  const selfConsumptionRateWithout =
    params.self_consumption_without_battery;

  // 4. OSZCZĘDNOŚCI ROCZNE
  const energyConsumedWithBattery = annualProduction * selfConsumptionRate;
  const energyConsumedWithout = annualProduction * selfConsumptionRateWithout;

  const energySoldWithBattery = annualProduction - energyConsumedWithBattery;
  const energySoldWithout = annualProduction - energyConsumedWithout;

  const sellPrice =
    input.billing_system === 'net-metering'
      ? params.energy_buy_price * params.energy_sell_price_netmetering
      : params.energy_sell_price_rce;

  const savingsWithBattery =
    energyConsumedWithBattery * params.energy_buy_price +
    energySoldWithBattery * sellPrice;

  const savingsWithout =
    energyConsumedWithout * params.energy_buy_price +
    energySoldWithout * sellPrice;

  const annualSavingsFromBattery = savingsWithBattery - savingsWithout;

  // 5. PROJEKCJA 20-LETNIA
  const projection: YearProjection[] = [];
  let cumulativeSavings = -netInvestment;
  let roiYear: number | null = null;

  for (let year = 1; year <= 20; year++) {
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
      yearlyConsumed * params.energy_buy_price * priceGrowth +
      yearlySold * sellPrice * priceGrowth;

    const yearlySavingsWithout =
      yearlyProduction *
        selfConsumptionRateWithout *
        params.energy_buy_price *
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

  // 6. RATY
  const monthlyInstallment: Record<number, number> = {};
  for (const period of params.financing_periods) {
    const monthlyRate = params.financing_rrso / 12;
    const installment =
      (netInvestment * monthlyRate * Math.pow(1 + monthlyRate, period)) /
      (Math.pow(1 + monthlyRate, period) - 1);
    monthlyInstallment[period] = Math.round(installment);
  }

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
    },
    annual_savings: Math.round(annualSavingsFromBattery),
    roi_years: roiYear,
    total_savings_20y: Math.round(
      projection[19]?.cumulative + netInvestment
    ),
    projection,
    monthly_installment: monthlyInstallment,
  };
}

export function calculateMonthlyFromBill(monthlyBill: number): number {
  return Math.round((monthlyBill / 1.12) * 12);
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

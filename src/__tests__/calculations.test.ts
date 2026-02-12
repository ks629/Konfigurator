import { calculateROI, calculateMonthlyFromBill, formatCurrency, formatNumber } from '../lib/calculations';
import { defaultCalcParams } from '../data/params';

describe('calculateROI', () => {
  const baseInput = {
    pv_power_kwp: 6.0,
    annual_consumption_kwh: 4000,
    billing_system: 'net-billing' as const,
    battery_capacity_kwh: 10,
    battery_price_gross: 22500,
    installation_type: 'retrofit' as const,
    needs_inverter_upgrade: false,
    inverter_price_gross: 0,
    needs_backup: false,
  };

  test('should return valid calculation result', () => {
    const result = calculateROI(baseInput);

    expect(result).toHaveProperty('investment');
    expect(result).toHaveProperty('annual_savings');
    expect(result).toHaveProperty('roi_years');
    expect(result).toHaveProperty('total_savings_20y');
    expect(result).toHaveProperty('total_savings');
    expect(result).toHaveProperty('horizon_years');
    expect(result).toHaveProperty('projection');
    expect(result).toHaveProperty('monthly_installment');
  });

  test('should calculate investment costs correctly', () => {
    const result = calculateROI(baseInput);

    // Installation cost = 0 (included in product price per params)
    expect(result.investment.installation).toBe(0);
    expect(result.investment.battery).toBe(22500);
    expect(result.investment.inverter).toBe(0);
    expect(result.investment.backup).toBe(0);
    expect(result.investment.total_gross).toBe(22500);
  });

  test('should include backup cost when requested', () => {
    const inputWithBackup = { ...baseInput, needs_backup: true };
    const result = calculateROI(inputWithBackup);

    expect(result.investment.backup).toBe(2000);
    expect(result.investment.total_gross).toBe(24500);
  });

  test('should include inverter cost for hybrid installations', () => {
    const hybridInput = {
      ...baseInput,
      installation_type: 'hybrid' as const,
      needs_inverter_upgrade: true,
      inverter_price_gross: 9200,
    };
    const result = calculateROI(hybridInput);

    expect(result.investment.inverter).toBe(9200);
    expect(result.investment.total_gross).toBe(22500 + 9200);
  });

  test('should calculate subsidies for net-billing', () => {
    const result = calculateROI(baseInput);

    // subsidy = min(22500 * 0.30, 10 * 800, 16000) = min(6750, 8000, 16000) = 6750
    expect(result.investment.subsidy_pme).toBe(6750);

    // tax relief with thermomodernization — default 12% bracket
    expect(result.investment.tax_relief).toBeGreaterThan(0);
  });

  test('should calculate subsidies for net-metering', () => {
    const netMeteringInput = {
      ...baseInput,
      billing_system: 'net-metering' as const,
    };
    const result = calculateROI(netMeteringInput);

    // Net-metering: subsidy = min(22500 * 0.30, 8000) = min(6750, 8000) = 6750
    expect(result.investment.subsidy_pme).toBe(6750);
  });

  test('should have positive annual savings', () => {
    const result = calculateROI(baseInput);
    expect(result.annual_savings).toBeGreaterThan(0);
  });

  test('should have ROI within reasonable range', () => {
    const result = calculateROI(baseInput);
    expect(result.roi_years).not.toBeNull();
    if (result.roi_years !== null) {
      expect(result.roi_years).toBeGreaterThan(0);
      expect(result.roi_years).toBeLessThanOrEqual(20);
    }
  });

  test('should generate projection matching horizon', () => {
    const result = calculateROI(baseInput);
    const horizon = defaultCalcParams.analysis_horizon || 15;
    // backward-compat: projection has max(horizon, 20) entries
    expect(result.projection.length).toBeGreaterThanOrEqual(horizon);
    expect(result.projection[0].year).toBe(1);
    expect(result.horizon_years).toBe(horizon);
  });

  test('projection savings should be positive each year', () => {
    const result = calculateROI(baseInput);
    for (const year of result.projection) {
      expect(year.savings).toBeGreaterThan(0);
    }
  });

  test('cumulative savings should increase each year', () => {
    const result = calculateROI(baseInput);
    for (let i = 1; i < result.projection.length; i++) {
      expect(result.projection[i].cumulative).toBeGreaterThan(
        result.projection[i - 1].cumulative
      );
    }
  });

  test('should calculate monthly installments for all periods', () => {
    const result = calculateROI(baseInput);
    const periods = defaultCalcParams.financing_periods;

    for (const period of periods) {
      expect(result.monthly_installment[period]).toBeGreaterThan(0);
    }

    // Shorter period = higher installment
    expect(result.monthly_installment[12]).toBeGreaterThan(
      result.monthly_installment[60]
    );
  });

  test('higher PV power should yield higher annual savings', () => {
    const result6kw = calculateROI({ ...baseInput, pv_power_kwp: 6.0 });
    const result10kw = calculateROI({ ...baseInput, pv_power_kwp: 10.0 });

    expect(result10kw.annual_savings).toBeGreaterThan(result6kw.annual_savings);
  });

  // Nowe testy — profile użytkowników
  test('user profiles should affect self-consumption rates', () => {
    const standardResult = calculateROI({ ...baseInput, user_profile: 'standard' });
    const heatPumpResult = calculateROI({ ...baseInput, user_profile: 'heat_pump' });

    // Oba powinny dawać pozytywne oszczędności
    expect(standardResult.annual_savings).toBeGreaterThan(0);
    expect(heatPumpResult.annual_savings).toBeGreaterThan(0);

    // Powinny się różnić (heat_pump ma inny profil autokonsumpcji)
    expect(standardResult.annual_savings).not.toBe(heatPumpResult.annual_savings);
  });

  // Nowe testy — operator energii z taryfą
  test('different operators with tariff should produce different results', () => {
    const tauronResult = calculateROI({ ...baseInput, energy_operator: 'tauron', tariff: 'G11' });
    const pgeResult = calculateROI({ ...baseInput, energy_operator: 'pge', tariff: 'G11' });

    // Ceny operatorów się nieco różnią, więc wyniki nie powinny być identyczne
    expect(tauronResult.annual_savings).not.toBe(pgeResult.annual_savings);
  });

  // Nowe testy — bracket podatkowy
  test('32% tax bracket should give higher tax relief', () => {
    const bracket12 = calculateROI({ ...baseInput, tax_bracket: 12 });
    const bracket32 = calculateROI({ ...baseInput, tax_bracket: 32 });

    expect(bracket32.investment.tax_relief).toBeGreaterThan(bracket12.investment.tax_relief);
  });

  // Nowe testy — termomodernizacja z wykorzystaną pulą
  test('used thermomodernization pool should reduce tax relief', () => {
    const unused = calculateROI({ ...baseInput, thermomodernization_used_percent: 0 });
    const halfUsed = calculateROI({ ...baseInput, thermomodernization_used_percent: 50 });

    expect(unused.investment.tax_relief).toBeGreaterThanOrEqual(halfUsed.investment.tax_relief);
  });

  // Nowe testy — wyłączona dotacja
  test('wants_subsidy false should give zero subsidy', () => {
    const result = calculateROI({ ...baseInput, wants_subsidy: false });
    expect(result.investment.subsidy_pme).toBe(0);
  });

  // Backward compatibility
  test('old CalcInput without new fields should still work', () => {
    const oldInput = {
      pv_power_kwp: 6.0,
      annual_consumption_kwh: 4000,
      billing_system: 'net-billing' as const,
      battery_capacity_kwh: 10,
      battery_price_gross: 22500,
      installation_type: 'retrofit' as const,
      needs_inverter_upgrade: false,
      inverter_price_gross: 0,
      needs_backup: false,
    };

    const result = calculateROI(oldInput);
    expect(result.annual_savings).toBeGreaterThan(0);
    expect(result.investment.total_gross).toBe(22500);
    expect(result.projection.length).toBeGreaterThan(0);
  });
});

describe('calculateMonthlyFromBill', () => {
  test('should convert monthly bill to annual consumption', () => {
    const result = calculateMonthlyFromBill(300);
    expect(result).toBeGreaterThan(2500);
    expect(result).toBeLessThan(4000);
  });

  test('should handle zero bill', () => {
    expect(calculateMonthlyFromBill(0)).toBe(0);
  });
});

describe('formatCurrency', () => {
  test('should format as PLN currency', () => {
    const result = formatCurrency(15000);
    expect(result).toContain('15');
    expect(result).toContain('z\u0142');
  });
});

describe('formatNumber', () => {
  test('should format with thousands separator', () => {
    const result = formatNumber(15000);
    expect(result).toContain('15');
  });
});

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
    expect(result).toHaveProperty('projection');
    expect(result).toHaveProperty('monthly_installment');
  });

  test('should calculate investment costs correctly', () => {
    const result = calculateROI(baseInput);

    // Installation cost = 2500 + 10 * 200 = 4500
    expect(result.investment.installation).toBe(4500);
    expect(result.investment.battery).toBe(22500);
    expect(result.investment.inverter).toBe(0);
    expect(result.investment.backup).toBe(0);
    expect(result.investment.total_gross).toBe(27000);
  });

  test('should include backup cost when requested', () => {
    const inputWithBackup = { ...baseInput, needs_backup: true };
    const result = calculateROI(inputWithBackup);

    expect(result.investment.backup).toBe(2000);
    expect(result.investment.total_gross).toBe(29000);
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
    expect(result.investment.total_gross).toBe(27000 + 9200);
  });

  test('should calculate subsidies for net-billing', () => {
    const result = calculateROI(baseInput);

    // subsidy = min(27000 * 0.30, 10 * 800, 16000) = min(8100, 8000, 16000) = 8000
    expect(result.investment.subsidy_pme).toBe(8000);

    // tax relief = 27000 * 0.12 = 3240
    expect(result.investment.tax_relief).toBe(3240);
  });

  test('should calculate subsidies for net-metering', () => {
    const netMeteringInput = {
      ...baseInput,
      billing_system: 'net-metering' as const,
    };
    const result = calculateROI(netMeteringInput);

    // subsidy = min(27000 * 0.30, 8000) = min(8100, 8000) = 8000
    expect(result.investment.subsidy_pme).toBe(8000);
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

  test('should generate 20-year projection', () => {
    const result = calculateROI(baseInput);
    expect(result.projection).toHaveLength(20);
    expect(result.projection[0].year).toBe(1);
    expect(result.projection[19].year).toBe(20);
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

  test('retrofit should have different self-consumption than hybrid', () => {
    const retrofitResult = calculateROI({ ...baseInput, installation_type: 'retrofit' });
    const hybridResult = calculateROI({
      ...baseInput,
      installation_type: 'hybrid',
      inverter_price_gross: 9200,
    });

    // Hybrid has higher self-consumption rate
    expect(hybridResult.annual_savings).toBeGreaterThan(retrofitResult.annual_savings);
  });
});

describe('calculateMonthlyFromBill', () => {
  test('should convert monthly bill to annual consumption', () => {
    // 300 zl / 1.12 * 12 = ~3214
    const result = calculateMonthlyFromBill(300);
    expect(result).toBeGreaterThan(3000);
    expect(result).toBeLessThan(3500);
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

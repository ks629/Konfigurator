import {
  roundToNearestCapacity,
  calculateRecommendedCapacity,
  getRecommendations,
  isACCompatible,
  isDCCompatible,
  getBackupEstimate,
} from '../lib/compatibility';

// availableCapacities = [9, 10, 11, 12, 14, 15, 17, 18, 20, 21, 23]

describe('roundToNearestCapacity', () => {
  test('should round to nearest available capacity', () => {
    expect(roundToNearestCapacity(4)).toBe(9);   // nearest to 4 is 9
    expect(roundToNearestCapacity(8)).toBe(9);   // nearest to 8 is 9
    expect(roundToNearestCapacity(9.5)).toBe(9); // 9.5 closer to 9 than 10
    expect(roundToNearestCapacity(10.6)).toBe(11);
    expect(roundToNearestCapacity(13)).toBe(12);  // 13 equidistant to 12 and 14, picks first match
    expect(roundToNearestCapacity(13.5)).toBe(14); // 13.5 closer to 14
    expect(roundToNearestCapacity(16)).toBe(15); // 16 closer to 15 than 17
    expect(roundToNearestCapacity(25)).toBe(23); // max is 23
  });

  test('should return exact match for available capacities', () => {
    expect(roundToNearestCapacity(9)).toBe(9);
    expect(roundToNearestCapacity(10)).toBe(10);
    expect(roundToNearestCapacity(12)).toBe(12);
    expect(roundToNearestCapacity(15)).toBe(15);
    expect(roundToNearestCapacity(20)).toBe(20);
    expect(roundToNearestCapacity(23)).toBe(23);
  });
});

describe('calculateRecommendedCapacity', () => {
  test('basic recommendation: PV 6kWp, no extras', () => {
    // 6 * 1.2 = 7.2 -> nearest is 9
    const result = calculateRecommendedCapacity(6, false, false, false);
    expect(result).toBe(9);
  });

  test('with heat pump: adds 5 kWh', () => {
    // 6 * 1.2 + 5 = 12.2 -> nearest is 12
    const result = calculateRecommendedCapacity(6, true, false, false);
    expect(result).toBe(12);
  });

  test('with EV: adds 5 kWh', () => {
    // 6 * 1.2 + 5 = 12.2 -> nearest is 12
    const result = calculateRecommendedCapacity(6, false, true, false);
    expect(result).toBe(12);
  });

  test('with backup: adds 2 kWh', () => {
    // 6 * 1.2 + 2 = 9.2 -> nearest is 9
    const result = calculateRecommendedCapacity(6, false, false, true);
    expect(result).toBe(9);
  });

  test('with all extras', () => {
    // 6 * 1.2 + 5 + 5 + 2 = 19.2 -> nearest is 20
    const result = calculateRecommendedCapacity(6, true, true, true);
    expect(result).toBe(20);
  });

  test('small PV system', () => {
    // 3 * 1.2 = 3.6 -> nearest is 9 (minimum)
    const result = calculateRecommendedCapacity(3, false, false, false);
    expect(result).toBe(9);
  });
});

describe('getRecommendations', () => {
  test('should return recommendations for retrofit', () => {
    const result = getRecommendations('retrofit', 6, false, false, false);
    expect(result).not.toBeNull();
    if (result) {
      expect(result.recommended.product.type).toBe('AC');
      expect(result.recommended.inverter).toBeUndefined();
    }
  });

  test('should return recommendations for hybrid', () => {
    const result = getRecommendations('hybrid', 6, false, false, false);
    expect(result).not.toBeNull();
    if (result) {
      expect(result.recommended.product.type).toBe('DC');
      expect(result.recommended.inverter).toBeDefined();
    }
  });

  test('should include inverter for upgrade', () => {
    const result = getRecommendations('upgrade', 6, false, false, false);
    expect(result).not.toBeNull();
    if (result) {
      expect(result.recommended.inverter).toBeDefined();
    }
  });

  test('recommended product should exist', () => {
    const result = getRecommendations('retrofit', 6, false, false, false);
    expect(result).not.toBeNull();
    if (result) {
      expect(result.recommended.product.id).toBeTruthy();
      expect(result.recommended.product.capacity_kwh).toBeGreaterThan(0);
      expect(result.recommended.product.price_gross).toBeGreaterThan(0);
    }
  });
});

describe('compatibility', () => {
  test('AC should always be compatible', () => {
    expect(isACCompatible()).toBe(true);
  });

  test('DC should be compatible with Huawei', () => {
    expect(isDCCompatible('Huawei')).toBe(true);
  });

  test('DC should not be compatible with SolarEdge', () => {
    expect(isDCCompatible('SolarEdge')).toBe(false);
  });
});

describe('getBackupEstimate', () => {
  test('should return reasonable hours for 10 kWh', () => {
    const result = getBackupEstimate(10, false);
    expect(result.hours_min).toBeGreaterThan(0);
    expect(result.hours_max).toBeGreaterThan(result.hours_min);
  });

  test('heat pump should reduce backup hours', () => {
    const withoutHP = getBackupEstimate(10, false);
    const withHP = getBackupEstimate(10, true);
    expect(withHP.hours_max).toBeLessThan(withoutHP.hours_max);
  });

  test('larger battery should provide more backup hours', () => {
    const small = getBackupEstimate(5, false);
    const large = getBackupEstimate(15, false);
    expect(large.hours_max).toBeGreaterThan(small.hours_max);
  });
});

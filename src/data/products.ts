import { Product, Inverter } from '@/lib/types';

// =====================================================
// WSZYSTKIE ZESTAWY — jedna lista 28 pozycji z XLS cennika
// Ceny brutto (8% VAT) za KOMPLETNY ZESTAW: magazyn + falownik + montaż
// Wariant A (EPS / bez pełnego backup)
// Źródło: Konfiguracja_Magazynow_Energii_Cennik.xlsx → "Cennik Zestawów"
// =====================================================

export const allProducts: Product[] = [
  // --- Sigenergy (PREMIUM) ---
  // Lp1: SigenStor 10kW + 9 kWh
  {
    id: 'sigen-9-10kw',
    name: 'Sigenergy 9 kWh',
    brand: 'Sigenergy',
    capacity_kwh: 9.0,
    power_continuous_kw: 4.6,
    power_peak_kw: 4.6,
    type: 'DC',
    inverter_power_kw: 10,
    inverter_cost_net: 6873, // XLS kol.I Lp1
    segment: 'PREMIUM',
    warranty_years: 10,
    price_gross: 29193, // XLS Lp1 war.A
    price_gross_b: 32772, // XLS Lp1 war.B
    eps_capable: true,
    image: '/products/sigenergy.png',
  },
  // Lp2: SigenStor 10kW + 12 kWh
  {
    id: 'sigen-12-10kw',
    name: 'Sigenergy 12 kWh',
    brand: 'Sigenergy',
    capacity_kwh: 12.0,
    power_continuous_kw: 6.0,
    power_peak_kw: 6.0,
    type: 'DC',
    inverter_power_kw: 10,
    inverter_cost_net: 6873, // XLS kol.I Lp2
    segment: 'PREMIUM',
    warranty_years: 10,
    price_gross: 30086, // XLS Lp2 war.A
    price_gross_b: 33665, // XLS Lp2 war.B
    eps_capable: true,
    image: '/products/sigenergy.png',
  },
  // Lp3: SigenStor 10kW + 15 kWh
  {
    id: 'sigen-15-10kw',
    name: 'Sigenergy 15 kWh',
    brand: 'Sigenergy',
    capacity_kwh: 15.0,
    power_continuous_kw: 7.6,
    power_peak_kw: 7.6,
    type: 'DC',
    inverter_power_kw: 10,
    inverter_cost_net: 6873, // XLS kol.I Lp3
    segment: 'PREMIUM',
    warranty_years: 10,
    price_gross: 41627, // XLS Lp3 war.A
    price_gross_b: 45206, // XLS Lp3 war.B
    eps_capable: true,
    image: '/products/sigenergy.png',
  },
  // Lp4: SigenStor 10kW + 18 kWh
  {
    id: 'sigen-18-10kw',
    name: 'Sigenergy 18 kWh',
    brand: 'Sigenergy',
    capacity_kwh: 18.0,
    power_continuous_kw: 9.2,
    power_peak_kw: 9.2,
    type: 'DC',
    inverter_power_kw: 10,
    inverter_cost_net: 6873, // XLS kol.I Lp4
    segment: 'PREMIUM',
    warranty_years: 10,
    price_gross: 42519, // XLS Lp4 war.A
    price_gross_b: 46098, // XLS Lp4 war.B
    eps_capable: true,
    image: '/products/sigenergy.png',
  },
  // Lp5: SigenStor 15kW + 15 kWh
  {
    id: 'sigen-15-15kw',
    name: 'Sigenergy 15 kWh (15kW)',
    brand: 'Sigenergy',
    capacity_kwh: 15.0,
    power_continuous_kw: 7.6,
    power_peak_kw: 7.6,
    type: 'DC',
    inverter_power_kw: 15,
    inverter_cost_net: 9116, // XLS kol.I Lp5
    segment: 'PREMIUM',
    warranty_years: 10,
    price_gross: 45353, // XLS Lp5 war.A
    price_gross_b: 48932, // XLS Lp5 war.B
    eps_capable: true,
    image: '/products/sigenergy.png',
  },
  // Lp6: SigenStor 15kW + 18 kWh
  {
    id: 'sigen-18-15kw',
    name: 'Sigenergy 18 kWh (15kW)',
    brand: 'Sigenergy',
    capacity_kwh: 18.0,
    power_continuous_kw: 9.2,
    power_peak_kw: 9.2,
    type: 'DC',
    inverter_power_kw: 15,
    inverter_cost_net: 9116, // XLS kol.I Lp6
    segment: 'PREMIUM',
    warranty_years: 10,
    price_gross: 49994, // XLS Lp6 war.A
    price_gross_b: 53573, // XLS Lp6 war.B
    eps_capable: true,
    image: '/products/sigenergy.png',
  },
  // Lp7: SigenStor 20kW + 21 kWh
  {
    id: 'sigen-21-20kw',
    name: 'Sigenergy 21 kWh (20kW)',
    brand: 'Sigenergy',
    capacity_kwh: 21.0,
    power_continuous_kw: 10.6,
    power_peak_kw: 10.6,
    type: 'DC',
    inverter_power_kw: 20,
    inverter_cost_net: 10178, // XLS kol.I Lp7
    segment: 'PREMIUM',
    warranty_years: 10,
    price_gross: 56398, // XLS Lp7 war.A
    price_gross_b: 59977, // XLS Lp7 war.B
    eps_capable: true,
    image: '/products/sigenergy.png',
  },

  // --- Sigenergy RETROFIT (PREMIUM RETROFIT) ---
  // Lp8: Sigen Hybrid TP2 10kW + 9 kWh
  {
    id: 'sigen-retro-9-10kw',
    name: 'Sigenergy Retrofit 9 kWh',
    brand: 'Sigenergy',
    capacity_kwh: 9.0,
    power_continuous_kw: 4.6,
    power_peak_kw: 4.6,
    type: 'DC',
    inverter_power_kw: 10,
    inverter_cost_net: 3876, // XLS kol.I Lp8
    segment: 'PREMIUM RETROFIT',
    warranty_years: 10,
    price_gross: 25885, // XLS Lp8 war.A
    price_gross_b: 29464, // XLS Lp8 war.B
    eps_capable: true,
    image: '/products/sigenergy.png',
  },
  // Lp9: Sigen Hybrid TP2 12kW + 15 kWh
  {
    id: 'sigen-retro-15-12kw',
    name: 'Sigenergy Retrofit 15 kWh (12kW)',
    brand: 'Sigenergy',
    capacity_kwh: 15.0,
    power_continuous_kw: 7.6,
    power_peak_kw: 7.6,
    type: 'DC',
    inverter_power_kw: 12,
    inverter_cost_net: 3987, // XLS kol.I Lp9
    segment: 'PREMIUM RETROFIT',
    warranty_years: 10,
    price_gross: 38502, // XLS Lp9 war.A
    price_gross_b: 42081, // XLS Lp9 war.B
    eps_capable: true,
    image: '/products/sigenergy.png',
  },

  // --- FoxESS (STANDARD) ---
  // Lp10: P3-10.0-SH 10kW + 10.36 kWh
  {
    id: 'foxess-10-10kw',
    name: 'FoxESS 10.36 kWh',
    brand: 'FoxESS',
    capacity_kwh: 10.36,
    power_continuous_kw: 5.2,
    power_peak_kw: 5.2,
    type: 'DC',
    inverter_power_kw: 10,
    inverter_cost_net: 5164, // XLS kol.I Lp10
    segment: 'STANDARD',
    warranty_years: 10,
    price_gross: 22823, // XLS Lp10 war.A
    price_gross_b: 25754, // XLS Lp10 war.B
    eps_capable: true,
    image: '/products/foxess-ecs.png',
  },
  // Lp11: P3-10.0-SH 10kW + 11.52 kWh
  {
    id: 'foxess-11-10kw',
    name: 'FoxESS 11.52 kWh',
    brand: 'FoxESS',
    capacity_kwh: 11.52,
    power_continuous_kw: 5.8,
    power_peak_kw: 5.8,
    type: 'DC',
    inverter_power_kw: 10,
    inverter_cost_net: 5164, // XLS kol.I Lp11
    segment: 'STANDARD',
    warranty_years: 10,
    price_gross: 22849, // XLS Lp11 war.A
    price_gross_b: 25781, // XLS Lp11 war.B
    eps_capable: true,
    image: '/products/foxess-ecs.png',
  },
  // Lp12: P3-12.0-SH 12kW + 10.36 kWh
  {
    id: 'foxess-10-12kw',
    name: 'FoxESS 10.36 kWh (12kW)',
    brand: 'FoxESS',
    capacity_kwh: 10.36,
    power_continuous_kw: 5.2,
    power_peak_kw: 5.2,
    type: 'DC',
    inverter_power_kw: 12,
    inverter_cost_net: 5526, // XLS kol.I Lp12
    segment: 'STANDARD',
    warranty_years: 10,
    price_gross: 23382, // XLS Lp12 war.A
    price_gross_b: 26314, // XLS Lp12 war.B
    eps_capable: true,
    image: '/products/foxess-ecs.png',
  },
  // Lp13: P3-15.0-SH 15kW + 11.52 kWh (2xEP6)
  {
    id: 'foxess-11-15kw',
    name: 'FoxESS 11.52 kWh (15kW)',
    brand: 'FoxESS',
    capacity_kwh: 11.52,
    power_continuous_kw: 5.8,
    power_peak_kw: 5.8,
    type: 'DC',
    inverter_power_kw: 15,
    inverter_cost_net: 5952, // XLS kol.I Lp13
    segment: 'STANDARD',
    warranty_years: 10,
    price_gross: 26678, // XLS Lp13 war.A
    price_gross_b: 29609, // XLS Lp13 war.B
    eps_capable: true,
    image: '/products/foxess-ecs.png',
  },
  // Lp14: P3-15.0-SH 15kW + 15.54 kWh
  {
    id: 'foxess-15-15kw',
    name: 'FoxESS 15.54 kWh (15kW)',
    brand: 'FoxESS',
    capacity_kwh: 15.54,
    power_continuous_kw: 7.8,
    power_peak_kw: 7.8,
    type: 'DC',
    inverter_power_kw: 15,
    inverter_cost_net: 5952, // XLS kol.I Lp14
    segment: 'STANDARD',
    warranty_years: 10,
    price_gross: 30191, // XLS Lp14 war.A
    price_gross_b: 33122, // XLS Lp14 war.B
    eps_capable: true,
    image: '/products/foxess-ecs.png',
  },
  // Lp15: P3-PRO-15.0 15kW + 10.36 kWh
  {
    id: 'foxess-10-pro15kw',
    name: 'FoxESS PRO 10.36 kWh (15kW)',
    brand: 'FoxESS',
    capacity_kwh: 10.36,
    power_continuous_kw: 5.2,
    power_peak_kw: 5.2,
    type: 'DC',
    inverter_power_kw: 15,
    inverter_cost_net: 7368, // XLS kol.I Lp15 (PRO)
    segment: 'STANDARD',
    warranty_years: 10,
    price_gross: 28802, // XLS Lp15 war.A
    price_gross_b: 29637, // XLS Lp15 war.B
    eps_capable: true,
    image: '/products/foxess-ecs.png',
  },
  // Lp16: P3-PRO-20.0 20kW + 20.72 kWh (2xEP11)
  {
    id: 'foxess-20-pro20kw',
    name: 'FoxESS 20.72 kWh (20kW)',
    brand: 'FoxESS',
    capacity_kwh: 20.72,
    power_continuous_kw: 11.6,
    power_peak_kw: 11.6,
    type: 'DC',
    inverter_power_kw: 20,
    inverter_cost_net: 8187, // XLS kol.I Lp16 (PRO)
    segment: 'STANDARD',
    warranty_years: 10,
    price_gross: 41623, // XLS Lp16 war.A
    price_gross_b: 42459, // XLS Lp16 war.B
    eps_capable: true,
    image: '/products/foxess-ecs.png',
  },

  // --- GoodWe Lynx (STANDARD) ---
  // Lp17: GW10K-ET 10kW + 10 kWh
  {
    id: 'goodwe-10-10kw',
    name: 'GoodWe Lynx 10 kWh',
    brand: 'GoodWe',
    capacity_kwh: 10.0,
    power_continuous_kw: 6.0,
    power_peak_kw: 6.0,
    type: 'DC',
    inverter_power_kw: 10,
    inverter_cost_net: 4264, // XLS kol.I Lp17
    segment: 'STANDARD',
    warranty_years: 10,
    price_gross: 24168, // XLS Lp17 war.A
    price_gross_b: 29080, // XLS Lp17 war.B
    eps_capable: true,
    image: '/products/goodwe-lynx.png',
  },
  // Lp18: GW10K-ET 10kW + 15 kWh
  {
    id: 'goodwe-15-10kw',
    name: 'GoodWe Lynx 15 kWh',
    brand: 'GoodWe',
    capacity_kwh: 15.0,
    power_continuous_kw: 9.0,
    power_peak_kw: 9.0,
    type: 'DC',
    inverter_power_kw: 10,
    inverter_cost_net: 4264, // XLS kol.I Lp18
    segment: 'STANDARD',
    warranty_years: 10,
    price_gross: 31918, // XLS Lp18 war.A
    price_gross_b: 36829, // XLS Lp18 war.B
    eps_capable: true,
    image: '/products/goodwe-lynx.png',
  },
  // Lp19: GW15K-ET 15kW + 15 kWh
  {
    id: 'goodwe-15-15kw',
    name: 'GoodWe Lynx 15 kWh (15kW)',
    brand: 'GoodWe',
    capacity_kwh: 15.0,
    power_continuous_kw: 9.0,
    power_peak_kw: 9.0,
    type: 'DC',
    inverter_power_kw: 15,
    inverter_cost_net: 4417, // XLS kol.I Lp19
    segment: 'STANDARD',
    warranty_years: 10,
    price_gross: 32154, // XLS Lp19 war.A
    price_gross_b: 37066, // XLS Lp19 war.B
    eps_capable: true,
    image: '/products/goodwe-lynx.png',
  },
  // Lp20: GW20K-ET 20kW + 20 kWh
  {
    id: 'goodwe-20-20kw',
    name: 'GoodWe Lynx 20 kWh (20kW)',
    brand: 'GoodWe',
    capacity_kwh: 20.0,
    power_continuous_kw: 12.0,
    power_peak_kw: 12.0,
    type: 'DC',
    inverter_power_kw: 20,
    inverter_cost_net: 8089, // XLS kol.I Lp20
    segment: 'STANDARD',
    warranty_years: 10,
    price_gross: 45568, // XLS Lp20 war.A
    price_gross_b: 50607, // XLS Lp20 war.B
    eps_capable: true,
    image: '/products/goodwe-lynx.png',
  },

  // --- GoodWe/Dyness (STANDARD CROSS) ---
  // Lp21: GW10K-ET 10kW + Dyness 10.65 kWh
  {
    id: 'goodwe-dyness-10-10kw',
    name: 'GoodWe + Dyness 10.65 kWh',
    brand: 'GoodWe/Dyness',
    capacity_kwh: 10.65,
    power_continuous_kw: 6.39,
    power_peak_kw: 6.39,
    type: 'DC',
    inverter_power_kw: 10,
    inverter_cost_net: 4264, // XLS kol.I Lp21 (GoodWe 10kW)
    segment: 'STANDARD CROSS',
    warranty_years: 10,
    price_gross: 20885, // XLS Lp21 war.A
    price_gross_b: 25796, // XLS Lp21 war.B
    eps_capable: true,
    image: '/products/dyness-tower.png',
  },
  // Lp22: GW15K-ET 15kW + Dyness 14.2 kWh
  {
    id: 'goodwe-dyness-14-15kw',
    name: 'GoodWe + Dyness 14.2 kWh (15kW)',
    brand: 'GoodWe/Dyness',
    capacity_kwh: 14.2,
    power_continuous_kw: 8.52,
    power_peak_kw: 8.52,
    type: 'DC',
    inverter_power_kw: 15,
    inverter_cost_net: 4417, // XLS kol.I Lp22 (GoodWe 15kW)
    segment: 'STANDARD CROSS',
    warranty_years: 10,
    price_gross: 24707, // XLS Lp22 war.A
    price_gross_b: 29618, // XLS Lp22 war.B
    eps_capable: true,
    image: '/products/dyness-tower.png',
  },

  // --- GoodWe/BYD (STANDARD CROSS) ---
  // Lp23: GW10K-ET 10kW + BYD 11.04 kWh
  {
    id: 'goodwe-byd-11-10kw',
    name: 'GoodWe + BYD 11.04 kWh',
    brand: 'GoodWe/BYD',
    capacity_kwh: 11.04,
    power_continuous_kw: 5.1,
    power_peak_kw: 5.1,
    type: 'DC',
    inverter_power_kw: 10,
    inverter_cost_net: 4264, // XLS kol.I Lp23 (GoodWe 10kW)
    segment: 'STANDARD CROSS',
    warranty_years: 10,
    price_gross: 30476, // XLS Lp23 war.A
    price_gross_b: 35388, // XLS Lp23 war.B
    eps_capable: true,
    image: '/products/goodwe-lynx.png',
  },
  // Lp24: GW15K-ET 15kW + BYD 16.56 kWh
  {
    id: 'goodwe-byd-16-15kw',
    name: 'GoodWe + BYD 16.56 kWh (15kW)',
    brand: 'GoodWe/BYD',
    capacity_kwh: 16.56,
    power_continuous_kw: 7.68,
    power_peak_kw: 7.68,
    type: 'DC',
    inverter_power_kw: 15,
    inverter_cost_net: 4417, // XLS kol.I Lp24 (GoodWe 15kW)
    segment: 'STANDARD CROSS',
    warranty_years: 10,
    price_gross: 40410, // XLS Lp24 war.A
    price_gross_b: 45322, // XLS Lp24 war.B
    eps_capable: true,
    image: '/products/goodwe-lynx.png',
  },

  // --- Huawei (STANDARD) ---
  // Lp25: SUN2000-10K 10kW + LUNA2000 10 kWh
  {
    id: 'huawei-10-10kw',
    name: 'Huawei LUNA2000 10 kWh',
    brand: 'Huawei',
    capacity_kwh: 10.0,
    power_continuous_kw: 5.0,
    power_peak_kw: 5.0,
    type: 'DC',
    inverter_power_kw: 10,
    inverter_cost_net: 5517, // XLS kol.I Lp25
    segment: 'STANDARD',
    warranty_years: 10,
    price_gross: 36163, // XLS Lp25 war.A
    price_gross_b: 41392, // XLS Lp25 war.B
    eps_capable: true,
    image: '/products/huawei-luna.png',
  },
  // Lp26: SUN2000-10K 10kW + LUNA2000 15 kWh
  {
    id: 'huawei-15-10kw',
    name: 'Huawei LUNA2000 15 kWh',
    brand: 'Huawei',
    capacity_kwh: 15.0,
    power_continuous_kw: 7.5,
    power_peak_kw: 7.5,
    type: 'DC',
    inverter_power_kw: 10,
    inverter_cost_net: 5517, // XLS kol.I Lp26
    segment: 'STANDARD',
    warranty_years: 10,
    price_gross: 46998, // XLS Lp26 war.A
    price_gross_b: 52227, // XLS Lp26 war.B
    eps_capable: true,
    image: '/products/huawei-luna.png',
  },
  // Lp27: SUN2000-15K 15kW + LUNA2000 15 kWh
  {
    id: 'huawei-15-15kw',
    name: 'Huawei LUNA2000 15 kWh (15kW)',
    brand: 'Huawei',
    capacity_kwh: 15.0,
    power_continuous_kw: 7.5,
    power_peak_kw: 7.5,
    type: 'DC',
    inverter_power_kw: 15,
    inverter_cost_net: 7961, // XLS kol.I Lp27
    segment: 'STANDARD',
    warranty_years: 10,
    price_gross: 50767, // XLS Lp27 war.A
    price_gross_b: 55996, // XLS Lp27 war.B
    eps_capable: true,
    image: '/products/huawei-luna.png',
  },
  // Lp28: SUN2000-20K 20kW + LUNA2000 15 kWh
  {
    id: 'huawei-15-20kw',
    name: 'Huawei LUNA2000 15 kWh (20kW)',
    brand: 'Huawei',
    capacity_kwh: 15.0,
    power_continuous_kw: 7.5,
    power_peak_kw: 7.5,
    type: 'DC',
    inverter_power_kw: 20,
    inverter_cost_net: 8579, // XLS kol.I Lp28
    segment: 'STANDARD',
    warranty_years: 10,
    price_gross: 51721, // XLS Lp28 war.A
    price_gross_b: 56950, // XLS Lp28 war.B
    eps_capable: true,
    image: '/products/huawei-luna.png',
  },
];

// Aliasy dla kompatybilności wstecznej (używane w importach)
export const productsAC: Product[] = allProducts;
export const productsDC: Product[] = allProducts;

// =====================================================
// FALOWNIKI HYBRYDOWE
// Cena = 0 (falownik wliczony w cenę kompletnego zestawu)
// =====================================================

export const inverters: Inverter[] = [
  {
    id: 'huawei-sun2000-10ktl',
    name: 'Huawei SUN2000-10KTL',
    brand: 'Huawei',
    power_kw: 10.0,
    type: 'hybrid',
    price_gross: 0,
    compatible_batteries: ['huawei-10-10kw', 'huawei-15-10kw', 'huawei-15-15kw', 'huawei-15-20kw'],
  },
  {
    id: 'sigenergy-10kw',
    name: 'Sigenergy Falownik 10 kW',
    brand: 'Sigenergy',
    power_kw: 10.0,
    type: 'hybrid',
    price_gross: 0,
    compatible_batteries: ['sigen-9-10kw', 'sigen-12-10kw', 'sigen-15-10kw', 'sigen-18-10kw', 'sigen-15-15kw', 'sigen-18-15kw', 'sigen-21-20kw', 'sigen-retro-9-10kw', 'sigen-retro-15-12kw'],
  },
  {
    id: 'goodwe-10kw',
    name: 'GoodWe Falownik 10 kW',
    brand: 'GoodWe',
    power_kw: 10.0,
    type: 'hybrid',
    price_gross: 0,
    compatible_batteries: ['goodwe-10-10kw', 'goodwe-15-10kw', 'goodwe-15-15kw', 'goodwe-20-20kw', 'goodwe-dyness-10-10kw', 'goodwe-dyness-14-15kw', 'goodwe-byd-11-10kw', 'goodwe-byd-16-15kw'],
  },
  {
    id: 'foxess-10kw',
    name: 'FoxESS Falownik 10 kW',
    brand: 'FoxESS',
    power_kw: 10.0,
    type: 'hybrid',
    price_gross: 0,
    compatible_batteries: ['foxess-10-10kw', 'foxess-11-10kw', 'foxess-10-12kw', 'foxess-11-15kw', 'foxess-15-15kw', 'foxess-10-pro15kw', 'foxess-20-pro20kw'],
  },
];

export const availableCapacities = [10, 11, 12, 14, 15, 16, 17, 18, 20, 21, 23];

export const inverterBrands = [
  'Huawei',
  'SolarEdge',
  'Fronius',
  'SMA',
  'Growatt',
  'Sofar',
  'GoodWe',
  'Sungrow',
  'FoxESS',
  'Sigenergy',
  'Deye',
  'Afore',
  'Inna marka',
  'Nie wiem / Nie mam jeszcze',
];

import { Product, Inverter } from '@/lib/types';

// =====================================================
// PRODUKTY AC (RETROFIT) — kompatybilne z każdym falownikiem stringowym
// Ceny brutto za KOMPLETNY ZESTAW (magazyn + falownik 10kW + EMS + backup SZR + montaż)
// Źródło: Cenniki i zestawy-2.xlsx, wiersze 77-82
// =====================================================

export const productsAC: Product[] = [
  // --- FoxESS ECS (Row 81) ---
  // Tier: 10 kWh — ECS 5.2kW/10.24kWh
  {
    id: 'foxess-10',
    name: 'FoxESS ECS 10.24',
    brand: 'FoxESS',
    capacity_kwh: 10.24,
    power_continuous_kw: 5.2,
    power_peak_kw: 5.2,
    type: 'AC',
    warranty_years: 10,
    price_gross: 27513,
    eps_capable: true,
    image: '/products/foxess-ecs.png',
  },
  // Tier: 12 kWh — ECS 5.8kW/11.52kWh
  {
    id: 'foxess-11',
    name: 'FoxESS ECS 11.52',
    brand: 'FoxESS',
    capacity_kwh: 11.52,
    power_continuous_kw: 5.8,
    power_peak_kw: 5.8,
    type: 'AC',
    warranty_years: 10,
    price_gross: 28498,
    eps_capable: true,
    image: '/products/foxess-ecs.png',
  },
  // Tier: 15 kWh — ECS 7.8kW/15.36kWh
  {
    id: 'foxess-15',
    name: 'FoxESS ECS 15.36',
    brand: 'FoxESS',
    capacity_kwh: 15.36,
    power_continuous_kw: 7.8,
    power_peak_kw: 7.8,
    type: 'AC',
    warranty_years: 10,
    price_gross: 34384,
    eps_capable: true,
    image: '/products/foxess-ecs.png',
  },
  // Tier: 18 kWh — ECS 8.7kW/17.28kWh
  {
    id: 'foxess-17',
    name: 'FoxESS ECS 17.28',
    brand: 'FoxESS',
    capacity_kwh: 17.28,
    power_continuous_kw: 8.7,
    power_peak_kw: 8.7,
    type: 'AC',
    warranty_years: 10,
    price_gross: 35654,
    eps_capable: true,
    image: '/products/foxess-ecs.png',
  },
  // Tier: 20 kWh — ECS 11.6kW/23.04kWh
  {
    id: 'foxess-23',
    name: 'FoxESS ECS 23.04',
    brand: 'FoxESS',
    capacity_kwh: 23.04,
    power_continuous_kw: 11.6,
    power_peak_kw: 11.6,
    type: 'AC',
    warranty_years: 10,
    price_gross: 37687,
    eps_capable: true,
    image: '/products/foxess-ecs.png',
  },

  // --- GoodWe Lynx Home (Row 80) — only 10, 15, 20 kWh tiers ---
  // Tier: 10 kWh — 6kW/10kWh
  {
    id: 'goodwe-10',
    name: 'GoodWe Lynx Home 10',
    brand: 'GoodWe',
    capacity_kwh: 10.0,
    power_continuous_kw: 6.0,
    power_peak_kw: 6.0,
    type: 'AC',
    warranty_years: 10,
    price_gross: 29780,
    eps_capable: true,
    image: '/products/goodwe-lynx.png',
  },
  // Tier: 15 kWh — 9kW/15kWh
  {
    id: 'goodwe-15',
    name: 'GoodWe Lynx Home 15',
    brand: 'GoodWe',
    capacity_kwh: 15.0,
    power_continuous_kw: 9.0,
    power_peak_kw: 9.0,
    type: 'AC',
    warranty_years: 10,
    price_gross: 37616,
    eps_capable: true,
    image: '/products/goodwe-lynx.png',
  },
  // Tier: 20 kWh — 12kW/20kWh
  {
    id: 'goodwe-20',
    name: 'GoodWe Lynx Home 20',
    brand: 'GoodWe',
    capacity_kwh: 20.0,
    power_continuous_kw: 12.0,
    power_peak_kw: 12.0,
    type: 'AC',
    warranty_years: 10,
    price_gross: 43040,
    eps_capable: true,
    image: '/products/goodwe-lynx.png',
  },

  // --- GoodWe + Dyness (Row 82) — only 10, 15, 20 kWh tiers ---
  // Tier: 10 kWh — 6.39kW/10.66kWh
  {
    id: 'goodwe-dyness-10',
    name: 'GoodWe + Dyness 10.66',
    brand: 'GoodWe/Dyness',
    capacity_kwh: 10.66,
    power_continuous_kw: 6.39,
    power_peak_kw: 6.39,
    type: 'AC',
    warranty_years: 10,
    price_gross: 27735,
    eps_capable: true,
    image: '/products/dyness-tower.png',
  },
  // Tier: 15 kWh — 8.52kW/14.21kWh
  {
    id: 'goodwe-dyness-14',
    name: 'GoodWe + Dyness 14.21',
    brand: 'GoodWe/Dyness',
    capacity_kwh: 14.21,
    power_continuous_kw: 8.52,
    power_peak_kw: 8.52,
    type: 'AC',
    warranty_years: 10,
    price_gross: 32404,
    eps_capable: true,
    image: '/products/dyness-tower.png',
  },
  // Tier: 20 kWh — 12.78kW/21.31kWh
  {
    id: 'goodwe-dyness-21',
    name: 'GoodWe + Dyness 21.31',
    brand: 'GoodWe/Dyness',
    capacity_kwh: 21.31,
    power_continuous_kw: 12.78,
    power_peak_kw: 12.78,
    type: 'AC',
    warranty_years: 10,
    price_gross: 36987,
    eps_capable: true,
    image: '/products/dyness-tower.png',
  },
];

// =====================================================
// PRODUKTY DC — wymagają falownika hybrydowego
// Ceny brutto za KOMPLETNY ZESTAW (magazyn + falownik 10kW + EMS + backup SZR + montaż)
// =====================================================

export const productsDC: Product[] = [
  // --- Huawei LUNA2000 (Row 79) — only 10, 15, 21 kWh tiers ---
  // Tier: 10 kWh — 5kW/10kWh
  {
    id: 'huawei-luna-10',
    name: 'Huawei LUNA2000 10 kWh',
    brand: 'Huawei',
    capacity_kwh: 10.0,
    power_continuous_kw: 5.0,
    power_peak_kw: 5.0,
    type: 'DC',
    warranty_years: 10,
    price_gross: 35702,
    eps_capable: true,
    compatible_inverters: ['Huawei SUN2000'],
    image: '/products/huawei-luna.png',
  },
  // Tier: 15 kWh — 7.5kW/15kWh
  {
    id: 'huawei-luna-15',
    name: 'Huawei LUNA2000 15 kWh',
    brand: 'Huawei',
    capacity_kwh: 15.0,
    power_continuous_kw: 7.5,
    power_peak_kw: 7.5,
    type: 'DC',
    warranty_years: 10,
    price_gross: 45445,
    eps_capable: true,
    compatible_inverters: ['Huawei SUN2000'],
    image: '/products/huawei-luna.png',
  },
  // Tier: 20 kWh — 10.5kW/21kWh (note: actual capacity 21 kWh)
  {
    id: 'huawei-luna-21',
    name: 'Huawei LUNA2000 21 kWh',
    brand: 'Huawei',
    capacity_kwh: 21.0,
    power_continuous_kw: 10.5,
    power_peak_kw: 10.5,
    type: 'DC',
    warranty_years: 10,
    price_gross: 57186,
    eps_capable: true,
    compatible_inverters: ['Huawei SUN2000'],
    image: '/products/huawei-luna.png',
  },

  // --- Sigenergy AllinOne (Row 78) ---
  // Tier: 10 kWh — ME 4.6kW/9kWh
  {
    id: 'sigen-9',
    name: 'Sigenergy AllinOne 9 kWh',
    brand: 'Sigenergy',
    capacity_kwh: 9.0,
    power_continuous_kw: 4.6,
    power_peak_kw: 4.6,
    type: 'DC',
    warranty_years: 10,
    price_gross: 31053,
    eps_capable: true,
    compatible_inverters: ['Sigenergy'],
    image: '/products/sigenergy.png',
  },
  // Tier: 12 kWh — ME 6kW/12kWh
  {
    id: 'sigen-12',
    name: 'Sigenergy AllinOne 12 kWh',
    brand: 'Sigenergy',
    capacity_kwh: 12.0,
    power_continuous_kw: 6.0,
    power_peak_kw: 6.0,
    type: 'DC',
    warranty_years: 10,
    price_gross: 38358,
    eps_capable: true,
    compatible_inverters: ['Sigenergy'],
    image: '/products/sigenergy.png',
  },
  // Tier: 15 kWh — ME 7.6kW/15kWh
  {
    id: 'sigen-15',
    name: 'Sigenergy AllinOne 15 kWh',
    brand: 'Sigenergy',
    capacity_kwh: 15.0,
    power_continuous_kw: 7.6,
    power_peak_kw: 7.6,
    type: 'DC',
    warranty_years: 10,
    price_gross: 41875,
    eps_capable: true,
    compatible_inverters: ['Sigenergy'],
    image: '/products/sigenergy.png',
  },
  // Tier: 18 kWh — ME 9.2kW/18kWh
  {
    id: 'sigen-18',
    name: 'Sigenergy AllinOne 18 kWh',
    brand: 'Sigenergy',
    capacity_kwh: 18.0,
    power_continuous_kw: 9.2,
    power_peak_kw: 9.2,
    type: 'DC',
    warranty_years: 10,
    price_gross: 44311,
    eps_capable: true,
    compatible_inverters: ['Sigenergy'],
    image: '/products/sigenergy.png',
  },
  // Tier: 20 kWh — ME 10.6kW/21kWh (note: actual capacity 21 kWh)
  {
    id: 'sigen-21',
    name: 'Sigenergy AllinOne 21 kWh',
    brand: 'Sigenergy',
    capacity_kwh: 21.0,
    power_continuous_kw: 10.6,
    power_peak_kw: 10.6,
    type: 'DC',
    warranty_years: 10,
    price_gross: 50536,
    eps_capable: true,
    compatible_inverters: ['Sigenergy'],
    image: '/products/sigenergy.png',
  },
];

// =====================================================
// FALOWNIKI HYBRYDOWE
// Wszystkie ceny = 0 (falownik 10kW wliczony w cenę kompletnego zestawu)
// =====================================================

export const inverters: Inverter[] = [
  {
    id: 'huawei-sun2000-10ktl',
    name: 'Huawei SUN2000-10KTL',
    brand: 'Huawei',
    power_kw: 10.0,
    type: 'hybrid',
    price_gross: 0, // wliczony w cenę zestawu
    compatible_batteries: ['huawei-luna-10', 'huawei-luna-15', 'huawei-luna-21'],
  },
  {
    id: 'sigenergy-10kw',
    name: 'Sigenergy Falownik 10 kW',
    brand: 'Sigenergy',
    power_kw: 10.0,
    type: 'hybrid',
    price_gross: 0, // wliczony w cenę AllinOne
    compatible_batteries: ['sigen-9', 'sigen-12', 'sigen-15', 'sigen-18', 'sigen-21'],
  },
  {
    id: 'goodwe-10kw',
    name: 'GoodWe Falownik 10 kW',
    brand: 'GoodWe',
    power_kw: 10.0,
    type: 'hybrid',
    price_gross: 0, // wliczony w cenę zestawu
    compatible_batteries: ['goodwe-10', 'goodwe-15', 'goodwe-20', 'goodwe-dyness-10', 'goodwe-dyness-14', 'goodwe-dyness-21'],
  },
  {
    id: 'foxess-10kw',
    name: 'FoxESS Falownik 10 kW',
    brand: 'FoxESS',
    power_kw: 10.0,
    type: 'hybrid',
    price_gross: 0, // wliczony w cenę zestawu
    compatible_batteries: ['foxess-10', 'foxess-11', 'foxess-15', 'foxess-17', 'foxess-23'],
  },
];

export const allProducts: Product[] = [...productsAC, ...productsDC];

export const availableCapacities = [10, 12, 15, 18, 20, 21, 23];

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

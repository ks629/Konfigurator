import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ConfiguratorState,
  InstallationType,
  BillingSystem,
  Tariff,
  BackupPreference,
  BackupVariant,
  Priority,
  UserProfile,
  EnergyOperator,
  PVOrientation,
  TaxBracket,
  PVMountType,
  PVAzimuthPreset,
  PVVariantTier,
} from '@/lib/types';

interface ConfiguratorStore extends ConfiguratorState {
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setInstallationType: (type: InstallationType) => void;
  setPvPowerKwp: (power: number) => void;
  setInverterBrand: (brand: string) => void;
  setInverterModel: (model: string) => void;
  setInstallationYear: (year: number) => void;
  setConsumptionMode: (mode: 'kwh' | 'bill') => void;
  setAnnualConsumptionKwh: (kwh: number) => void;
  setMonthlyBill: (bill: number) => void;
  setTariff: (tariff: Tariff) => void;
  setBillingSystem: (system: BillingSystem) => void;
  setHasHeatPump: (val: boolean) => void;
  setHasEV: (val: boolean) => void;
  setBackupPreference: (pref: BackupPreference) => void;
  setBackupVariant: (variant: BackupVariant) => void;
  setPriorities: (priorities: Priority[]) => void;
  togglePriority: (priority: Priority) => void;
  setSelectedProductId: (id: string | null) => void;
  setSelectedInverterId: (id: string | null) => void;
  // Nowe settery
  setUserProfile: (profile: UserProfile) => void;
  setEnergyOperator: (operator: EnergyOperator) => void;
  setPvOrientation: (orientation: PVOrientation) => void;
  setWantsSubsidy: (val: boolean) => void;
  setThermomodernizationUsedPercent: (percent: number) => void;
  setTaxBracket: (bracket: TaxBracket) => void;
  // Settery PV (full_pv flow)
  setPvMountType: (type: PVMountType) => void;
  setPvAzimuthPreset: (preset: PVAzimuthPreset) => void;
  setPvTiltAngle: (angle: number) => void;
  setRoofWidth: (width: number) => void;
  setRoofLength: (length: number) => void;
  setPlansEV: (val: boolean) => void;
  setEvExtraKwh: (kwh: number) => void;
  setPlansHeatPump: (val: boolean) => void;
  setHeatPumpExtraKwh: (kwh: number) => void;
  setOtherExtraKwh: (kwh: number) => void;
  setSelectedPanelId: (id: string) => void;
  setSelectedPvVariant: (tier: PVVariantTier | null) => void;
  setPvCalculatedKwp: (kwp: number) => void;
  setPvCalculatedPanelCount: (count: number) => void;
  setPvCalculatedBatteryKwh: (kwh: number) => void;
  setPvPrice: (price: number) => void;
  reset: () => void;
}

const initialState: ConfiguratorState = {
  currentStep: 1,
  installationType: null,
  pvPowerKwp: 6.0,
  inverterBrand: '',
  inverterModel: '',
  installationYear: 2023,
  consumptionMode: 'kwh',
  annualConsumptionKwh: 4000,
  monthlyBill: 300,
  tariff: 'G11',
  billingSystem: 'net-billing',
  hasHeatPump: false,
  hasEV: false,
  backupPreference: 'no',
  backupVariant: 'A',
  priorities: [],
  selectedProductId: null,
  selectedInverterId: null,
  // Nowe pola
  userProfile: 'standard',
  energyOperator: 'tauron',
  pvOrientation: 'south',
  wantsSubsidy: true,
  thermomodernizationUsedPercent: 0,
  taxBracket: 12,
  // Pola PV (full_pv flow)
  pvMountType: 'roof_angled',
  pvAzimuthPreset: 'S',
  pvTiltAngle: 35,
  roofWidth: 10,
  roofLength: 6,
  plansEV: false,
  evExtraKwh: 3500,
  plansHeatPump: false,
  heatPumpExtraKwh: 5000,
  otherExtraKwh: 0,
  selectedPanelId: 'keno-455',
  selectedPvVariant: null,
  pvCalculatedKwp: 0,
  pvCalculatedPanelCount: 0,
  pvCalculatedBatteryKwh: 0,
  pvPrice: 0,
};

export const useConfigurator = create<ConfiguratorStore>()(
  persist(
    (set) => ({
      ...initialState,
      setStep: (step) => set({ currentStep: step }),
      nextStep: () =>
        set((state) => ({ currentStep: Math.min(state.currentStep + 1, 5) })),
      prevStep: () =>
        set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
      setInstallationType: (type) => set({ installationType: type }),
      setPvPowerKwp: (power) => set({ pvPowerKwp: power }),
      setInverterBrand: (brand) => set({ inverterBrand: brand }),
      setInverterModel: (model) => set({ inverterModel: model }),
      setInstallationYear: (year) => set({ installationYear: year }),
      setConsumptionMode: (mode) => set({ consumptionMode: mode }),
      setAnnualConsumptionKwh: (kwh) => set({ annualConsumptionKwh: kwh }),
      setMonthlyBill: (bill) => set({ monthlyBill: bill }),
      setTariff: (tariff) => set({ tariff: tariff }),
      setBillingSystem: (system) => set({ billingSystem: system }),
      setHasHeatPump: (val) => set({ hasHeatPump: val }),
      setHasEV: (val) => set({ hasEV: val }),
      setBackupPreference: (pref) => set({ backupPreference: pref }),
      setBackupVariant: (variant) => set({ backupVariant: variant }),
      setPriorities: (priorities) => set({ priorities }),
      togglePriority: (priority) =>
        set((state) => ({
          priorities: state.priorities.includes(priority)
            ? state.priorities.filter((p) => p !== priority)
            : [...state.priorities, priority],
        })),
      setSelectedProductId: (id) => set({ selectedProductId: id }),
      setSelectedInverterId: (id) => set({ selectedInverterId: id }),
      // Nowe settery
      setUserProfile: (profile) => set({ userProfile: profile }),
      setEnergyOperator: (operator) => set({ energyOperator: operator }),
      setPvOrientation: (orientation) => set({ pvOrientation: orientation }),
      setWantsSubsidy: (val) => set({ wantsSubsidy: val }),
      setThermomodernizationUsedPercent: (percent) =>
        set({ thermomodernizationUsedPercent: percent }),
      setTaxBracket: (bracket) => set({ taxBracket: bracket }),
      // Settery PV (full_pv flow)
      setPvMountType: (type) => set({ pvMountType: type }),
      setPvAzimuthPreset: (preset) => set({ pvAzimuthPreset: preset }),
      setPvTiltAngle: (angle) => set({ pvTiltAngle: angle }),
      setRoofWidth: (width) => set({ roofWidth: width }),
      setRoofLength: (length) => set({ roofLength: length }),
      setPlansEV: (val) => set({ plansEV: val }),
      setEvExtraKwh: (kwh) => set({ evExtraKwh: kwh }),
      setPlansHeatPump: (val) => set({ plansHeatPump: val }),
      setHeatPumpExtraKwh: (kwh) => set({ heatPumpExtraKwh: kwh }),
      setOtherExtraKwh: (kwh) => set({ otherExtraKwh: kwh }),
      setSelectedPanelId: (id) => set({ selectedPanelId: id }),
      setSelectedPvVariant: (tier) => set({ selectedPvVariant: tier }),
      setPvCalculatedKwp: (kwp) => set({ pvCalculatedKwp: kwp }),
      setPvCalculatedPanelCount: (count) => set({ pvCalculatedPanelCount: count }),
      setPvCalculatedBatteryKwh: (kwh) => set({ pvCalculatedBatteryKwh: kwh }),
      setPvPrice: (price) => set({ pvPrice: price }),
      reset: () => set(initialState),
    }),
    {
      name: 'nexbe-configurator',
      version: 4,
      migrate: (persistedState, version) => {
        if (version < 4) {
          return {
            ...initialState,
            ...(persistedState as Partial<ConfiguratorState>),
            selectedPanelId: 'keno-455',
          };
        }
        return persistedState as ConfiguratorState;
      },
    }
  )
);

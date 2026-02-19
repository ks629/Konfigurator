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
      reset: () => set(initialState),
    }),
    {
      name: 'nexbe-configurator',
      version: 2,
      migrate: (persistedState, version) => {
        if (version < 2) {
          // Merge nowych domyślnych pól ze starym stanem
          return {
            ...initialState,
            ...(persistedState as Partial<ConfiguratorState>),
          };
        }
        return persistedState as ConfiguratorState;
      },
    }
  )
);

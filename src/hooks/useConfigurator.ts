import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ConfiguratorState,
  InstallationType,
  BillingSystem,
  Tariff,
  BackupPreference,
  Priority,
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
  setPriorities: (priorities: Priority[]) => void;
  togglePriority: (priority: Priority) => void;
  setSelectedProductId: (id: string | null) => void;
  setSelectedInverterId: (id: string | null) => void;
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
  priorities: [],
  selectedProductId: null,
  selectedInverterId: null,
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
      setPriorities: (priorities) => set({ priorities }),
      togglePriority: (priority) =>
        set((state) => ({
          priorities: state.priorities.includes(priority)
            ? state.priorities.filter((p) => p !== priority)
            : [...state.priorities, priority],
        })),
      setSelectedProductId: (id) => set({ selectedProductId: id }),
      setSelectedInverterId: (id) => set({ selectedInverterId: id }),
      reset: () => set(initialState),
    }),
    {
      name: 'nexbe-configurator',
    }
  )
);

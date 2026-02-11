'use client';

import { motion } from 'framer-motion';
import { useConfigurator } from '@/hooks/useConfigurator';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tariff, BillingSystem } from '@/lib/types';
import { calculateMonthlyFromBill } from '@/lib/calculations';
import { cn } from '@/lib/utils';

const tariffOptions: { value: Tariff; label: string; desc: string }[] = [
  { value: 'G11', label: 'G11', desc: 'Calodobowa jednakowa cena' },
  { value: 'G12', label: 'G12', desc: 'Dwustrefowa dzien/noc' },
  { value: 'G12w', label: 'G12w', desc: 'Dwustrefowa weekendowa' },
  { value: 'G13', label: 'G13', desc: 'Trzystrefowa' },
  { value: 'unknown', label: 'Nie wiem', desc: '' },
];

const billingOptions: { value: BillingSystem; label: string; desc: string }[] = [
  {
    value: 'net-billing',
    label: 'Net-billing',
    desc: 'Rozliczenie wartosciowe - od 04.2022',
  },
  {
    value: 'net-metering',
    label: 'Net-metering',
    desc: 'Rozliczenie ilosciowe 1:0.8 - do 03.2022',
  },
  {
    value: 'unknown',
    label: 'Nie wiem / Sprawdze',
    desc: '',
  },
];

export function StepConsumption() {
  const {
    consumptionMode,
    setConsumptionMode,
    annualConsumptionKwh,
    setAnnualConsumptionKwh,
    monthlyBill,
    setMonthlyBill,
    tariff,
    setTariff,
    billingSystem,
    setBillingSystem,
  } = useConfigurator();

  const effectiveConsumption =
    consumptionMode === 'bill'
      ? calculateMonthlyFromBill(monthlyBill)
      : annualConsumptionKwh;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 max-w-2xl mx-auto"
    >
      <div className="text-center space-y-2">
        <h2 className="font-heading text-2xl md:text-3xl">
          Zuzycie energii
        </h2>
        <p className="text-muted-foreground">
          Podaj informacje o swoim zuzuciu energii elektrycznej
        </p>
      </div>

      {/* Toggle: kWh vs rachunek */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Jak chcesz podac zuzycie?</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setConsumptionMode('kwh')}
            className={cn(
              'p-3 rounded-lg border-2 text-sm font-medium transition-all',
              consumptionMode === 'kwh'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border hover:border-primary/30'
            )}
          >
            Znam roczne zuzycie w kWh
          </button>
          <button
            onClick={() => setConsumptionMode('bill')}
            className={cn(
              'p-3 rounded-lg border-2 text-sm font-medium transition-all',
              consumptionMode === 'bill'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border hover:border-primary/30'
            )}
          >
            Podam miesieczny rachunek za prad
          </button>
        </div>
      </div>

      {/* kWh slider or bill input */}
      {consumptionMode === 'kwh' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Roczne zuzycie energii</Label>
            <span className="text-2xl font-heading text-primary">
              {annualConsumptionKwh.toLocaleString('pl-PL')} kWh
            </span>
          </div>
          <Slider
            value={[annualConsumptionKwh]}
            onValueChange={([val]) => setAnnualConsumptionKwh(val)}
            min={2000}
            max={15000}
            step={100}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>2 000 kWh</span>
            <span>15 000 kWh</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Miesieczny rachunek za prad</Label>
            <span className="text-lg font-heading text-primary">
              ≈ {effectiveConsumption.toLocaleString('pl-PL')} kWh/rok
            </span>
          </div>
          <div className="relative">
            <Input
              type="number"
              value={monthlyBill}
              onChange={(e) => setMonthlyBill(Number(e.target.value))}
              className="h-12 text-lg pr-12"
              min={50}
              max={2000}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              zl
            </span>
          </div>
        </div>
      )}

      {/* Taryfa */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Obecna taryfa</Label>
        <Select value={tariff} onValueChange={(val) => setTariff(val as Tariff)}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Wybierz taryfe" />
          </SelectTrigger>
          <SelectContent>
            {tariffOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                <span className="font-medium">{opt.label}</span>
                {opt.desc && (
                  <span className="text-muted-foreground ml-2">- {opt.desc}</span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* System rozliczen */}
      <div className="space-y-3">
        <Label className="text-base font-medium">System rozliczen z zakladem energetycznym</Label>
        <RadioGroup
          value={billingSystem}
          onValueChange={(val) => setBillingSystem(val as BillingSystem)}
          className="space-y-2"
        >
          {billingOptions.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                'flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
                billingSystem === opt.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30'
              )}
            >
              <RadioGroupItem value={opt.value} />
              <div>
                <span className="font-medium">{opt.label}</span>
                {opt.desc && (
                  <p className="text-sm text-muted-foreground">{opt.desc}</p>
                )}
              </div>
            </label>
          ))}
        </RadioGroup>
      </div>
    </motion.div>
  );
}

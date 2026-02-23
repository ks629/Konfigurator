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
import { Checkbox } from '@/components/ui/checkbox';
import { Tariff, EnergyOperator } from '@/lib/types';
import { calculateMonthlyFromBill } from '@/lib/calculations';
import { operatorPricing } from '@/data/energy-prices';
import { cn } from '@/lib/utils';
import { NexbeIcon } from '@nexbe/icons';
import { Car, Flame, Plug } from 'lucide-react';

const tariffOptions: { value: Tariff; label: string; desc: string }[] = [
  { value: 'G11', label: 'G11', desc: 'Calodobowa jednakowa cena' },
  { value: 'G12', label: 'G12', desc: 'Dwustrefowa dzien/noc' },
  { value: 'G12w', label: 'G12w', desc: 'Dwustrefowa weekendowa' },
  { value: 'G13', label: 'G13', desc: 'Trzystrefowa' },
  { value: 'dynamic', label: 'Taryfa dynamiczna', desc: 'Cena zmienia sie co godzine wg rynku' },
  { value: 'unknown', label: 'Nie wiem', desc: '' },
];

export function StepPVConsumption() {
  const {
    consumptionMode,
    setConsumptionMode,
    annualConsumptionKwh,
    setAnnualConsumptionKwh,
    monthlyBill,
    setMonthlyBill,
    tariff,
    setTariff,
    energyOperator,
    setEnergyOperator,
    plansEV,
    setPlansEV,
    evExtraKwh,
    setEvExtraKwh,
    plansHeatPump,
    setPlansHeatPump,
    heatPumpExtraKwh,
    setHeatPumpExtraKwh,
    otherExtraKwh,
    setOtherExtraKwh,
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
        <h2 className="font-heading text-2xl md:text-3xl text-white">
          Twoje zużycie energii
        </h2>
        <p className="text-muted-foreground">
          Na tej podstawie dobierzemy optymalną moc instalacji PV i magazynu
        </p>
      </div>

      {/* Sekcja A: Zuzycie */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Jak chcesz podać zużycie?</Label>
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
            Znam roczne zużycie w kWh
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
            Podam miesięczny rachunek za prąd
          </button>
        </div>
      </div>

      {consumptionMode === 'kwh' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Roczne zużycie energii</Label>
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
            <Label className="text-base font-medium">Miesięczny rachunek za prąd</Label>
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

      {/* Sekcja B: Taryfa */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Operator energii</Label>
        <Select
          value={energyOperator}
          onValueChange={(val) => setEnergyOperator(val as EnergyOperator)}
        >
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Wybierz operatora" />
          </SelectTrigger>
          <SelectContent>
            {operatorPricing.map((op) => (
              <SelectItem key={op.operator} value={op.operator}>
                {op.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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

      {/* Sekcja C: Planowana elektryfikacja */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Planowana elektryfikacja</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Przewidzimy przyszłe potrzeby — większa instalacja lepiej się amortyzuje
          </p>
        </div>

        <div className="space-y-3">
          {/* EV */}
          <div className={cn(
            'rounded-lg border-2 p-4 transition-all',
            plansEV ? 'border-primary bg-primary/5' : 'border-border'
          )}>
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={plansEV}
                onCheckedChange={(checked) => setPlansEV(checked === true)}
              />
              <Car className={cn('h-5 w-5', plansEV ? 'text-primary' : 'text-muted-foreground')} />
              <div>
                <span className="font-medium text-sm">Auto elektryczne (EV)</span>
                <p className="text-xs text-muted-foreground">+{evExtraKwh.toLocaleString('pl-PL')} kWh/rok</p>
              </div>
            </label>
            {plansEV && (
              <div className="mt-3 pl-10">
                <Slider
                  value={[evExtraKwh]}
                  onValueChange={([val]) => setEvExtraKwh(val)}
                  min={2000}
                  max={6000}
                  step={500}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>2 000 kWh</span>
                  <span>6 000 kWh</span>
                </div>
              </div>
            )}
          </div>

          {/* Pompa ciepla */}
          <div className={cn(
            'rounded-lg border-2 p-4 transition-all',
            plansHeatPump ? 'border-primary bg-primary/5' : 'border-border'
          )}>
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={plansHeatPump}
                onCheckedChange={(checked) => setPlansHeatPump(checked === true)}
              />
              <Flame className={cn('h-5 w-5', plansHeatPump ? 'text-primary' : 'text-muted-foreground')} />
              <div>
                <span className="font-medium text-sm">Pompa ciepła (ogrzewanie)</span>
                <p className="text-xs text-muted-foreground">+{heatPumpExtraKwh.toLocaleString('pl-PL')} kWh/rok</p>
              </div>
            </label>
            {plansHeatPump && (
              <div className="mt-3 pl-10">
                <Slider
                  value={[heatPumpExtraKwh]}
                  onValueChange={([val]) => setHeatPumpExtraKwh(val)}
                  min={3000}
                  max={9000}
                  step={500}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>3 000 kWh</span>
                  <span>9 000 kWh</span>
                </div>
              </div>
            )}
          </div>

          {/* Inne */}
          <div className={cn(
            'rounded-lg border-2 p-4 transition-all',
            otherExtraKwh > 0 ? 'border-primary bg-primary/5' : 'border-border'
          )}>
            <label className="flex items-center gap-3 cursor-pointer">
              <Plug className={cn('h-5 w-5', otherExtraKwh > 0 ? 'text-primary' : 'text-muted-foreground')} />
              <div className="flex-1">
                <span className="font-medium text-sm">Inne (klimatyzacja, basen, sauna...)</span>
                <div className="mt-2">
                  <Input
                    type="number"
                    placeholder="0"
                    value={otherExtraKwh || ''}
                    onChange={(e) => setOtherExtraKwh(Number(e.target.value) || 0)}
                    className="h-9 w-32"
                    min={0}
                    max={10000}
                  />
                  <span className="text-xs text-muted-foreground ml-2">kWh/rok</span>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Podsumowanie zapotrzebowania */}
        <div className="bg-primary/10 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">Łączne roczne zapotrzebowanie</span>
            <span className="text-xl font-heading text-primary">
              {(effectiveConsumption
                + (plansEV ? evExtraKwh : 0)
                + (plansHeatPump ? heatPumpExtraKwh : 0)
                + otherExtraKwh
              ).toLocaleString('pl-PL')} kWh
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

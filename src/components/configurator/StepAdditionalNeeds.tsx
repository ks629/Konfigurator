'use client';

import { motion } from 'framer-motion';
import { useConfigurator } from '@/hooks/useConfigurator';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BackupPreference, Priority, TaxBracket } from '@/lib/types';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { NexbeIcon } from '@nexbe/icons';
import {
  Leaf,
  Info,
} from 'lucide-react';

const priorityOptions: { value: Priority; label: string; renderIcon: (cls: string) => React.ReactNode }[] = [
  { value: 'savings', label: 'Maksymalne oszczędności na rachunkach', renderIcon: (cls) => <NexbeIcon name="oszczednosci" size={16} variant="inherit" className={cls} aria-label="Oszczędności" /> },
  { value: 'independence', label: 'Niezależność energetyczna', renderIcon: (cls) => <NexbeIcon name="smart-ems" size={16} variant="inherit" className={cls} /> },
  { value: 'blackout', label: 'Ochrona przed blackoutem', renderIcon: (cls) => <NexbeIcon name="blackout-ochrona" size={16} variant="inherit" className={cls} /> },
  { value: 'ecology', label: 'Ekologia i slad weglowy', renderIcon: (cls) => <Leaf className={cls} /> },
  { value: 'subsidy', label: 'Wykorzystanie dotacji', renderIcon: (cls) => <NexbeIcon name="dotacja" size={16} variant="inherit" className={cls} aria-label="Dotacja" /> },
];

export function StepAdditionalNeeds() {
  const {
    hasHeatPump,
    setHasHeatPump,
    hasEV,
    setHasEV,
    backupPreference,
    setBackupPreference,
    priorities,
    togglePriority,
    wantsSubsidy,
    setWantsSubsidy,
    taxBracket,
    setTaxBracket,
    thermomodernizationUsedPercent,
    setThermomodernizationUsedPercent,
  } = useConfigurator();

  const thermomodernizationRemaining = Math.round(53000 * (1 - thermomodernizationUsedPercent / 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 max-w-2xl mx-auto"
    >
      <div className="text-center space-y-2">
        <h2 className="font-heading text-2xl md:text-3xl text-white">
          Dodatkowe potrzeby
        </h2>
        <p className="text-muted-foreground">
          Powiedz nam więcej o swoich potrzebach energetycznych
        </p>
      </div>

      {/* Pompa ciepla */}
      <div className="space-y-3">
        <div
          className={cn(
            'flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all',
            hasHeatPump ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
          )}
          onClick={() => setHasHeatPump(!hasHeatPump)}
        >
          <div className={cn(
            'p-3 rounded-lg shrink-0',
            hasHeatPump ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          )}>
            <NexbeIcon name="pompa-ciepla" size={24} variant="inherit" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <Checkbox checked={hasHeatPump} onCheckedChange={setHasHeatPump} />
              <Label className="text-base font-medium cursor-pointer">
                Mam pompe ciepla
              </Label>
            </div>
            <p className="text-sm text-muted-foreground mt-1 ml-9">
              Pompa ciepła znacząco zwiększa zużycie energii, szczególnie zimą
            </p>
          </div>
        </div>
      </div>

      {/* Auto elektryczne */}
      <div className="space-y-3">
        <div
          className={cn(
            'flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all',
            hasEV ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
          )}
          onClick={() => setHasEV(!hasEV)}
        >
          <div className={cn(
            'p-3 rounded-lg shrink-0',
            hasEV ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          )}>
            <NexbeIcon name="auto-elektryczne" size={24} variant="inherit" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <Checkbox checked={hasEV} onCheckedChange={setHasEV} />
              <Label className="text-base font-medium cursor-pointer">
                Mam lub planuje auto elektryczne
              </Label>
            </div>
            <p className="text-sm text-muted-foreground mt-1 ml-9">
              Ladowanie EV w domu to dodatkowe 2000-4000 kWh rocznie
            </p>
          </div>
        </div>
      </div>

      {/* Backup */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <NexbeIcon name="blackout-ochrona" size={20} variant="inherit" className="text-primary" />
          <Label className="text-base font-medium">
            Czy potrzebujesz zasilania awaryjnego (backup)?
          </Label>
        </div>
        <RadioGroup
          value={backupPreference}
          onValueChange={(val) => setBackupPreference(val as BackupPreference)}
          className="space-y-2"
        >
          {[
            { value: 'yes', label: 'Tak, to dla mnie wazne' },
            { value: 'no', label: 'Nie, nie potrzebuje' },
            { value: 'unknown', label: 'Nie wiem, chcę się dowiedzieć więcej' },
          ].map((opt) => (
            <label
              key={opt.value}
              className={cn(
                'flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
                backupPreference === opt.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30'
              )}
            >
              <RadioGroupItem value={opt.value} />
              <span className="font-medium">{opt.label}</span>
            </label>
          ))}
        </RadioGroup>
        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-sm">
          <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <span className="text-muted-foreground">
            Backup pozwala zasilać wybrane urządzenia podczas awarii sieci
          </span>
        </div>
      </div>

      {/* Priorytety */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          Co jest dla Ciebie najwazniejsze?{' '}
          <span className="text-muted-foreground font-normal">(opcjonalnie)</span>
        </Label>
        <div className="grid gap-2">
          {priorityOptions.map(({ value, label, renderIcon }) => (
            <div
              key={value}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all',
                priorities.includes(value)
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30'
              )}
              onClick={() => togglePriority(value)}
            >
              <Checkbox
                checked={priorities.includes(value)}
                onCheckedChange={() => togglePriority(value)}
              />
              {renderIcon(cn(
                'h-4 w-4',
                priorities.includes(value) ? 'text-primary' : 'text-muted-foreground'
              ))}
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dotacje i ulgi */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <NexbeIcon name="dotacja" size={20} variant="inherit" className="text-primary" aria-label="Dotacje i ulgi" />
          <Label className="text-base font-medium">Dotacje i ulgi</Label>
        </div>

        {/* Dotacja Mój Prąd 7.0 */}
        <div
          className={cn(
            'flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
            wantsSubsidy ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
          )}
          onClick={() => setWantsSubsidy(!wantsSubsidy)}
        >
          <Checkbox
            checked={wantsSubsidy}
            onCheckedChange={(val) => setWantsSubsidy(val as boolean)}
          />
          <span className="text-sm font-medium">
            Chcę skorzystać z dotacji Mój Prąd 7.0
          </span>
        </div>

        {/* Próg podatkowy */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Próg podatkowy</Label>
          <RadioGroup
            value={taxBracket.toString()}
            onValueChange={(val) => setTaxBracket(parseInt(val) as TaxBracket)}
            className="grid grid-cols-3 gap-2"
          >
            {[
              { value: '12', label: '12% (I próg)' },
              { value: '19', label: '19% (liniowy)' },
              { value: '32', label: '32% (II próg)' },
            ].map((opt) => (
              <label
                key={opt.value}
                className={cn(
                  'flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
                  taxBracket.toString() === opt.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30'
                )}
              >
                <RadioGroupItem value={opt.value} />
                <span className="text-sm font-medium">{opt.label}</span>
              </label>
            ))}
          </RadioGroup>
        </div>

        {/* Wykorzystana ulga termomodernizacyjna */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">
              Wykorzystana ulga termomodernizacyjna
            </Label>
            <span className="text-sm font-heading text-primary">
              {thermomodernizationUsedPercent}% z 53 000 zł (pozostało: {thermomodernizationRemaining.toLocaleString('pl-PL')} zł)
            </span>
          </div>
          <Slider
            value={[thermomodernizationUsedPercent]}
            onValueChange={([val]) => setThermomodernizationUsedPercent(val)}
            min={0}
            max={100}
            step={1}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { useConfigurator } from '@/hooks/useConfigurator';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BackupPreference, Priority } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Thermometer,
  Car,
  Shield,
  Wallet,
  Zap,
  ShieldCheck,
  Leaf,
  Gift,
  Info,
} from 'lucide-react';

const priorityOptions: { value: Priority; label: string; icon: React.ElementType }[] = [
  { value: 'savings', label: 'Maksymalne oszczednosci na rachunkach', icon: Wallet },
  { value: 'independence', label: 'Niezaleznosc energetyczna', icon: Zap },
  { value: 'blackout', label: 'Ochrona przed blackoutem', icon: ShieldCheck },
  { value: 'ecology', label: 'Ekologia i slad weglowy', icon: Leaf },
  { value: 'subsidy', label: 'Wykorzystanie dotacji', icon: Gift },
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
  } = useConfigurator();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 max-w-2xl mx-auto"
    >
      <div className="text-center space-y-2">
        <h2 className="font-heading text-2xl md:text-3xl">
          Dodatkowe potrzeby
        </h2>
        <p className="text-muted-foreground">
          Powiedz nam wiecej o swoich potrzebach energetycznych
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
            <Thermometer className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <Checkbox checked={hasHeatPump} onCheckedChange={setHasHeatPump} />
              <Label className="text-base font-medium cursor-pointer">
                Mam pompe ciepla
              </Label>
            </div>
            <p className="text-sm text-muted-foreground mt-1 ml-9">
              Pompa ciepla znaczaco zwieksza zuzycie energii, szczegolnie zima
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
            <Car className="h-6 w-6" />
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
          <Shield className="h-5 w-5 text-primary" />
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
            { value: 'unknown', label: 'Nie wiem, chce sie dowiedziec wiecej' },
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
            Backup pozwala zasilac wybrane urzadzenia podczas awarii sieci
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
          {priorityOptions.map(({ value, label, icon: Icon }) => (
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
              <Icon className={cn(
                'h-4 w-4',
                priorities.includes(value) ? 'text-primary' : 'text-muted-foreground'
              )} />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

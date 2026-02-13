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
import { inverterBrands } from '@/data/products';
import { Info, Sun, ArrowLeftRight, Sunrise, Sunset } from 'lucide-react';
import { PVOrientation } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

const pvOrientationOptions: { value: PVOrientation; label: string; icon: React.ElementType }[] = [
  { value: 'south', label: 'Południe', icon: Sun },
  { value: 'east_west', label: 'Wschód + Zachód', icon: ArrowLeftRight },
  { value: 'east', label: 'Wschód', icon: Sunrise },
  { value: 'west', label: 'Zachód', icon: Sunset },
];

export function StepPVData() {
  const {
    pvPowerKwp,
    setPvPowerKwp,
    inverterBrand,
    setInverterBrand,
    inverterModel,
    setInverterModel,
    installationYear,
    setInstallationYear,
    pvOrientation,
    setPvOrientation,
  } = useConfigurator();

  const years = Array.from({ length: 8 }, (_, i) => 2018 + i);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 max-w-2xl mx-auto"
    >
      <div className="text-center space-y-2">
        <h2 className="font-heading text-2xl md:text-3xl text-white">
          Dane Twojej instalacji PV
        </h2>
        <p className="text-muted-foreground">
          Podaj parametry swojej instalacji fotowoltaicznej
        </p>
      </div>

      {/* Moc PV */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Moc instalacji PV</Label>
          <span className="text-2xl font-heading text-primary">
            {pvPowerKwp.toFixed(1)} kWp
          </span>
        </div>
        <Slider
          value={[pvPowerKwp]}
          onValueChange={([val]) => setPvPowerKwp(val)}
          min={3}
          max={15}
          step={0.5}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>3 kWp</span>
          <span>15 kWp</span>
        </div>
        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-sm">
          <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <span className="text-muted-foreground">
            Nie wiesz? Sprawdź na fakturze od instalatora lub w aplikacji falownika
          </span>
        </div>
      </div>

      {/* Orientacja paneli PV */}
      <div className="space-y-3">
        <div>
          <Label className="text-base font-medium">Orientacja paneli PV</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Orientacja wpływa na profil produkcji energii w ciągu dnia
          </p>
        </div>
        <RadioGroup
          value={pvOrientation}
          onValueChange={(val) => setPvOrientation(val as PVOrientation)}
          className="grid grid-cols-2 gap-2"
        >
          {pvOrientationOptions.map(({ value, label, icon: Icon }) => (
            <label
              key={value}
              className={cn(
                'flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
                pvOrientation === value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30'
              )}
            >
              <RadioGroupItem value={value} />
              <Icon className={cn(
                'h-4 w-4',
                pvOrientation === value ? 'text-primary' : 'text-muted-foreground'
              )} />
              <span className="text-sm font-medium">{label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Marka falownika */}
      <div className="space-y-2">
        <Label className="text-base font-medium">Marka falownika</Label>
        <Select value={inverterBrand} onValueChange={setInverterBrand}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Wybierz markę falownika" />
          </SelectTrigger>
          <SelectContent>
            {inverterBrands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Model falownika */}
      <div className="space-y-2">
        <Label className="text-base font-medium">
          Model falownika{' '}
          <span className="text-muted-foreground font-normal">(opcjonalnie)</span>
        </Label>
        <Input
          placeholder="np. SUN2000-6KTL-M1"
          value={inverterModel}
          onChange={(e) => setInverterModel(e.target.value)}
          className="h-12"
        />
      </div>

      {/* Rok instalacji */}
      <div className="space-y-2">
        <Label className="text-base font-medium">Rok instalacji PV</Label>
        <Select
          value={installationYear.toString()}
          onValueChange={(val) => setInstallationYear(parseInt(val))}
        >
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Wybierz rok" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
}

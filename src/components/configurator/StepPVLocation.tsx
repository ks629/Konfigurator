'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useConfigurator } from '@/hooks/useConfigurator';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PVMountType, PVAzimuthPreset } from '@/lib/types';
import { getOrientationMultiplier, azimuthMultipliers } from '@/data/pv-orientation';
import { maxPanelsOnRoof, PV_PANEL } from '@/data/pv-panels';
import { cn } from '@/lib/utils';
import { NexbeIcon } from '@nexbe/icons';
import { AlertTriangle } from 'lucide-react';

const mountOptions: { value: PVMountType; label: string; description: string }[] = [
  { value: 'roof_angled', label: 'Dach skośny', description: 'Standardowy montaż na skośnym dachu' },
  { value: 'roof_flat', label: 'Dach płaski', description: 'Konstrukcja z kątem nachylenia' },
  { value: 'ground', label: 'Grunt', description: 'Konstrukcja naziemna na działce' },
];

const compassGrid: { preset: PVAzimuthPreset; label: string; row: number; col: number }[] = [
  { preset: 'NW', label: 'NW', row: 0, col: 0 },
  { preset: 'N', label: 'N', row: 0, col: 1 },
  { preset: 'NE', label: 'NE', row: 0, col: 2 },
  { preset: 'W', label: 'W', row: 1, col: 0 },
  { preset: 'EW', label: 'E+W', row: 1, col: 1 },
  { preset: 'E', label: 'E', row: 1, col: 2 },
  { preset: 'SW', label: 'SW', row: 2, col: 0 },
  { preset: 'S', label: 'S', row: 2, col: 1 },
  { preset: 'SE', label: 'SE', row: 2, col: 2 },
];

export function StepPVLocation() {
  const {
    pvMountType,
    setPvMountType,
    pvAzimuthPreset,
    setPvAzimuthPreset,
    pvTiltAngle,
    setPvTiltAngle,
    roofWidth,
    setRoofWidth,
    roofLength,
    setRoofLength,
  } = useConfigurator();

  const orientationMultiplier = useMemo(
    () => getOrientationMultiplier(pvAzimuthPreset, pvTiltAngle),
    [pvAzimuthPreset, pvTiltAngle]
  );

  const maxPanels = useMemo(() => {
    if (pvMountType === 'ground') return null;
    return maxPanelsOnRoof(roofWidth, roofLength);
  }, [pvMountType, roofWidth, roofLength]);

  const isOptimalAngle = pvTiltAngle >= 30 && pvTiltAngle <= 40;
  const isWeakOrientation = ['N', 'NE', 'NW'].includes(pvAzimuthPreset);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 max-w-2xl mx-auto"
    >
      <div className="text-center space-y-2">
        <h2 className="font-heading text-2xl md:text-3xl text-white">
          Lokalizacja paneli
        </h2>
        <p className="text-muted-foreground">
          Orientacja i nachylenie wpływają na roczną produkcję energii
        </p>
      </div>

      {/* Sekcja A: Typ montazu */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Typ montażu</Label>
        <div className="grid grid-cols-3 gap-3">
          {mountOptions.map(({ value, label, description }) => (
            <button
              key={value}
              onClick={() => setPvMountType(value)}
              className={cn(
                'flex flex-col items-center text-center p-4 rounded-xl border-2 transition-all hover:border-primary/50',
                pvMountType === value
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card'
              )}
            >
              <NexbeIcon
                name={value === 'ground' ? 'fotowoltaika' : 'dom-energia'}
                size={24}
                variant="inherit"
                className={cn('mb-2', pvMountType === value ? 'text-primary' : 'text-muted-foreground')}
              />
              <span className="text-sm font-medium">{label}</span>
              <span className="text-xs text-muted-foreground mt-1">{description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sekcja B: Kompas orientacji */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Orientacja paneli</Label>
          <span className={cn(
            'text-sm font-heading',
            orientationMultiplier >= 0.9 ? 'text-green-400' :
            orientationMultiplier >= 0.7 ? 'text-amber-400' : 'text-red-400'
          )}>
            {Math.round(orientationMultiplier * 100)}% uzysku
          </span>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-3 gap-2 w-fit">
            {compassGrid.map(({ preset, label }) => {
              const mul = azimuthMultipliers[preset];
              const isSelected = pvAzimuthPreset === preset;
              return (
                <button
                  key={preset}
                  onClick={() => setPvAzimuthPreset(preset)}
                  className={cn(
                    'relative w-20 h-20 rounded-lg border-2 flex flex-col items-center justify-center transition-all hover:border-primary/50',
                    isSelected
                      ? 'border-primary bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg shadow-primary/10'
                      : 'border-border bg-card',
                    mul >= 0.9 && !isSelected && 'hover:bg-green-500/5',
                    mul < 0.7 && !isSelected && 'hover:bg-red-500/5',
                  )}
                >
                  <span className={cn(
                    'text-sm font-heading',
                    isSelected ? 'text-primary' : 'text-white'
                  )}>
                    {label}
                  </span>
                  <span className={cn(
                    'text-xs',
                    mul >= 0.9 ? 'text-green-400' :
                    mul >= 0.7 ? 'text-amber-400' : 'text-red-400'
                  )}>
                    {Math.round(mul * 100)}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {isWeakOrientation && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-400/10 border border-amber-400/20">
            <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-300">
              Orientacja {pvAzimuthPreset} daje niski uzysk ({Math.round(orientationMultiplier * 100)}%). Rozważ montaż na gruncie lub innym dachu.
            </p>
          </div>
        )}
      </div>

      {/* Sekcja C: Kat nachylenia */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Kąt nachylenia</Label>
          <span className="text-lg font-heading text-primary">{pvTiltAngle}°</span>
        </div>
        <Slider
          value={[pvTiltAngle]}
          onValueChange={([val]) => setPvTiltAngle(val)}
          min={0}
          max={60}
          step={5}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0° (płaski)</span>
          <span className={cn(isOptimalAngle && 'text-green-400 font-medium')}>
            {isOptimalAngle ? '30-40° optymalny' : '35° optymalny'}
          </span>
          <span>60° (stromy)</span>
        </div>
      </div>

      {/* Sekcja D: Wymiary dachu */}
      {pvMountType !== 'ground' && (
        <div className="space-y-4">
          <Label className="text-base font-medium">Wymiary dostępnej powierzchni dachu</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Szerokość (m)</Label>
              <Input
                type="number"
                value={roofWidth}
                onChange={(e) => setRoofWidth(Number(e.target.value) || 0)}
                className="h-12 text-lg"
                min={2}
                max={30}
                step={0.5}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Długość (m)</Label>
              <Input
                type="number"
                value={roofLength}
                onChange={(e) => setRoofLength(Number(e.target.value) || 0)}
                className="h-12 text-lg"
                min={2}
                max={30}
                step={0.5}
              />
            </div>
          </div>

          {maxPanels !== null && (
            <div className="bg-muted/30 rounded-lg p-4 space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Maks. paneli na dachu</span>
                <span className="font-heading text-white">{maxPanels} szt.</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Maks. moc</span>
                <span className="font-heading text-white">
                  {((maxPanels * PV_PANEL.wattPeak) / 1000).toFixed(1)} kWp
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

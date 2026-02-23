'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useConfigurator } from '@/hooks/useConfigurator';
import { calculatePVSizing, generatePVVariants } from '@/lib/pv-calculator';
import { getOrientationMultiplier } from '@/data/pv-orientation';
import { calculateMonthlyFromBill, formatCurrency, calculateMonthlyRate } from '@/lib/calculations';
import { allProducts, inverters } from '@/data/products';
import { getBrandLogos } from '@/lib/brand-logos';
import { cn } from '@/lib/utils';
import { NexbeIcon } from '@nexbe/icons';
import { Calendar, Check, Crown, Shield, Zap, Sun, Battery } from 'lucide-react';
import type { PVVariant } from '@/lib/types';

export function StepPVSystemRecommendation() {
  const store = useConfigurator();

  const orientationMultiplier = useMemo(
    () => getOrientationMultiplier(store.pvAzimuthPreset, store.pvTiltAngle),
    [store.pvAzimuthPreset, store.pvTiltAngle]
  );

  const effectiveConsumption = useMemo(() =>
    store.consumptionMode === 'bill'
      ? calculateMonthlyFromBill(store.monthlyBill)
      : store.annualConsumptionKwh,
    [store.consumptionMode, store.monthlyBill, store.annualConsumptionKwh]
  );

  const sizing = useMemo(
    () => calculatePVSizing({
      annualConsumptionKwh: effectiveConsumption,
      orientationMultiplier,
      mountType: store.pvMountType,
      roofWidth: store.roofWidth,
      roofLength: store.roofLength,
      plansEV: store.plansEV,
      evExtraKwh: store.evExtraKwh,
      plansHeatPump: store.plansHeatPump,
      heatPumpExtraKwh: store.heatPumpExtraKwh,
      otherExtraKwh: store.otherExtraKwh,
    }),
    [effectiveConsumption, orientationMultiplier, store.pvMountType, store.roofWidth, store.roofLength, store.plansEV, store.evExtraKwh, store.plansHeatPump, store.heatPumpExtraKwh, store.otherExtraKwh]
  );

  const variants = useMemo(
    () => generatePVVariants(sizing, orientationMultiplier, store.pvMountType),
    [sizing, orientationMultiplier, store.pvMountType]
  );

  const handleSelect = (variant: PVVariant) => {
    store.setSelectedPvVariant(variant.tier);
    store.setSelectedProductId(variant.batteryProductId);
    store.setSelectedInverterId(variant.inverterId);
    store.setPvCalculatedKwp(variant.pvKwp);
    store.setPvCalculatedPanelCount(variant.panelCount);
    store.setPvCalculatedBatteryKwh(variant.batteryKwh);
    store.setPvPrice(variant.pvPrice);
    setTimeout(() => store.nextStep(), 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="font-heading text-2xl md:text-3xl text-white">
          Dobór systemu PV + magazyn
        </h2>
        <p className="text-muted-foreground">
          Roczne zapotrzebowanie: {sizing.totalDemandKwh.toLocaleString('pl-PL')} kWh
          {' · '}Rekomendowana moc: {sizing.requiredKwp} kWp
        </p>
      </div>

      {/* Roof size warning */}
      {sizing.maxRoofPanels !== null && sizing.panelCount > sizing.maxRoofPanels && (
        <div className="max-w-4xl mx-auto flex items-start gap-2 p-3 rounded-lg bg-amber-400/10 border border-amber-400/20">
          <NexbeIcon name="fotowoltaika" size={16} variant="inherit" className="text-amber-400 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-300">
            Potrzebujesz {sizing.panelCount} paneli, ale na dachu mieści się max {sizing.maxRoofPanels}. Rozważ montaż na gruncie lub wróć i zmień wymiary.
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3 max-w-5xl mx-auto">
        {variants.map((variant) => (
          <VariantCard
            key={variant.tier}
            variant={variant}
            isSelected={store.selectedPvVariant === variant.tier}
            onSelect={() => handleSelect(variant)}
          />
        ))}
      </div>
    </motion.div>
  );
}

function VariantCard({
  variant,
  isSelected,
  onSelect,
}: {
  variant: PVVariant;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const isRecommended = variant.tier === 'recommended';
  const isPremium = variant.tier === 'premium';
  const product = allProducts.find((p) => p.id === variant.batteryProductId);
  const inverter = inverters.find((i) => i.id === variant.inverterId);
  const monthlyRate = calculateMonthlyRate(variant.totalPrice);

  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ y: -6 }}
      className={cn(
        'relative flex flex-col text-left rounded-xl border-2 overflow-hidden transition-all cursor-pointer',
        isRecommended
          ? 'border-transparent bg-card shadow-xl'
          : 'border-border bg-card hover:border-primary/30',
        isSelected && 'ring-2 ring-primary shadow-lg shadow-primary/10',
      )}
      style={isRecommended ? {
        backgroundClip: 'padding-box',
        border: '2px solid transparent',
        backgroundImage: `linear-gradient(#1A0A2E, #1A0A2E), linear-gradient(135deg, #00d4ff, #00ff88)`,
        backgroundOrigin: 'border-box',
      } : undefined}
    >
      {/* Product image */}
      <div className={cn(
        'relative h-36 flex items-center justify-center overflow-hidden',
        isPremium
          ? 'bg-gradient-to-br from-amber-400/5 via-muted to-amber-400/5'
          : 'bg-gradient-to-br from-muted to-muted/50'
      )}>
        {product?.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-3"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <NexbeIcon name="magazyn-energii" size={60} variant="inherit" className="text-muted-foreground/30" />
        )}
        {product && (
          <div className="absolute bottom-2 left-2 z-10">
            <span className="flex items-center gap-1.5 bg-black/50 px-2 py-1 rounded">
              {getBrandLogos(product.brand).map((logo) => (
                <Image key={logo.alt} src={logo.src} alt={logo.alt} width={60} height={16} className="h-3.5 w-auto brightness-0 invert" />
              ))}
            </span>
          </div>
        )}
        {/* Segment badge */}
        {product?.segment && (
          <div className="absolute top-2 right-2 z-10">
            <span className={cn(
              'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full',
              product.segment === 'PREMIUM' || product.segment === 'PREMIUM RETROFIT'
                ? 'bg-amber-500/20 text-amber-400'
                : product.segment === 'BUDGET'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-white/10 text-muted-foreground'
            )}>
              {isPremium && <Crown className="h-2.5 w-2.5 inline mr-0.5 -mt-0.5" />}
              {product.segment}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 space-y-3">
        {/* Tier badge + product name */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className={cn(
              'text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full',
              variant.tier === 'economic' && 'bg-blue-500/10 text-blue-400',
              variant.tier === 'recommended' && 'bg-gradient-to-r from-cyan-500/20 to-green-500/20 text-green-400',
              variant.tier === 'premium' && 'bg-amber-500/10 text-amber-400',
            )}>
              {variant.label}
            </span>
            {isRecommended && (
              <span className="text-xs text-green-400 font-medium">Najlepszy wybór</span>
            )}
          </div>
          {product && (
            <h3 className="font-heading text-sm text-white">{product.name}</h3>
          )}
          {inverter && (
            <p className="text-xs text-muted-foreground">+ {inverter.name}</p>
          )}
        </div>

        {/* Specs grid 2×2 */}
        {product && (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1.5">
              <NexbeIcon name="magazyn-energii" size={14} variant="inherit" className="text-primary shrink-0" />
              <div>
                <p className="font-medium text-white text-xs">{product.capacity_kwh} kWh</p>
                <p className="text-[10px] text-muted-foreground">Pojemność</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <NexbeIcon name="smart-ems" size={14} variant="inherit" className="text-primary shrink-0" />
              <div>
                <p className="font-medium text-white text-xs">{product.power_continuous_kw}/{product.power_peak_kw} kW</p>
                <p className="text-[10px] text-muted-foreground">Ciągła / Szczyt</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <NexbeIcon name="falownik" size={14} variant="inherit" className="text-primary shrink-0" />
              <div>
                <p className="font-medium text-white text-xs">{variant.inverterKw} kW</p>
                <p className="text-[10px] text-muted-foreground">Falownik</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
              <div>
                <p className="font-medium text-white text-xs">{product.warranty_years} lat</p>
                <p className="text-[10px] text-muted-foreground">Gwarancja</p>
              </div>
            </div>
          </div>
        )}

        {/* EPS badge */}
        {product?.eps_capable && (
          <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-md w-fit">
            <Check className="h-3 w-3" />
            Zasilanie awaryjne (EPS)
          </div>
        )}

        {/* PV + features */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 text-sm">
            <Sun className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="text-white font-medium">{variant.pvKwp} kWp</span>
            <span className="text-muted-foreground">· {variant.panelCount} paneli</span>
          </div>

          <div className="border-t border-white/10 pt-2 space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <Check className="h-3.5 w-3.5 text-green-400" />
              <span className="text-muted-foreground">KENO EMS</span>
            </div>
            {variant.hasSZR && (
              <div className="flex items-center gap-2 text-xs">
                <Shield className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-muted-foreground">Backup SZR 3F</span>
              </div>
            )}
            {variant.mp7Eligible && (
              <div className="flex items-center gap-2 text-xs">
                <Check className="h-3.5 w-3.5 text-green-400" />
                <span className="text-muted-foreground">Mój Prąd 7.0</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <NexbeIcon name="roi" size={16} variant="inherit" className="text-primary" />
            <span className="text-muted-foreground">Autokonsumpcja:</span>
            <span className="text-white font-medium">{variant.selfConsumptionPercent}%</span>
          </div>
        </div>

        {/* Price + Monthly rate */}
        <div className="pt-3 border-t border-white/10 space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-muted-foreground">Cena z montażem</span>
            <span className={cn(
              'text-2xl font-heading',
              isPremium ? 'text-amber-400' : 'text-white'
            )}>
              {formatCurrency(variant.totalPrice)}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            PV: {formatCurrency(variant.pvPrice)} + magazyn: {formatCurrency(variant.batteryPrice)}
          </div>
          {monthlyRate > 0 && (
            <div className="flex items-center gap-1.5 text-sm">
              <NexbeIcon name="raty" size={14} variant="inherit" className="text-muted-foreground" />
              <span className="text-muted-foreground">Rata już od</span>
              <span className="font-heading text-primary">{monthlyRate} zł/mies.</span>
            </div>
          )}
        </div>
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <motion.div
          layoutId="pv-variant-selected"
          className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
        >
          <Check className="w-3.5 h-3.5 text-white" />
        </motion.div>
      )}
    </motion.button>
  );
}

'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useConfigurator } from '@/hooks/useConfigurator';
import { formatCurrency, calculateMonthlyRate } from '@/lib/calculations';
import { allProducts, inverters } from '@/data/products';
import { getPanelById } from '@/data/pv-panels';
import { getBrandLogos } from '@/lib/brand-logos';
import { cn } from '@/lib/utils';
import { NexbeIcon } from '@nexbe/icons';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Check, Shield, Sun, Battery, Zap } from 'lucide-react';

export function StepPVSummary() {
  const store = useConfigurator();

  const selectedProduct = useMemo(
    () => allProducts.find((p) => p.id === store.selectedProductId) || null,
    [store.selectedProductId]
  );

  const selectedInverter = useMemo(
    () => inverters.find((i) => i.id === store.selectedInverterId) || null,
    [store.selectedInverterId]
  );

  const selectedPanel = useMemo(
    () => getPanelById(store.selectedPanelId),
    [store.selectedPanelId]
  );

  const tierLabel = store.selectedPvVariant === 'economic' ? 'Ekonomiczny'
    : store.selectedPvVariant === 'recommended' ? 'Rekomendowany'
    : store.selectedPvVariant === 'premium' ? 'Premium'
    : '';

  const batteryPrice = selectedProduct
    ? (store.selectedPvVariant === 'premium' ? selectedProduct.price_gross_b : selectedProduct.price_gross)
    : 0;
  const totalPrice = store.pvPrice + batteryPrice;
  const monthlyRate = calculateMonthlyRate(totalPrice);

  // MP7 subsidy estimation
  const mp7Eligible = selectedProduct && selectedProduct.capacity_kwh >= 10;
  const mp7Subsidy = mp7Eligible ? Math.min(16000, totalPrice * 0.5) : 0;
  const priceAfterSubsidy = totalPrice - mp7Subsidy;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 max-w-3xl mx-auto"
    >
      <div className="text-center space-y-2">
        <h2 className="font-heading text-2xl md:text-3xl text-white">
          Twój system PV + magazyn
        </h2>
        <p className="text-muted-foreground">
          Wariant: {tierLabel}
        </p>
      </div>

      {/* System summary card */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <NexbeIcon name="fotowoltaika" size={20} variant="inherit" className="text-primary" />
          <h3 className="font-heading text-lg text-white">Skład zestawu</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {/* PV — z identyfikacją panelu */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium text-white">Instalacja PV</span>
            </div>
            <div className="flex items-start gap-3">
              {/* Panel thumbnail */}
              <div className="relative w-16 h-16 rounded bg-muted/50 shrink-0 flex items-center justify-center overflow-hidden">
                <Image
                  src={selectedPanel.image}
                  alt={selectedPanel.name}
                  fill
                  className="object-contain p-1"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white">
                  {store.pvCalculatedPanelCount}x {selectedPanel.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {getBrandLogos(selectedPanel.brand).map((logo) => (
                    <Image key={logo.alt} src={logo.src} alt={logo.alt} width={48} height={14} className="h-3 w-auto brightness-0 invert" />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 mt-1.5 text-[10px]">
                  <span className="text-muted-foreground">{store.pvCalculatedKwp} kWp</span>
                  <span className="text-muted-foreground">{selectedPanel.wattPeak}Wp/panel</span>
                  <span className="text-muted-foreground">{selectedPanel.efficiency_percent}% spr.</span>
                  <span className="text-muted-foreground">
                    <Calendar className="h-2.5 w-2.5 inline mr-0.5 -mt-px" />
                    {selectedPanel.warranty_linear_years} lat gwar.
                  </span>
                  {selectedPanel.bifacial && (
                    <span className="text-amber-400">Bifacial</span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-sm font-heading text-primary mt-1">
              {formatCurrency(store.pvPrice)}
            </p>
          </div>

          {/* Falownik */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-1">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-white">Falownik hybrydowy</span>
            </div>
            {selectedInverter && (
              <p className="text-xs text-muted-foreground font-medium">
                {selectedInverter.name}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {selectedInverter ? `${selectedInverter.power_kw} kW · ${selectedInverter.brand}` : 'Dopasowany do systemu'}
            </p>
          </div>

          {/* Magazyn */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Battery className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium text-white">Magazyn energii</span>
            </div>
            {selectedProduct && (
              <div className="flex items-start gap-3">
                {/* Product thumbnail */}
                <div className="relative w-16 h-16 rounded bg-muted/50 shrink-0 flex items-center justify-center overflow-hidden">
                  {selectedProduct.image ? (
                    <Image
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      fill
                      className="object-contain p-1"
                      sizes="64px"
                    />
                  ) : (
                    <NexbeIcon name="magazyn-energii" size={28} variant="inherit" className="text-muted-foreground/30" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{selectedProduct.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {getBrandLogos(selectedProduct.brand).map((logo) => (
                      <Image key={logo.alt} src={logo.src} alt={logo.alt} width={48} height={14} className="h-3 w-auto brightness-0 invert" />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 mt-1.5 text-[10px]">
                    <span className="text-muted-foreground">{selectedProduct.capacity_kwh} kWh</span>
                    <span className="text-muted-foreground">{selectedProduct.power_continuous_kw}/{selectedProduct.power_peak_kw} kW</span>
                    <span className="text-muted-foreground">
                      <Calendar className="h-2.5 w-2.5 inline mr-0.5 -mt-px" />
                      {selectedProduct.warranty_years} lat gwar.
                    </span>
                    {selectedProduct.eps_capable && (
                      <span className="text-green-400">EPS</span>
                    )}
                  </div>
                </div>
              </div>
            )}
            <p className="text-sm font-heading text-primary">
              {formatCurrency(batteryPrice)}
            </p>
          </div>

          {/* Dodatkowe */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <span className="text-sm font-medium text-white">W zestawie</span>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-green-400" />
                KENO EMS
              </div>
              {store.selectedPvVariant === 'premium' && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3.5 w-3.5 text-amber-400" />
                  Backup SZR 3F
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-green-400" />
                Mój Prąd 7.0
              </div>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="bg-primary/10 rounded-lg p-4 mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-heading text-lg text-primary">Cena kompleksowa z montażem</span>
            <span className="font-heading text-2xl text-primary">
              {formatCurrency(totalPrice)}
            </span>
          </div>
          {monthlyRate > 0 && (
            <div className="flex items-center gap-1.5 text-sm">
              <NexbeIcon name="raty" size={14} variant="inherit" className="text-primary/70" />
              <span className="text-primary/70">Rata już od</span>
              <span className="font-heading text-primary">{monthlyRate} zł/mies.</span>
            </div>
          )}
        </div>

        {/* MP7 subsidy */}
        {mp7Eligible && mp7Subsidy > 0 && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <NexbeIcon name="roi" size={16} variant="inherit" className="text-green-400" />
                <span className="text-sm font-medium text-green-400">Dotacja Mój Prąd 7.0</span>
              </div>
              <span className="font-heading text-lg text-green-400">
                -{formatCurrency(mp7Subsidy)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Szacowana cena po dotacji</span>
              <span className="font-heading text-white text-base">
                {formatCurrency(priceAfterSubsidy)}
              </span>
            </div>
          </div>
        )}

        {/* Change variant button */}
        <div className="text-center pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => store.setStep(4)}
            className="border-white/20 text-white hover:bg-white/5"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Zmień wariant
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConfigurator } from '@/hooks/useConfigurator';
import { productsAC, productsDC, inverters, getSetPrice } from '@/data/products';
import { formatCurrency } from '@/lib/calculations';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { NexbeIcon } from '@nexbe/icons';
import { Settings2, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Simple monthly installment calculator (Inbank: 8.99% nominal, 10 zl/month fee, 120 months) */
function calcLowestRate(priceGross: number): number {
  const nominalRate = 0.0899;
  const monthlyFee = 10;
  const months = 120;
  const monthlyRate = nominalRate / 12;
  if (priceGross <= 0) return 0;
  const annuity =
    (priceGross * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(annuity + monthlyFee);
}

export function CustomConfigSection() {
  const {
    installationType,
    backupVariant,
    selectedProductId,
    setSelectedProductId,
    setSelectedInverterId,
  } = useConfigurator();

  const [customOpen, setCustomOpen] = useState(false);
  const [customBatteryId, setCustomBatteryId] = useState<string | null>(null);
  const [customInverterId, setCustomInverterId] = useState<string | null>(null);

  if (!installationType) return null;

  const availableProducts = installationType === 'retrofit' ? productsAC : productsDC;

  const productsByBrand = useMemo(() => {
    const groups: Record<string, typeof availableProducts> = {};
    for (const p of availableProducts) {
      if (!groups[p.brand]) groups[p.brand] = [];
      groups[p.brand].push(p);
    }
    return groups;
  }, [availableProducts]);

  const compatibleInverters = useMemo(() => {
    if (!customBatteryId) return [];
    const product = availableProducts.find((p) => p.id === customBatteryId);
    if (!product?.compatible_inverters) return [];
    return inverters.filter((inv) => product.compatible_inverters!.includes(inv.id));
  }, [customBatteryId, availableProducts]);

  const customProduct = customBatteryId
    ? availableProducts.find((p) => p.id === customBatteryId) || null
    : null;
  const customInverter = customInverterId
    ? inverters.find((i) => i.id === customInverterId) || null
    : null;

  const totalPrice = customProduct && customInverter
    ? getSetPrice(customProduct, customInverter.id, backupVariant)
    : 0;
  const monthlyRate = totalPrice > 0 ? calcLowestRate(totalPrice) : 0;

  const handleCustomBatteryChange = (batteryId: string) => {
    setCustomBatteryId(batteryId);
    setCustomInverterId(null);

    const product = availableProducts.find((p) => p.id === batteryId);
    if (product?.compatible_inverters?.length === 1) {
      const autoInverter = inverters.find((i) => i.id === product.compatible_inverters![0]);
      if (autoInverter) {
        setCustomInverterId(autoInverter.id);
        setSelectedProductId(batteryId);
        setSelectedInverterId(autoInverter.id);
      }
    }
  };

  const handleCustomInverterChange = (inverterId: string) => {
    setCustomInverterId(inverterId);
    if (customBatteryId) {
      setSelectedProductId(customBatteryId);
      setSelectedInverterId(inverterId);
    }
  };

  const handleCustomConfirm = () => {
    if (customBatteryId && customInverterId) {
      setSelectedProductId(customBatteryId);
      setSelectedInverterId(customInverterId);
    }
  };

  const isCustomSelected = customBatteryId !== null && selectedProductId === customBatteryId;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Separator z przyciskiem */}
      <div className="relative flex items-center justify-center py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/50" />
        </div>
        <button
          onClick={() => setCustomOpen(!customOpen)}
          className={cn(
            'relative z-10 flex items-center gap-2.5 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200',
            customOpen
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
              : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
          )}
        >
          <Settings2 className="h-4 w-4" />
          <span>Własna konfiguracja</span>
          <ChevronDown className={cn(
            'h-4 w-4 transition-transform duration-200',
            customOpen && 'rotate-180'
          )} />
        </button>
      </div>

      {/* Panel */}
      <AnimatePresence>
        {customOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <div className={cn(
              'rounded-xl border-2 overflow-hidden transition-all',
              isCustomSelected
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card'
            )}>
              {/* Header */}
              <div className="px-6 py-4 border-b border-border/50 bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10">
                    <Settings2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base text-white">Własna konfiguracja</h3>
                    <p className="text-xs text-muted-foreground">Wybierz dowolny magazyn i kompatybilny falownik</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Selecty w grid */}
                <div className="grid gap-5 md:grid-cols-2">
                  {/* Select 1: Magazyn */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <NexbeIcon name="magazyn-energii" size={16} variant="inherit" className="text-primary" />
                      Magazyn energii
                    </label>
                    <Select
                      value={customBatteryId || ''}
                      onValueChange={handleCustomBatteryChange}
                    >
                      <SelectTrigger className="w-full h-11">
                        <SelectValue placeholder="Wybierz magazyn energii..." />
                      </SelectTrigger>
                      <SelectContent position="popper" className="max-h-[300px]">
                        {Object.entries(productsByBrand).map(([brand, products]) => (
                          <SelectGroup key={brand}>
                            <SelectLabel>{brand}</SelectLabel>
                            {products.map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.name} — {p.capacity_kwh} kWh — {formatCurrency(p.price_gross)}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Select 2: Falownik */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <NexbeIcon name="falownik" size={16} variant="inherit" className="text-primary" />
                      Falownik
                    </label>
                    <Select
                      value={customInverterId || ''}
                      onValueChange={handleCustomInverterChange}
                      disabled={!customBatteryId || compatibleInverters.length === 0}
                    >
                      <SelectTrigger className="w-full h-11">
                        <SelectValue
                          placeholder={
                            !customBatteryId
                              ? 'Najpierw wybierz magazyn'
                              : compatibleInverters.length === 0
                                ? 'Brak kompatybilnych falowników'
                                : 'Wybierz falownik...'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent position="popper" className="max-h-[300px]">
                        {compatibleInverters.map((inv) => (
                          <SelectItem key={inv.id} value={inv.id}>
                            {inv.name} — {inv.power_kw} kW ({inv.brand})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Podsumowanie */}
                {customProduct && customInverter && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border/30">
                        <NexbeIcon name="magazyn-energii" size={16} variant="inherit" className="text-primary mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium text-sm">{customProduct.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {customProduct.capacity_kwh} kWh · {customProduct.type} · {customProduct.brand}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border/30">
                        <NexbeIcon name="falownik" size={16} variant="inherit" className="text-primary mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium text-sm">{customInverter.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {customInverter.power_kw} kW · {customInverter.brand}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Cena + rata + przycisk */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/50">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm text-muted-foreground">Cena brutto:</span>
                          <span className="text-2xl font-heading text-primary">
                            {formatCurrency(totalPrice)}
                          </span>
                        </div>
                        {monthlyRate > 0 && (
                          <p className="text-sm text-muted-foreground">
                            Rata już od <span className="font-heading text-primary">{monthlyRate} zł/mies.</span>
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={handleCustomConfirm}
                        size="lg"
                        className="w-full sm:w-auto min-w-[200px]"
                        variant={isCustomSelected ? 'default' : 'outline'}
                      >
                        {isCustomSelected ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Wybrany
                          </>
                        ) : (
                          'Wybierz tę konfigurację'
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

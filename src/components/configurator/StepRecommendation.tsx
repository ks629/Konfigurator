'use client';

import { motion } from 'framer-motion';
import { useConfigurator } from '@/hooks/useConfigurator';
import { getRecommendations } from '@/lib/compatibility';
import { ProductCard } from './ProductCard';
import { Sparkles, Info } from 'lucide-react';

export function StepRecommendation() {
  const {
    installationType,
    pvPowerKwp,
    hasHeatPump,
    hasEV,
    backupPreference,
    selectedProductId,
    setSelectedProductId,
    setSelectedInverterId,
  } = useConfigurator();

  if (!installationType) return null;

  const recommendations = getRecommendations(
    installationType,
    pvPowerKwp,
    hasHeatPump,
    hasEV,
    backupPreference === 'yes'
  );

  if (!recommendations) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">
          Nie udało się dobrać produktu. Skontaktuj się z nami.
        </p>
      </div>
    );
  }

  const handleSelect = (productId: string, inverterId?: string) => {
    setSelectedProductId(productId);
    setSelectedInverterId(inverterId || null);
  };

  const { recommended, economic, premium } = recommendations;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-primary">
          <Sparkles className="h-6 w-6" />
          <h2 className="font-heading text-2xl md:text-3xl">
            Mamy dla Ciebie idealne rozwiązanie!
          </h2>
        </div>
        <p className="text-muted-foreground">
          Na podstawie Twoich danych dobraliśmy optymalną konfigurację
        </p>
      </div>

      {installationType === 'retrofit' && (
        <div className="flex items-start gap-2 p-4 rounded-lg bg-green-50 border border-green-200 text-sm max-w-3xl mx-auto">
          <Info className="h-4 w-4 text-green-700 mt-0.5 shrink-0" />
          <span className="text-green-800">
            Magazyn AC można podłączyć do każdego istniejącego falownika stringowego.
            Nie musisz wymieniać swojego obecnego falownika.
          </span>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
        {/* Economic */}
        {economic && (
          <ProductCard
            product={economic.product}
            inverter={economic.inverter}
            badge="Niższy koszt"
            badgeVariant="secondary"
            isRecommended={false}
            isSelected={selectedProductId === economic.product.id}
            onSelect={() => handleSelect(economic.product.id, economic.inverter?.id)}
          />
        )}

        {/* Recommended */}
        <ProductCard
          product={recommended.product}
          inverter={recommended.inverter}
          badge="Najlepszy wybór"
          badgeVariant="default"
          isRecommended={true}
          isSelected={selectedProductId === recommended.product.id}
          onSelect={() => handleSelect(recommended.product.id, recommended.inverter?.id)}
        />

        {/* Premium */}
        {premium && (
          <ProductCard
            product={premium.product}
            inverter={premium.inverter}
            badge="Maksimum korzyści"
            badgeVariant="outline"
            isRecommended={false}
            isSelected={selectedProductId === premium.product.id}
            onSelect={() => handleSelect(premium.product.id, premium.inverter?.id)}
          />
        )}
      </div>
    </motion.div>
  );
}

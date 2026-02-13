'use client';

import { motion } from 'framer-motion';
import { useConfigurator } from '@/hooks/useConfigurator';
import { getRecommendations } from '@/lib/compatibility';
import { ProductCard } from './ProductCard';
import { Sparkles, Info } from 'lucide-react';

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
          Nie udalo sie dobrac produktu. Skontaktuj sie z nami.
        </p>
      </div>
    );
  }

  const handleSelect = (productId: string, inverterId?: string) => {
    setSelectedProductId(productId);
    setSelectedInverterId(inverterId || null);
  };

  const { recommended, economic, premium } = recommendations;

  // Calculate lowest monthly rates for each option
  const recRate = calcLowestRate(recommended.product.price_gross + (recommended.inverter?.price_gross || 0));
  const econRate = economic ? calcLowestRate(economic.product.price_gross + (economic.inverter?.price_gross || 0)) : 0;
  const premRate = premium ? calcLowestRate(premium.product.price_gross + (premium.inverter?.price_gross || 0)) : 0;

  // Count how many options we have
  const optionCount = 1 + (economic ? 1 : 0) + (premium ? 1 : 0);
  const gridCols = optionCount >= 3 ? 'lg:grid-cols-3' : optionCount === 2 ? 'md:grid-cols-2' : '';

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
          <h2 className="font-heading text-2xl md:text-3xl text-white">
            Mamy dla Ciebie idealne rozwiązanie!
          </h2>
        </div>
        <p className="text-muted-foreground">
          Na podstawie Twoich danych dobraliśmy {optionCount >= 3 ? '3 warianty' : 'optymalną konfigurację'} — wybierz najlepszy dla siebie
        </p>
      </div>

      {installationType === 'retrofit' && (
        <div className="flex items-start gap-2 p-4 rounded-lg bg-green-50 border border-green-200 text-sm max-w-5xl mx-auto">
          <Info className="h-4 w-4 text-green-700 mt-0.5 shrink-0" />
          <span className="text-green-800">
            Magazyn AC można podłączyć do każdego istniejącego falownika stringowego.
            Nie musisz wymieniać swojego obecnego falownika.
          </span>
        </div>
      )}

      <div className={`grid gap-6 ${gridCols} max-w-5xl mx-auto`}>
        {/* Economic option */}
        {economic && (
          <ProductCard
            product={economic.product}
            inverter={economic.inverter}
            badge="Oszczędny"
            badgeVariant="secondary"
            isRecommended={false}
            isSelected={selectedProductId === economic.product.id}
            onSelect={() => handleSelect(economic.product.id, economic.inverter?.id)}
            monthlyRate={econRate}
          />
        )}

        {/* Recommended — always present, center position */}
        <ProductCard
          product={recommended.product}
          inverter={recommended.inverter}
          badge="Najlepszy wybór"
          badgeVariant="default"
          isRecommended={true}
          isSelected={selectedProductId === recommended.product.id}
          onSelect={() => handleSelect(recommended.product.id, recommended.inverter?.id)}
          monthlyRate={recRate}
        />

        {/* Premium option */}
        {premium && (
          <ProductCard
            product={premium.product}
            inverter={premium.inverter}
            badge="Premium"
            badgeVariant="outline"
            isRecommended={false}
            isPremium={true}
            isSelected={selectedProductId === premium.product.id}
            onSelect={() => handleSelect(premium.product.id, premium.inverter?.id)}
            monthlyRate={premRate}
          />
        )}
      </div>
    </motion.div>
  );
}

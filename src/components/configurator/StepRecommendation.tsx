'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useConfigurator } from '@/hooks/useConfigurator';
import { getAllEligibleProducts } from '@/lib/compatibility';
import { inverters } from '@/data/products';
import { ProductCard } from './ProductCard';
import { Sparkles, Info, ChevronLeft, ChevronRight } from 'lucide-react';

const CARDS_PER_PAGE = 3;

const premiumBrands = ['Sigenergy', 'Huawei'];

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

  const [page, setPage] = useState(0);

  if (!installationType) return null;

  const allOptions = getAllEligibleProducts(
    pvPowerKwp,
    hasHeatPump,
    hasEV,
    backupPreference === 'yes'
  );

  if (allOptions.length === 0) {
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

  const handleUpgradeInverter = (newProductId: string) => {
    const inv = inverters.find(i => i.compatible_batteries.includes(newProductId));
    setSelectedProductId(newProductId);
    setSelectedInverterId(inv?.id || null);
  };

  const isRetrofit = installationType === 'retrofit';
  const useBackupPrice = backupPreference === 'yes';
  const totalPages = Math.ceil(allOptions.length / CARDS_PER_PAGE);
  const startIdx = page * CARDS_PER_PAGE;
  const visibleOptions = allOptions.slice(startIdx, startIdx + CARDS_PER_PAGE);

  // First product (cheapest at min capacity) = recommended
  const recommendedId = allOptions[0]?.product.id;

  const gridCols = visibleOptions.length >= 3 ? 'lg:grid-cols-3' : visibleOptions.length === 2 ? 'md:grid-cols-2' : '';

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
          Dobraliśmy {allOptions.length} konfiguracji spełniających warunki dofinansowania — wybierz najlepszą dla siebie
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

      {/* Carousel navigation */}
      <div className="relative max-w-5xl mx-auto">
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mb-4">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-2 rounded-full border border-border bg-card hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Poprzednie"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-muted-foreground">
              {startIdx + 1}–{Math.min(startIdx + CARDS_PER_PAGE, allOptions.length)} z {allOptions.length}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-2 rounded-full border border-border bg-card hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Następne"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        <div className={`grid gap-6 ${gridCols}`}>
          {visibleOptions.map(({ product, inverter }) => {
            const isRec = product.id === recommendedId;
            const isPrem = premiumBrands.includes(product.brand);

            return (
              <ProductCard
                key={product.id}
                product={product}
                inverter={inverter}
                badge={isRec ? 'Najlepszy wybór' : isPrem ? 'Premium' : product.brand}
                badgeVariant={isRec ? 'default' : isPrem ? 'outline' : 'secondary'}
                isRecommended={isRec}
                isPremium={isPrem && !isRec}
                isSelected={selectedProductId === product.id}
                onSelect={() => handleSelect(product.id, inverter?.id)}
                onUpgradeInverter={handleUpgradeInverter}
                useBackupPrice={useBackupPrice}
                isRetrofit={isRetrofit}
              />
            );
          })}
        </div>

        {/* Dot indicators */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-2 rounded-full transition-all ${
                  i === page ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/30'
                }`}
                aria-label={`Strona ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

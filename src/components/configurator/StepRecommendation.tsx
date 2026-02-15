'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConfigurator } from '@/hooks/useConfigurator';
import { getTopPicks, getBrandProducts } from '@/lib/compatibility';
import { inverters } from '@/data/products';
import { ProductCard } from './ProductCard';
import { Sparkles, Info, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

const CARDS_PER_PAGE = 3;

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

  // null = main view (3 top picks), string = brand drill-down
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  if (!installationType) return null;

  const topPicks = getTopPicks(pvPowerKwp, hasHeatPump, hasEV);

  if (!topPicks) {
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

  const handleBrandClick = (brand: string) => {
    setSelectedBrand(brand);
    setPage(0);
  };

  const handleBackToMain = () => {
    setSelectedBrand(null);
    setPage(0);
  };

  const isRetrofit = installationType === 'retrofit';
  const useBackupPrice = backupPreference === 'yes';

  // === BRAND DRILL-DOWN VIEW ===
  if (selectedBrand) {
    const brandProducts = getBrandProducts(selectedBrand, pvPowerKwp, hasHeatPump, hasEV);
    const totalPages = Math.ceil(brandProducts.length / CARDS_PER_PAGE);
    const startIdx = page * CARDS_PER_PAGE;
    const visible = brandProducts.slice(startIdx, startIdx + CARDS_PER_PAGE);
    const gridCols = visible.length >= 3 ? 'lg:grid-cols-3' : visible.length === 2 ? 'md:grid-cols-2' : '';

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div className="max-w-5xl mx-auto">
          <button
            onClick={handleBackToMain}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Wróć do wyboru producenta
          </button>

          <div className="text-center space-y-2 mb-6">
            <h2 className="font-heading text-2xl md:text-3xl text-white">
              Konfiguracje {selectedBrand}
            </h2>
            <p className="text-muted-foreground">
              {brandProducts.length} {brandProducts.length === 1 ? 'konfiguracja' : brandProducts.length < 5 ? 'konfiguracje' : 'konfiguracji'} spełniających warunki dofinansowania
            </p>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mb-4">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-2 rounded-full border border-border bg-card hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm text-muted-foreground">
                {startIdx + 1}–{Math.min(startIdx + CARDS_PER_PAGE, brandProducts.length)} z {brandProducts.length}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="p-2 rounded-full border border-border bg-card hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}

          <div className={`grid gap-6 ${gridCols}`}>
            {visible.map(({ product, inverter }) => (
              <ProductCard
                key={product.id}
                product={product}
                inverter={inverter}
                badge={product.capacity_kwh + ' kWh'}
                badgeVariant="secondary"
                isRecommended={false}
                isSelected={selectedProductId === product.id}
                onSelect={() => handleSelect(product.id, inverter?.id)}
                onUpgradeInverter={handleUpgradeInverter}
                useBackupPrice={useBackupPrice}
                isRetrofit={isRetrofit}
              />
            ))}
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
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // === MAIN VIEW — 3 TOP PICKS ===
  const { cheapest, bestSeller, premium } = topPicks;

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
          Na podstawie Twoich danych dobraliśmy 3 warianty — wybierz najlepszy dla siebie
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

      <div className="grid gap-6 lg:grid-cols-3 max-w-5xl mx-auto">
        {/* Najtańszy */}
        <ProductCard
          product={cheapest.product}
          inverter={cheapest.inverter}
          badge="Najtańszy"
          badgeVariant="secondary"
          isRecommended={false}
          isSelected={selectedProductId === cheapest.product.id}
          onSelect={() => handleSelect(cheapest.product.id, cheapest.inverter?.id)}
          onUpgradeInverter={handleUpgradeInverter}
          useBackupPrice={useBackupPrice}
          isRetrofit={isRetrofit}
          onBrandClick={() => handleBrandClick(cheapest.product.brand.split('/')[0])}
        />

        {/* Best Seller */}
        <ProductCard
          product={bestSeller.product}
          inverter={bestSeller.inverter}
          badge="Best Seller"
          badgeVariant="default"
          isRecommended={true}
          isSelected={selectedProductId === bestSeller.product.id}
          onSelect={() => handleSelect(bestSeller.product.id, bestSeller.inverter?.id)}
          onUpgradeInverter={handleUpgradeInverter}
          useBackupPrice={useBackupPrice}
          isRetrofit={isRetrofit}
          onBrandClick={() => handleBrandClick(bestSeller.product.brand.split('/')[0])}
        />

        {/* Premium */}
        <ProductCard
          product={premium.product}
          inverter={premium.inverter}
          badge="Premium"
          badgeVariant="outline"
          isRecommended={false}
          isPremium={true}
          isSelected={selectedProductId === premium.product.id}
          onSelect={() => handleSelect(premium.product.id, premium.inverter?.id)}
          onUpgradeInverter={handleUpgradeInverter}
          useBackupPrice={useBackupPrice}
          isRetrofit={isRetrofit}
          onBrandClick={() => handleBrandClick(premium.product.brand.split('/')[0])}
        />
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Kliknij na kartę producenta, aby zobaczyć więcej konfiguracji z jego gamy
      </p>
    </motion.div>
  );
}

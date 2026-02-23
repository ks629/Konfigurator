'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConfigurator } from '@/hooks/useConfigurator';
import { getRecommendedProducts, getBrandProducts } from '@/lib/compatibility';
import { inverters } from '@/data/products';
import Image from 'next/image';
import { ProductCard } from './ProductCard';
import { NexbeIcon } from '@nexbe/icons';
import { Info, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { getBrandLogos } from '@/lib/brand-logos';

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

  // null = main view, string = brand drill-down
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  // Carousel index for "others" in main view
  const [othersStart, setOthersStart] = useState(0);

  if (!installationType) return null;

  const picks = getRecommendedProducts(pvPowerKwp, hasHeatPump, hasEV);

  if (!picks) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">
          Nie udalo sie dobrac produktu. Skontaktuj sie z nami.
        </p>
      </div>
    );
  }

  const { recommended, others } = picks;

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
            <h2 className="font-heading text-2xl md:text-3xl text-white flex items-center justify-center gap-3 flex-wrap">
              <span>Konfiguracje</span>
              {getBrandLogos(selectedBrand).map((logo) => (
                <Image key={logo.alt} src={logo.src} alt={logo.alt} width={140} height={32} className="h-7 md:h-8 w-auto brightness-0 invert inline-block" />
              ))}
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

  // === MAIN VIEW — 1 recommended + carousel of others ===

  // How many "others" cards visible at once (max 2 on desktop to keep layout balanced)
  const OTHERS_VISIBLE = Math.min(others.length, 2);
  const canScrollLeft = othersStart > 0;
  const canScrollRight = othersStart + OTHERS_VISIBLE < others.length;
  const visibleOthers = others.slice(othersStart, othersStart + OTHERS_VISIBLE);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-primary">
          <NexbeIcon name="smart-ems" size={24} variant="inherit" />
          <h2 className="font-heading text-2xl md:text-3xl text-white">
            Mamy dla Ciebie idealne rozwiązanie!
          </h2>
        </div>
        <p className="text-muted-foreground">
          Wybraliśmy najlepszy zestaw dla Twojej instalacji — zobacz też inne pasujące opcje
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

      <div className="max-w-5xl mx-auto">
        {/* Grid: recommended (wider) + others carousel */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Recommended — takes 2 cols */}
          <div className="lg:col-span-2">
            <ProductCard
              product={recommended.product}
              inverter={recommended.inverter}
              badge="Rekomendacja"
              badgeVariant="default"
              isRecommended={true}
              isSelected={selectedProductId === recommended.product.id}
              onSelect={() => handleSelect(recommended.product.id, recommended.inverter?.id)}
              onUpgradeInverter={handleUpgradeInverter}
              useBackupPrice={useBackupPrice}
              isRetrofit={isRetrofit}
              onBrandClick={() => handleBrandClick(recommended.product.brand.split('/')[0])}
            />
          </div>

          {/* Others carousel — takes 3 cols */}
          {others.length > 0 && (
            <div className="lg:col-span-3 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">
                  Inne pasujące zestawy ({others.length})
                </p>
                {others.length > OTHERS_VISIBLE && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setOthersStart(s => Math.max(0, s - 1))}
                      disabled={!canScrollLeft}
                      className="p-1.5 rounded-full border border-border bg-card hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {othersStart + 1}–{Math.min(othersStart + OTHERS_VISIBLE, others.length)} / {others.length}
                    </span>
                    <button
                      onClick={() => setOthersStart(s => Math.min(others.length - OTHERS_VISIBLE, s + 1))}
                      disabled={!canScrollRight}
                      className="p-1.5 rounded-full border border-border bg-card hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className={`grid gap-4 flex-1 ${visibleOthers.length >= 2 ? 'md:grid-cols-2' : ''}`}>
                <AnimatePresence mode="popLayout">
                  {visibleOthers.map(({ product, inverter }) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ProductCard
                        product={product}
                        inverter={inverter}
                        badge={
                          PREMIUM_BRANDS.includes(product.brand)
                            ? 'Premium'
                            : BESTSELLER_BRANDS.includes(product.brand)
                            ? 'Best Seller'
                            : product.capacity_kwh + ' kWh'
                        }
                        badgeVariant={
                          PREMIUM_BRANDS.includes(product.brand)
                            ? 'outline'
                            : BESTSELLER_BRANDS.includes(product.brand)
                            ? 'default'
                            : 'secondary'
                        }
                        isRecommended={false}
                        isPremium={PREMIUM_BRANDS.includes(product.brand)}
                        isSelected={selectedProductId === product.id}
                        onSelect={() => handleSelect(product.id, inverter?.id)}
                        onUpgradeInverter={handleUpgradeInverter}
                        useBackupPrice={useBackupPrice}
                        isRetrofit={isRetrofit}
                        onBrandClick={() => handleBrandClick(product.brand.split('/')[0])}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Dot indicators */}
              {others.length > OTHERS_VISIBLE && (
                <div className="flex items-center justify-center gap-1.5 mt-3">
                  {Array.from({ length: others.length - OTHERS_VISIBLE + 1 }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setOthersStart(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === othersStart ? 'w-5 bg-primary' : 'w-2 bg-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Kliknij na kartę producenta, aby zobaczyć więcej konfiguracji z jego gamy
      </p>
    </motion.div>
  );
}

// Re-export brand constants for badge logic
const BESTSELLER_BRANDS = ['FoxESS'];
const PREMIUM_BRANDS = ['Sigenergy'];

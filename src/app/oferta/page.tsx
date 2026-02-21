'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useConfigurator } from '@/hooks/useConfigurator';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SavingsSummary } from '@/components/calculator/SavingsSummary';
import { ROIChart } from '@/components/calculator/ROIChart';
import { ProjectionTable } from '@/components/calculator/ProjectionTable';
import { FinancingSimulator } from '@/components/calculator/FinancingSimulator';
import { ContactForm } from '@/components/forms/ContactForm';
import { PdfDownloadButton } from '@/components/pdf/PdfDownloadButton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { allProducts } from '@/data/products';
import { inverters } from '@/data/products';
import { calculateROI, calculateMonthlyFromBill, formatCurrency } from '@/lib/calculations';
import { getBackupEstimate, getRecommendations } from '@/lib/compatibility';
import { ContactFormData } from '@/lib/validations';
import type { PdfOfferData } from '@/lib/pdf-generator';
import type { RecommendationSet } from '@/lib/compatibility';
import { NexbeIcon } from '@nexbe/icons';
import {
  CalendarCheck,
  Calendar,
  Check,
  ArrowLeft,
  Info,
  TrendingDown,
  FileText,
  Wrench,
  Settings,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: 'easeOut' } },
};

export default function OfertaPage() {
  const store = useConfigurator();
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [selectedOptionKey, setSelectedOptionKey] = useState<'economic' | 'recommended' | 'premium'>('recommended');

  const selectedProduct = useMemo(
    () => allProducts.find((p) => p.id === store.selectedProductId) || null,
    [store.selectedProductId]
  );

  const selectedInverter = useMemo(
    () => inverters.find((i) => i.id === store.selectedInverterId) || null,
    [store.selectedInverterId]
  );

  // Get 3 recommended product options based on user's configuration
  const recommendations: RecommendationSet | null = useMemo(() => {
    if (!store.installationType) return null;
    return getRecommendations(
      store.installationType,
      store.pvPowerKwp,
      store.hasHeatPump,
      store.hasEV,
      store.backupPreference === 'yes'
    );
  }, [store.installationType, store.pvPowerKwp, store.hasHeatPump, store.hasEV, store.backupPreference]);

  // Resolve the currently active product from the 3 options
  const activeProduct = useMemo(() => {
    if (!recommendations) return selectedProduct;
    if (selectedOptionKey === 'economic' && recommendations.economic) return recommendations.economic.product;
    if (selectedOptionKey === 'premium' && recommendations.premium) return recommendations.premium.product;
    return recommendations.recommended.product;
  }, [recommendations, selectedOptionKey, selectedProduct]);

  const calculation = useMemo(() => {
    if (!activeProduct || !store.installationType) return null;

    const annualConsumption =
      store.consumptionMode === 'bill'
        ? calculateMonthlyFromBill(store.monthlyBill)
        : store.annualConsumptionKwh;

    return calculateROI({
      pv_power_kwp: store.pvPowerKwp,
      annual_consumption_kwh: annualConsumption,
      billing_system: store.billingSystem,
      battery_capacity_kwh: activeProduct.capacity_kwh,
      battery_price_gross: activeProduct.price_gross,
      installation_type: store.installationType,
      needs_inverter_upgrade: false,
      inverter_price_gross: 0,
      needs_backup: true,
      // Nowe pola
      user_profile: store.userProfile,
      energy_operator: store.energyOperator,
      tariff: store.tariff,
      pv_orientation: store.pvOrientation,
      wants_subsidy: store.wantsSubsidy,
      thermomodernization_used_percent: store.thermomodernizationUsedPercent,
      tax_bracket: store.taxBracket,
    });
  }, [activeProduct, store, selectedOptionKey]);

  const handleContactSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch('/api/send-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          postalCode: data.postalCode,
          config: store,
          product: activeProduct,
          inverter: selectedInverter,
          calculation,
        }),
      });
      const result = await response.json();
      console.log('Offer sent:', result);
    } catch (error) {
      console.error('Failed to send offer:', error);
    }
  };

  // PDF data do pobrania
  const pdfData: PdfOfferData | null = useMemo(() => {
    if (!activeProduct || !calculation) return null;
    return {
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      clientPostalCode: '',
      product: activeProduct,
      inverter: selectedInverter || undefined,
      calculation,
      config: store as import('@/lib/types').ConfiguratorState,
    };
  }, [activeProduct, selectedInverter, calculation, store]);

  if (!activeProduct || !calculation) {
    return (
      <div className="nexbe-dark dark min-h-screen flex flex-col bg-[#0f0520]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <h2 className="font-heading text-2xl">Brak skonfigurowanej oferty</h2>
            <p className="text-muted-foreground">
              Najpierw przejdź przez konfigurator, aby dobrać produkt.
            </p>
            <Button asChild>
              <Link href="/konfigurator">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Przejdź do konfiguratora
              </Link>
            </Button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  const backupEstimate = getBackupEstimate(
    activeProduct.capacity_kwh,
    store.hasHeatPump
  );

  // Build the 3 option cards
  const optionCards: {
    key: 'economic' | 'recommended' | 'premium';
    label: string;
    badge: string | null;
    badgeColor: string;
    icon: React.ReactNode;
    product: import('@/lib/types').Product;
    description: string;
  }[] = [];

  if (recommendations?.economic) {
    optionCards.push({
      key: 'economic',
      label: 'Ekonomiczny',
      badge: 'Oszczędny',
      badgeColor: 'bg-blue-600 text-white',
      icon: <TrendingDown className="h-5 w-5" />,
      product: recommendations.economic.product,
      description: 'Mniejsza pojemność, niższa cena — idealna gdy chcesz zminimalizować koszt inwestycji.',
    });
  }

  if (recommendations) {
    optionCards.push({
      key: 'recommended',
      label: 'Rekomendowany',
      badge: 'Najlepszy wybór',
      badgeColor: 'bg-[#B5005D] text-white',
      icon: <NexbeIcon name="gwiazdki-opinie" size={20} variant="inherit" />,
      product: recommendations.recommended.product,
      description: 'Optymalnie dobrany do Twojej instalacji PV i zużycia energii.',
    });
  }

  if (recommendations?.premium) {
    optionCards.push({
      key: 'premium',
      label: 'Premium',
      badge: 'Większa pojemność',
      badgeColor: 'bg-[#350066] text-white',
      icon: <NexbeIcon name="roi" size={20} variant="inherit" />,
      product: recommendations.premium.product,
      description: 'Większa pojemność na przyszłość — więcej niezależności energetycznej.',
    });
  }

  const timelineSteps = [
    {
      icon: <CalendarCheck className="h-5 w-5" />,
      title: 'Bezpłatny audyt techniczny',
      desc: 'Wizyta technika w domu',
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: 'Finalna wycena i umowa',
      desc: 'Podpisanie umowy i warunków',
    },
    {
      icon: <Wrench className="h-5 w-5" />,
      title: 'Montaż i uruchomienie',
      desc: 'Realizacja w 2-3 tygodnie',
    },
    {
      icon: <Settings className="h-5 w-5" />,
      title: 'Zgłoszenie do OSD',
      desc: 'Konfiguracja i podłączenie',
    },
    {
      icon: <NexbeIcon name="certyfikat" size={20} variant="inherit" />,
      title: 'Dotacja Mój Prąd 7.0',
      desc: 'Pomoc w złożeniu wniosku',
    },
  ];

  return (
    <div className="nexbe-dark dark min-h-screen flex flex-col bg-[#0f0520]">
      <Header />

      <main className="flex-1 relative">
        {/* Animated energy pulse orbs */}
        <div className="energy-orb energy-orb-1" />
        <div className="energy-orb energy-orb-2" />
        <div className="energy-orb energy-orb-3" />

        {/* ===== HERO SECTION with gradient ===== */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#230045] via-[#350066] to-[#4a0080]">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#B5005D]/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#B5005D]/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full" />
          </div>

          <div className="container mx-auto px-4 py-14 md:py-20 relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center space-y-4 max-w-3xl mx-auto"
            >
              <motion.div variants={cardVariants}>
                <Badge className="bg-white/10 text-white/90 border-white/20 hover:bg-white/15 text-sm backdrop-blur-sm">
                  Indywidualna oferta
                </Badge>
              </motion.div>
              <motion.h1 variants={cardVariants} className="font-heading text-3xl md:text-5xl text-white">
                Twoja oferta magazynu energii
              </motion.h1>
              <motion.p variants={cardVariants} className="text-white/70 max-w-2xl mx-auto text-lg">
                Przygotowana na podstawie Twojej konfiguracji.
                Wybierz wariant dopasowany do Twoich potrzeb.
              </motion.p>
            </motion.div>
          </div>

          {/* Curved bottom edge */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
              <path d="M0 48h1440V24C1200 0 240 0 0 24v24z" className="fill-muted/20" />
            </svg>
          </div>
        </section>

        <div className="bg-muted/20">
          <div className="container mx-auto px-4 py-10 md:py-14">

            {/* ===== 3 PRODUCT OPTION CARDS ===== */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={staggerContainer}
              className="max-w-5xl mx-auto mb-14"
            >
              <motion.h2 variants={cardVariants} className="font-heading text-2xl text-center mb-8">
                Wybierz wariant magazynu
              </motion.h2>

              <div className={`grid gap-6 ${optionCards.length === 3 ? 'md:grid-cols-3' : optionCards.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 'max-w-md mx-auto'}`}>
                {optionCards.map((option, idx) => {
                  const isSelected = selectedOptionKey === option.key;
                  const isRecommended = option.key === 'recommended';
                  const prod = option.product;

                  return (
                    <motion.button
                      key={option.key}
                      custom={idx}
                      variants={fadeUp}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedOptionKey(option.key)}
                      className={`relative text-left rounded-2xl border-2 p-6 transition-all duration-300 ${
                        isSelected
                          ? 'border-[#B5005D] bg-white shadow-xl shadow-[#B5005D]/10 ring-1 ring-[#B5005D]/20'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
                      } ${isRecommended ? 'md:-mt-2 md:mb-[-8px] md:scale-[1.02]' : ''}`}
                    >
                      {option.badge && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                          <span className={`text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap shadow-sm ${option.badgeColor}`}>
                            {option.badge}
                          </span>
                        </div>
                      )}

                      <div className="space-y-4 pt-1">
                        <div className="flex items-center gap-2">
                          <span className={`transition-colors ${isSelected ? 'text-[#B5005D]' : 'text-muted-foreground'}`}>
                            {option.icon}
                          </span>
                          <h3 className="font-heading text-xl">{option.label}</h3>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="relative w-16 h-16 bg-gradient-to-br from-muted to-muted/50 rounded-xl overflow-hidden shrink-0">
                            {prod.image ? (
                              <Image
                                src={prod.image}
                                alt={prod.name}
                                fill
                                className="object-contain p-1"
                                sizes="64px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <NexbeIcon name="magazyn-energii" size={32} variant="inherit" className="text-muted-foreground/30" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{prod.name}</p>
                            <p className="text-xs text-muted-foreground">{prod.brand}</p>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {option.description}
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-3 py-1.5">
                            <NexbeIcon name="magazyn-energii" size={14} variant="inherit" className="text-primary" />
                            <span className="font-medium">{prod.capacity_kwh} kWh</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-3 py-1.5">
                            <NexbeIcon name="smart-ems" size={14} variant="inherit" className="text-primary" />
                            <span className="font-medium">{prod.power_continuous_kw} kW</span>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <p className="text-2xl font-bold text-[#230045]">
                            {formatCurrency(prod.price_gross)}
                          </p>
                          <p className="text-xs text-muted-foreground">brutto z montażem i EMS</p>
                        </div>

                        <div className={`w-full py-2.5 px-4 text-center text-sm font-medium rounded-xl transition-all duration-300 ${
                          isSelected
                            ? 'bg-[#B5005D] text-white shadow-sm'
                            : 'bg-muted/60 text-muted-foreground'
                        }`}>
                          {isSelected ? '✓ Wybrany wariant' : 'Wybierz'}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* ===== COMBINED INFO SECTION (Backup + EMS + Shield) ===== */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={staggerContainer}
              className="max-w-4xl mx-auto mb-12"
            >
              <motion.div variants={cardVariants} className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                  {/* Left: Included in price */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#350066]/10 flex items-center justify-center">
                        <Info className="h-4 w-4 text-[#350066]" />
                      </div>
                      <h3 className="font-heading text-base text-[#350066]">W cenie zestawu</h3>
                    </div>
                    <div className="space-y-3">
                      {[
                        { icon: <NexbeIcon name="falownik" size={16} variant="inherit" />, text: 'Falownik hybrydowy 10 kW' },
                        { icon: <NexbeIcon name="smart-ems" size={16} variant="inherit" />, text: 'System EMS (zarządzanie energią)' },
                        { icon: <NexbeIcon name="blackout-ochrona" size={16} variant="inherit" />, text: 'Backup / SZR (zasilanie awaryjne)' },
                        { icon: <Calendar className="h-4 w-4" />, text: 'Montaż i uruchomienie' },
                      ].map((item) => (
                        <div key={item.text} className="flex items-center gap-3 text-sm">
                          <div className="w-7 h-7 rounded-md bg-[#B5005D]/10 flex items-center justify-center shrink-0">
                            <span className="text-[#B5005D]">{item.icon}</span>
                          </div>
                          <span className="text-[#350066]/80">{item.text}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-[#350066]/60 pt-1">
                      Spełnia wymagania dotacji Mój Prąd 7.0
                    </p>
                  </div>

                  {/* Right: Backup details */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <NexbeIcon name="blackout-ochrona" size={16} variant="inherit" className="text-blue-700" />
                      </div>
                      <h3 className="font-heading text-base text-blue-800">Zasilanie awaryjne</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-blue-50 rounded-xl p-4">
                        <div>
                          <p className="text-sm text-blue-700">Czas pracy awaryjnej</p>
                          <p className="text-2xl font-heading text-blue-800">
                            {backupEstimate.hours_min}–{backupEstimate.hours_max} <span className="text-base font-normal">godz.</span>
                          </p>
                        </div>
                        <NexbeIcon name="blackout-ochrona" size={40} variant="inherit" className="text-blue-200" />
                      </div>
                      <p className="text-xs text-blue-600">
                        Podstawowe urządzenia domowe. Automatyczne przełączanie SZR w mniej niż 20 ms.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* ===== SUBSIDY SAVINGS ===== */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={staggerContainer}
              className="max-w-4xl mx-auto mb-14"
            >
              <motion.div variants={cardVariants} className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 border border-green-200 rounded-2xl p-8 md:p-10 space-y-6 overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-green-200/30 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-emerald-200/20 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10">
                  <h3 className="font-heading text-xl text-green-900 text-center">
                    Oszczędzasz z dotacjami
                  </h3>

                  {/* Big price display */}
                  <div className="flex flex-col items-center gap-4 mt-6">
                    {/* Before price - crossed out */}
                    <div className="text-center">
                      <p className="text-xs text-green-700/60 uppercase tracking-widest mb-1">Cena katalogowa</p>
                      <p className="text-2xl text-gray-400 line-through">
                        {formatCurrency(calculation.investment.total_gross)}
                      </p>
                    </div>

                    {/* Subsidy amount - green pill */}
                    <div className="flex items-center gap-2.5 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg shadow-green-600/20">
                      <TrendingDown className="h-5 w-5" />
                      <span className="font-bold text-lg">
                        -{formatCurrency(calculation.investment.total_subsidies)}
                      </span>
                      <span className="text-sm opacity-90">dofinansowanie</span>
                    </div>

                    {/* After price - highlighted */}
                    <div className="text-center mt-3">
                      <p className="text-xs text-green-700/60 uppercase tracking-widest mb-2">Twoja cena po dotacji</p>
                      <p className="text-5xl md:text-6xl font-bold text-green-700 tracking-tight">
                        {formatCurrency(calculation.investment.net_cost)}
                      </p>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="grid gap-4 sm:grid-cols-2 pt-6 mt-6 border-t border-green-200/80">
                    <div className="flex items-start gap-3 bg-white/60 rounded-xl p-4">
                      <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-heading text-green-900">Mój Prąd 7.0</p>
                        <p className="text-xs text-green-700 mt-0.5">
                          Do {formatCurrency(Math.min(activeProduct.capacity_kwh * 800, 16000))} dotacji
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-white/60 rounded-xl p-4">
                      <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-heading text-green-900">Ulga termomodernizacyjna</p>
                        <p className="text-xs text-green-700 mt-0.5">
                          {calculation.investment.thermomodernization_details
                            ? `${calculation.investment.thermomodernization_details.tax_bracket}% odliczenie — ${formatCurrency(calculation.investment.tax_relief)}`
                            : `${store.taxBracket}% odliczenie od podatku — do ${formatCurrency(Math.round(calculation.investment.total_gross * (store.taxBracket / 100)))}`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* ===== CALCULATION RESULTS ===== */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={staggerContainer}
              className="max-w-5xl mx-auto space-y-8"
            >
              <motion.h2 variants={cardVariants} className="font-heading text-2xl text-center">
                Analiza opłacalności
              </motion.h2>

              <motion.div variants={cardVariants} className="grid gap-8 lg:grid-cols-2">
                <SavingsSummary result={calculation} />
                <div className="space-y-8">
                  <FinancingSimulator result={calculation} />
                </div>
              </motion.div>

              <motion.div variants={cardVariants}>
                <ROIChart
                  projection={calculation.projection}
                  roiYear={calculation.roi_years}
                />
              </motion.div>

              <motion.div variants={cardVariants}>
                <ProjectionTable projection={calculation.projection} horizonYears={calculation.horizon_years} />
              </motion.div>

              {/* ===== TIMELINE: Co dalej? ===== */}
              <motion.div variants={cardVariants} className="bg-white rounded-2xl border shadow-sm p-8 md:p-10">
                <h3 className="font-heading text-xl text-center mb-8">Co dalej?</h3>

                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-[#B5005D] via-[#350066] to-[#230045] hidden md:block" />

                  <div className="space-y-6 md:space-y-0 md:grid md:gap-0">
                    {timelineSteps.map((step, i) => (
                      <motion.div
                        key={step.title}
                        custom={i}
                        variants={fadeUp}
                        className="flex items-start gap-4 md:pb-8 last:md:pb-0"
                      >
                        <div className="relative z-10 w-10 h-10 rounded-full bg-gradient-to-br from-[#B5005D] to-[#350066] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#B5005D]/20">
                          {step.icon}
                        </div>
                        <div className="pt-1.5">
                          <p className="font-heading text-sm">{step.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* ===== CTA SECTION ===== */}
              <motion.div
                variants={cardVariants}
                className="relative rounded-2xl overflow-hidden no-print"
              >
                <div className="bg-gradient-to-r from-[#230045] via-[#350066] to-[#230045] p-8 md:p-12">
                  {/* Decorative */}
                  <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#B5005D]/20 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#B5005D]/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative z-10 text-center space-y-4">
                    <h3 className="font-heading text-xl md:text-2xl text-white">
                      Gotowy na niezależność energetyczną?
                    </h3>
                    <p className="text-white/70 max-w-lg mx-auto text-sm">
                      Umów bezpłatny audyt techniczny i otrzymaj ostateczną wycenę.
                      Pomożemy Ci uzyskać dotację Mój Prąd 7.0.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
                      <Button
                        size="lg"
                        className="text-lg px-8 h-14 bg-[#B5005D] hover:bg-[#9a004f] text-white shadow-lg shadow-[#B5005D]/30 rounded-xl"
                        onClick={() => setContactFormOpen(true)}
                      >
                        <CalendarCheck className="h-5 w-5 mr-2" />
                        Umów bezpłatny audyt
                      </Button>
                      {pdfData && (
                        <PdfDownloadButton
                          data={pdfData}
                          className="text-lg px-8 h-14 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl backdrop-blur-sm"
                          label="Pobierz ofertę PDF"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </main>

      <Footer />

      <ContactForm
        open={contactFormOpen}
        onOpenChange={setContactFormOpen}
        onSubmit={handleContactSubmit}
      />
    </div>
  );
}

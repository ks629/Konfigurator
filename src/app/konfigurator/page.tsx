'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { useConfigurator } from '@/hooks/useConfigurator';
import { useOrder } from '@/hooks/useOrder';
import { Header } from '@/components/layout/Header';
import { ProgressBar } from '@/components/configurator/ProgressBar';
import { StepInstallationType } from '@/components/configurator/StepInstallationType';
import { StepPVData } from '@/components/configurator/StepPVData';
import { StepConsumption } from '@/components/configurator/StepConsumption';
import { StepAdditionalNeeds } from '@/components/configurator/StepAdditionalNeeds';
import { StepRecommendation } from '@/components/configurator/StepRecommendation';
import { SavingsSummary } from '@/components/calculator/SavingsSummary';
import { ROIChart } from '@/components/calculator/ROIChart';
import { ProjectionTable } from '@/components/calculator/ProjectionTable';
import { FinancingSimulator } from '@/components/calculator/FinancingSimulator';
import { ContactForm } from '@/components/forms/ContactForm';
import { Button } from '@/components/ui/button';
import { ResumeProgressBanner } from '@/components/ui/ResumeProgressBanner';
import { NexbeIcon } from '@nexbe/icons';
import { ArrowLeft, ArrowRight, FileText, CalendarCheck, Zap, ShoppingCart } from 'lucide-react';
import { calculateROI, calculateMonthlyFromBill, formatCurrency } from '@/lib/calculations';
import { allProducts } from '@/data/products';
import { inverters } from '@/data/products';
import { ContactFormData } from '@/lib/validations';
import { generateOfferPdfBlob, type PdfOfferData } from '@/lib/pdf-generator';

const TOTAL_STEPS = 5;

export default function KonfiguratorPage() {
  const router = useRouter();
  const store = useConfigurator();
  const { createFromConfigurator } = useOrder();
  const { currentStep, nextStep, prevStep, setStep, selectedProductId, selectedInverterId } = store;
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [contactData, setContactData] = useState<ContactFormData | null>(null);

  const selectedProduct = useMemo(
    () => allProducts.find((p) => p.id === selectedProductId) || null,
    [selectedProductId]
  );

  const selectedInverter = useMemo(
    () => inverters.find((i) => i.id === selectedInverterId) || null,
    [selectedInverterId]
  );

  const calculation = useMemo(() => {
    if (!selectedProduct || !store.installationType) return null;

    let annualConsumption =
      store.consumptionMode === 'bill'
        ? calculateMonthlyFromBill(store.monthlyBill)
        : store.annualConsumptionKwh;
    // Pompa ciepła i EV zwiększają zapotrzebowanie na energię
    if (store.hasHeatPump) annualConsumption += 3000;
    if (store.hasEV) annualConsumption += 3000;

    const batteryPrice = store.backupVariant === 'B'
      ? selectedProduct.price_gross_b
      : selectedProduct.price_gross;

    return calculateROI({
      pv_power_kwp: store.pvPowerKwp,
      annual_consumption_kwh: annualConsumption,
      billing_system: store.billingSystem,
      battery_capacity_kwh: selectedProduct.capacity_kwh,
      battery_price_gross: batteryPrice,
      installation_type: store.installationType,
      needs_inverter_upgrade: false, // falownik wliczony w cenę zestawu
      inverter_price_gross: 0, // falownik wliczony w cenę zestawu
      needs_backup: store.backupVariant === 'B', // backup SZR tylko w wariancie B
      // Nowe pola
      user_profile: store.userProfile,
      energy_operator: store.energyOperator,
      tariff: store.tariff,
      pv_orientation: store.pvOrientation,
      wants_subsidy: store.wantsSubsidy,
      thermomodernization_used_percent: store.thermomodernizationUsedPercent,
      tax_bracket: store.taxBracket,
    });
  }, [selectedProduct, selectedInverter, store]);

  // Kalkulacja z taryfą dynamiczną (do porównania)
  const dynamicCalculation = useMemo(() => {
    if (!selectedProduct || !store.installationType) return null;
    if (store.tariff === 'dynamic') return null; // już jest dynamiczna

    let annualConsumption =
      store.consumptionMode === 'bill'
        ? calculateMonthlyFromBill(store.monthlyBill)
        : store.annualConsumptionKwh;
    if (store.hasHeatPump) annualConsumption += 3000;
    if (store.hasEV) annualConsumption += 3000;

    const batteryPriceDyn = store.backupVariant === 'B'
      ? selectedProduct.price_gross_b
      : selectedProduct.price_gross;

    return calculateROI({
      pv_power_kwp: store.pvPowerKwp,
      annual_consumption_kwh: annualConsumption,
      billing_system: store.billingSystem,
      battery_capacity_kwh: selectedProduct.capacity_kwh,
      battery_price_gross: batteryPriceDyn,
      installation_type: store.installationType,
      needs_inverter_upgrade: false,
      inverter_price_gross: 0,
      needs_backup: store.backupVariant === 'B',
      user_profile: store.userProfile,
      energy_operator: store.energyOperator,
      tariff: 'dynamic',
      pv_orientation: store.pvOrientation,
      wants_subsidy: store.wantsSubsidy,
      thermomodernization_used_percent: store.thermomodernizationUsedPercent,
      tax_bracket: store.taxBracket,
    });
  }, [selectedProduct, selectedInverter, store]);

  const canGoNext = useMemo(() => {
    switch (currentStep) {
      case 1:
        return store.installationType !== null;
      case 2:
        return store.pvPowerKwp > 0 && store.inverterBrand !== '';
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return selectedProductId !== null;
      default:
        return false;
    }
  }, [currentStep, store, selectedProductId]);

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
          product: selectedProduct,
          inverter: selectedInverter,
          calculation,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Błąd wysyłki');
      console.log('Offer sent:', result);
      setContactData(data); // Save for PDF download
    } catch (error) {
      console.error('Failed to send offer:', error);
      throw error;
    }
  };

  const handleDownloadPdf = async () => {
    if (!selectedProduct || !calculation || !contactData) return;

    const pdfData: PdfOfferData = {
      clientName: contactData.name,
      clientEmail: contactData.email,
      clientPhone: contactData.phone,
      clientPostalCode: contactData.postalCode || '',
      product: selectedProduct,
      inverter: selectedInverter || undefined,
      calculation,
      config: store,
      offerNumber: `NEXBE-${Date.now()}`,
    };

    const blob = await generateOfferPdfBlob(pdfData);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oferta-nexbe-${selectedProduct.brand}-${selectedProduct.capacity_kwh}kWh.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepInstallationType />;
      case 2:
        return <StepPVData />;
      case 3:
        return <StepConsumption />;
      case 4:
        return <StepAdditionalNeeds />;
      case 5:
        return <StepRecommendation />;
      default:
        return null;
    }
  };

  const showCalculation = currentStep === 5 && selectedProductId && calculation;

  return (
    <div className="nexbe-dark dark min-h-screen flex flex-col bg-[#0f0520]">
      <Header />

      <main className="flex-1">
        {/* Subtle background grid */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" style={{
          backgroundImage: `linear-gradient(rgba(181,0,93,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(181,0,93,0.3) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />
        {/* Animated energy pulse orbs */}
        <div className="energy-orb energy-orb-1" />
        <div className="energy-orb energy-orb-2" />
        <div className="energy-orb energy-orb-3" />

        <div className="container mx-auto px-4 py-6 md:py-10 relative z-10">
          {/* Resume progress banner */}
          <div className="max-w-3xl mx-auto">
            <ResumeProgressBanner />
          </div>

          {/* Progress */}
          <div className="max-w-3xl mx-auto mb-8">
            <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} onStepClick={setStep} />
          </div>

          {/* Social proof */}
          {(currentStep === 1 || currentStep === 5) && (
            <div className="max-w-3xl mx-auto mb-6 flex items-center justify-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                500+ instalacji w 2025
              </span>
              <span className="w-px h-3 bg-white/10" />
              <span className="flex items-center gap-1">
                {'★★★★★'.split('').map((s, i) => <span key={i} className="text-amber-400">{s}</span>)}
                <span className="ml-1">4.8/5</span>
              </span>
            </div>
          )}

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <div key={currentStep}>{renderStep()}</div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="max-w-4xl mx-auto mt-8 flex items-center justify-between no-print">
            {currentStep > 1 ? (
              <Button variant="outline" onClick={prevStep} size="lg" className="border-white/20 text-white hover:bg-white/5">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Wstecz
              </Button>
            ) : (
              <div />
            )}

            {currentStep < TOTAL_STEPS && currentStep !== 1 && (
              <Button onClick={nextStep} disabled={!canGoNext} size="lg" className="bg-gradient-to-r from-[#B5005D] to-[#8B0048] hover:from-[#D4006E] hover:to-[#9A0050] text-white shadow-lg shadow-[#B5005D]/20">
                Dalej
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Calculation Results */}
          {showCalculation && calculation && (
            <div className="max-w-5xl mx-auto mt-12 space-y-8">
              <div className="text-center space-y-2">
                <h2 className="font-heading text-2xl md:text-3xl text-white">
                  Twoja kalkulacja oszczędności
                </h2>
                <p className="text-gray-400">
                  Szczegółowa analiza opłacalności inwestycji w magazyn energii
                </p>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                <SavingsSummary result={calculation} product={selectedProduct} inverter={selectedInverter} backupVariant={store.backupVariant} />
                <div className="space-y-8">
                  <FinancingSimulator result={calculation} />
                </div>
              </div>

              {/* Dynamic Tariff Comparison Banner */}
              {dynamicCalculation && store.tariff !== 'dynamic' && (
                <div className="rounded-xl border-2 border-amber-400/30 bg-gradient-to-r from-amber-400/5 via-card to-amber-400/5 p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-400/10">
                      <NexbeIcon name="smart-ems" size={24} variant="inherit" className="text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg text-white">
                        Zmień taryfę na dynamiczną — oszczędzaj więcej!
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Magazyn energii pozwala ładować tanim prądem w nocy i zużywać w szczycie
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-card rounded-lg p-3 border border-white/10">
                      <p className="text-xs text-muted-foreground mb-1">Obecna taryfa ({store.tariff.toUpperCase()})</p>
                      <p className="text-lg font-heading text-white">
                        {calculation.annual_savings > 0 ? '+' : ''}{calculation.annual_savings.toLocaleString('pl-PL')} zł
                      </p>
                      <p className="text-xs text-muted-foreground">rocznie</p>
                    </div>
                    <div className="bg-amber-400/10 rounded-lg p-3 border border-amber-400/30">
                      <p className="text-xs text-amber-300 mb-1">Taryfa dynamiczna</p>
                      <p className="text-lg font-heading text-amber-400">
                        {dynamicCalculation.annual_savings > 0 ? '+' : ''}{dynamicCalculation.annual_savings.toLocaleString('pl-PL')} zł
                      </p>
                      <p className="text-xs text-amber-300">rocznie</p>
                    </div>
                    <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/30">
                      <p className="text-xs text-green-300 mb-1">Dodatkowa korzyść</p>
                      <p className="text-lg font-heading text-green-400">
                        +{(dynamicCalculation.annual_savings - calculation.annual_savings).toLocaleString('pl-PL')} zł
                      </p>
                      <p className="text-xs text-green-300">rocznie więcej</p>
                    </div>
                  </div>

                  {dynamicCalculation.roi_years && calculation.roi_years && dynamicCalculation.roi_years < calculation.roi_years && (
                    <p className="text-sm text-amber-300">
                      ⚡ Zwrot inwestycji szybszy o <span className="font-heading">{calculation.roi_years - dynamicCalculation.roi_years} {calculation.roi_years - dynamicCalculation.roi_years === 1 ? 'rok' : (calculation.roi_years - dynamicCalculation.roi_years < 5 ? 'lata' : 'lat')}</span> ({dynamicCalculation.roi_years} zamiast {calculation.roi_years} lat)
                    </p>
                  )}

                  <Button
                    onClick={() => store.setTariff('dynamic')}
                    className="bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:from-amber-500 hover:to-amber-600 font-bold"
                  >
                    <NexbeIcon name="smart-ems" size={16} variant="inherit" className="mr-2" />
                    Przelicz z taryfą dynamiczną
                  </Button>
                </div>
              )}

              <ROIChart
                projection={calculation.projection}
                roiYear={calculation.roi_years}
              />

              <ProjectionTable projection={calculation.projection} horizonYears={calculation.horizon_years} />

              {/* CTA */}
              <div className="flex flex-col items-center gap-4 pt-8 pb-4 no-print">
                {/* Primary CTA — KUP ONLINE */}
                <Button
                  size="lg"
                  className="text-lg px-10 h-16 bg-gradient-to-r from-[#350066] via-[#B5005D] to-[#FF004E] hover:from-[#4a0080] hover:via-[#D4006E] hover:to-[#FF1A5E] text-white shadow-xl shadow-[#B5005D]/30 rounded-2xl w-full sm:w-auto"
                  onClick={() => {
                    if (!selectedProduct || !calculation) return;
                    createFromConfigurator({
                      config: store,
                      product: selectedProduct,
                      inverter: selectedInverter,
                      calculation,
                    });
                    router.push('/zamowienie');
                  }}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  KUP ONLINE — od {formatCurrency(Math.round((calculation?.investment.net_cost ?? 0) * 0.3))}
                </Button>
                <p className="text-xs text-muted-foreground -mt-1">
                  Zaliczka 30% online. Resztę płacisz przy montażu.
                </p>

                {/* Secondary CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-sm px-6 h-12 border-white/20 text-white hover:bg-white/5"
                    onClick={() => setContactFormOpen(true)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Pobierz ofertę PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-sm px-6 h-12 border-white/20 text-white hover:bg-white/5"
                    onClick={() => setContactFormOpen(true)}
                  >
                    <CalendarCheck className="h-4 w-4 mr-2" />
                    Umów bezpłatny audyt
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Contact Form Dialog */}
      <ContactForm
        open={contactFormOpen}
        onOpenChange={setContactFormOpen}
        onSubmit={handleContactSubmit}
        onDownloadPdf={handleDownloadPdf}
      />
    </div>
  );
}

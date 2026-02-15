'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useConfigurator } from '@/hooks/useConfigurator';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
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
import { ArrowLeft, ArrowRight, FileText, CalendarCheck } from 'lucide-react';
import { calculateROI, calculateMonthlyFromBill } from '@/lib/calculations';
import { allProducts } from '@/data/products';
import { inverters } from '@/data/products';
import { ContactFormData } from '@/lib/validations';

const TOTAL_STEPS = 5;

export default function KonfiguratorPage() {
  const store = useConfigurator();
  const { currentStep, nextStep, prevStep, setStep, selectedProductId, selectedInverterId } = store;
  const [contactFormOpen, setContactFormOpen] = useState(false);

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

    const annualConsumption =
      store.consumptionMode === 'bill'
        ? calculateMonthlyFromBill(store.monthlyBill)
        : store.annualConsumptionKwh;

    return calculateROI({
      pv_power_kwp: store.pvPowerKwp,
      annual_consumption_kwh: annualConsumption,
      billing_system: store.billingSystem,
      battery_capacity_kwh: selectedProduct.capacity_kwh,
      battery_price_gross: selectedProduct.price_gross,
      installation_type: store.installationType,
      needs_inverter_upgrade: false, // falownik wliczony w cenę zestawu
      inverter_price_gross: 0, // falownik wliczony w cenę zestawu
      needs_backup: true, // backup/SZR wliczony w cenę zestawu
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
    } catch (error) {
      console.error('Failed to send offer:', error);
      throw error;
    }
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
          {/* Progress */}
          <div className="max-w-3xl mx-auto mb-8">
            <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} onStepClick={setStep} />
          </div>

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
                <SavingsSummary result={calculation} />
                <div className="space-y-8">
                  <FinancingSimulator result={calculation} />
                </div>
              </div>

              <ROIChart
                projection={calculation.projection}
                roiYear={calculation.roi_years}
              />

              <ProjectionTable projection={calculation.projection} horizonYears={calculation.horizon_years} />

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-8 pb-4 no-print">
                <Button
                  size="lg"
                  className="text-lg px-8 h-14 bg-gradient-to-r from-[#B5005D] to-[#8B0048] hover:from-[#D4006E] hover:to-[#9A0050] text-white shadow-lg shadow-[#B5005D]/20"
                  onClick={() => setContactFormOpen(true)}
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Pobierz szczegółową ofertę
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 h-14 border-white/20 text-white hover:bg-white/5"
                  onClick={() => setContactFormOpen(true)}
                >
                  <CalendarCheck className="h-5 w-5 mr-2" />
                  Umów bezpłatny audyt
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Contact Form Dialog */}
      <ContactForm
        open={contactFormOpen}
        onOpenChange={setContactFormOpen}
        onSubmit={handleContactSubmit}
      />
    </div>
  );
}

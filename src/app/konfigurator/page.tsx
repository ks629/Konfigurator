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
  const { currentStep, nextStep, prevStep, selectedProductId, selectedInverterId } = store;
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
      needs_inverter_upgrade: store.installationType !== 'retrofit',
      inverter_price_gross: selectedInverter?.price_gross || 0,
      needs_backup: store.backupPreference === 'yes',
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
    // In production, this would send to /api/send-offer
    console.log('Lead data:', { ...data, config: store, selectedProduct, calculation });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
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
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 md:py-10">
          {/* Progress */}
          <div className="max-w-3xl mx-auto mb-8">
            <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <div key={currentStep}>{renderStep()}</div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="max-w-4xl mx-auto mt-8 flex items-center justify-between no-print">
            {currentStep > 1 ? (
              <Button variant="outline" onClick={prevStep} size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Wstecz
              </Button>
            ) : (
              <div />
            )}

            {currentStep < TOTAL_STEPS && currentStep !== 1 && (
              <Button onClick={nextStep} disabled={!canGoNext} size="lg">
                Dalej
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Calculation Results */}
          {showCalculation && calculation && (
            <div className="max-w-5xl mx-auto mt-12 space-y-8">
              <div className="text-center space-y-2">
                <h2 className="font-heading text-2xl md:text-3xl">
                  Twoja kalkulacja oszczednosci
                </h2>
                <p className="text-muted-foreground">
                  Szczegolowa analiza opplacalnosci inwestycji w magazyn energii
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

              <ProjectionTable projection={calculation.projection} />

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-8 pb-4 no-print">
                <Button
                  size="lg"
                  className="text-lg px-8 h-14"
                  onClick={() => setContactFormOpen(true)}
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Pobierz szczegolowa oferte
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 h-14"
                  onClick={() => setContactFormOpen(true)}
                >
                  <CalendarCheck className="h-5 w-5 mr-2" />
                  Umow bezplatny audyt
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

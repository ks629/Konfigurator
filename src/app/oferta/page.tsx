'use client';

import { useMemo, useState } from 'react';
import { useConfigurator } from '@/hooks/useConfigurator';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SavingsSummary } from '@/components/calculator/SavingsSummary';
import { ROIChart } from '@/components/calculator/ROIChart';
import { ProjectionTable } from '@/components/calculator/ProjectionTable';
import { FinancingSimulator } from '@/components/calculator/FinancingSimulator';
import { ContactForm } from '@/components/forms/ContactForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { allProducts } from '@/data/products';
import { inverters } from '@/data/products';
import { calculateROI, calculateMonthlyFromBill, formatCurrency } from '@/lib/calculations';
import { getBackupEstimate } from '@/lib/compatibility';
import { ContactFormData } from '@/lib/validations';
import {
  FileText,
  CalendarCheck,
  Battery,
  Zap,
  Shield,
  Calendar,
  Check,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

export default function OfertaPage() {
  const store = useConfigurator();
  const [contactFormOpen, setContactFormOpen] = useState(false);

  const selectedProduct = useMemo(
    () => allProducts.find((p) => p.id === store.selectedProductId) || null,
    [store.selectedProductId]
  );

  const selectedInverter = useMemo(
    () => inverters.find((i) => i.id === store.selectedInverterId) || null,
    [store.selectedInverterId]
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

  const handleContactSubmit = async (data: ContactFormData) => {
    console.log('Lead from offer page:', data);
    await new Promise((resolve) => setTimeout(resolve, 1500));
  };

  if (!selectedProduct || !calculation) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="font-heading text-2xl">Brak skonfigurowanej oferty</h2>
            <p className="text-muted-foreground">
              Najpierw przejdz przez konfigurator, aby dobrac produkt.
            </p>
            <Button asChild>
              <Link href="/konfigurator">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Przejdz do konfiguratora
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const backupEstimate = getBackupEstimate(
    selectedProduct.capacity_kwh,
    store.hasHeatPump
  );

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Title */}
          <div className="text-center space-y-3 mb-10">
            <Badge variant="secondary" className="text-sm">
              Indywidualna oferta
            </Badge>
            <h1 className="font-heading text-3xl md:text-4xl">
              Twoja oferta magazynu energii
            </h1>
            <p className="text-muted-foreground">
              Przygotowana na podstawie Twojej konfiguracji
            </p>
          </div>

          {/* Selected Product */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="bg-card rounded-xl border overflow-hidden">
              <div className="bg-primary/5 p-6 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-40 h-40 bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center shrink-0">
                  <Battery className="h-16 w-16 text-muted-foreground/30" />
                </div>
                <div className="flex-1 text-center md:text-left space-y-2">
                  <Badge>Wybrany produkt</Badge>
                  <h2 className="font-heading text-2xl">{selectedProduct.name}</h2>
                  {selectedInverter && (
                    <p className="text-muted-foreground">
                      + Falownik {selectedInverter.name}
                    </p>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <Battery className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{selectedProduct.capacity_kwh} kWh</p>
                        <p className="text-xs text-muted-foreground">Pojemnosc</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{selectedProduct.power_continuous_kw} kW</p>
                        <p className="text-xs text-muted-foreground">Moc ciagla</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{selectedProduct.type}</p>
                        <p className="text-xs text-muted-foreground">Typ</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{selectedProduct.warranty_years} lat</p>
                        <p className="text-xs text-muted-foreground">Gwarancja</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Backup info */}
              {store.backupPreference === 'yes' && (
                <div className="p-4 border-t bg-blue-50">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-blue-700" />
                    <span className="font-medium text-blue-800">Zasilanie awaryjne:</span>
                    <span className="text-blue-700">
                      {backupEstimate.hours_min}-{backupEstimate.hours_max} godzin
                      (podstawowe urzadzenia)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Calculation Results */}
          <div className="max-w-5xl mx-auto space-y-8">
            <h2 className="font-heading text-2xl text-center">Analiza opplacalnosci</h2>

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

            {/* Next steps */}
            <div className="bg-card rounded-xl border p-6 md:p-8 space-y-6">
              <h3 className="font-heading text-xl">Co dalej?</h3>
              <div className="space-y-4">
                {[
                  'Bezplatny audyt techniczny',
                  'Finalna wycena montazu',
                  'Montaz i uruchomienie (1-2 dni)',
                  'Zgloszenie do OSD',
                  'Pomoc w uzyskaniu dotacji Moj Prad',
                ].map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-heading text-sm shrink-0">
                      {i + 1}
                    </div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4 pb-8 no-print">
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

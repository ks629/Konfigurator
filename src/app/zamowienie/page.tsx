'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { useOrder } from '@/hooks/useOrder';
import { formatCurrency } from '@/lib/calculations';
import {
  Battery,
  Zap,
  Shield,
  ArrowLeft,
  ShoppingCart,
  Check,
  CreditCard,
  Banknote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';

export default function ZamowieniePage() {
  const router = useRouter();
  const { order } = useOrder();

  useEffect(() => {
    if (!order) {
      router.replace('/konfigurator');
    }
  }, [order, router]);

  if (!order) {
    return (
      <div className="nexbe-dark dark min-h-screen flex flex-col bg-[#0f0520]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Przekierowywanie do konfiguratora...</p>
          </div>
        </main>
      </div>
    );
  }

  const { produkt, finanse } = order;

  return (
    <div className="nexbe-dark dark min-h-screen flex flex-col bg-[#0f0520]">
      <Header />

      <main className="flex-1 relative">
        {/* Background effects */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" style={{
          backgroundImage: `linear-gradient(rgba(181,0,93,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(181,0,93,0.3) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />
        <div className="energy-orb energy-orb-1" />
        <div className="energy-orb energy-orb-2" />

        <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
          {/* Back link */}
          <Link
            href="/konfigurator"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Wróć do konfiguratora
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3 mb-10"
          >
            <Badge className="bg-white/10 text-white/90 border-white/20 backdrop-blur-sm">
              <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
              Krok 6 z 10
            </Badge>
            <h1 className="font-heading text-3xl md:text-4xl text-white">
              PODSUMOWANIE ZAMÓWIENIA
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Sprawdź szczegóły i wybierz sposób płatności
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto grid gap-8 lg:grid-cols-5">
            {/* Product card — 3 cols */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-3 rounded-2xl border border-white/10 bg-[#1A0A2E]/80 backdrop-blur-sm p-6 space-y-6"
            >
              <div className="flex items-start gap-4">
                <div className="relative w-20 h-20 bg-white/5 rounded-xl overflow-hidden shrink-0">
                  {produkt.zdjecie ? (
                    <Image
                      src={produkt.zdjecie}
                      alt={produkt.nazwa}
                      fill
                      className="object-contain p-2"
                      sizes="80px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Battery className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{produkt.marka}</p>
                  <h2 className="font-heading text-xl text-white">{produkt.nazwa}</h2>
                  <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Battery className="h-3.5 w-3.5" />
                      {produkt.pojemnosc_kwh} kWh
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="h-3.5 w-3.5" />
                      {produkt.moc_kw} kW
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="h-3.5 w-3.5" />
                      {produkt.gwarancja_lat} lat gwarancji
                    </span>
                  </div>
                </div>
              </div>

              {/* Price breakdown */}
              <div className="space-y-3 border-t border-white/10 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Zestaw z montażem (brutto)</span>
                  <span className="text-white">{formatCurrency(finanse.razem_brutto)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-400">
                  <span>Dotacja Mój Prąd 7.0</span>
                  <span>-{formatCurrency(finanse.dotacja_moj_prad)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-400">
                  <span>Ulga termomodernizacyjna</span>
                  <span>-{formatCurrency(finanse.ulga_termo)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-white/10 pt-3">
                  <span className="text-white">TWÓJ KOSZT</span>
                  <span className="text-white">{formatCurrency(finanse.po_dotacjach)}</span>
                </div>
              </div>

              {/* ROI info */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <p className="text-xs text-muted-foreground">Oszczędność roczna</p>
                  <p className="font-heading text-lg text-white">
                    {formatCurrency(finanse.roczna_oszczednosc)}
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <p className="text-xs text-muted-foreground">Zwrot inwestycji</p>
                  <p className="font-heading text-lg text-white">
                    {finanse.lat_zwrotu ? `${finanse.lat_zwrotu} lat` : '—'}
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <p className="text-xs text-muted-foreground">Oszczędność 20 lat</p>
                  <p className="font-heading text-lg text-white">
                    {formatCurrency(finanse.oszczednosc_20_lat)}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Payment selection — 2 cols */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-4"
            >
              <h3 className="font-heading text-lg text-white">Wybierz sposób płatności</h3>

              {/* Deposit option */}
              <button
                disabled
                className="w-full text-left rounded-2xl border-2 border-white/10 bg-[#1A0A2E]/80 backdrop-blur-sm p-5 space-y-3 opacity-60 cursor-not-allowed transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B5005D] to-[#FF004E] flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-heading text-white">Zaliczka 30%</p>
                    <p className="text-xs text-muted-foreground">BLIK / przelew / karta</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(finanse.zaliczka_30)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Resztę ({formatCurrency(finanse.reszta_przy_montazu)}) płacisz przy montażu
                  </p>
                </div>
                <Badge variant="outline" className="border-white/20 text-muted-foreground text-xs">
                  Dostępne wkrótce
                </Badge>
              </button>

              {/* Installment option */}
              <button
                disabled
                className="w-full text-left rounded-2xl border-2 border-white/10 bg-[#1A0A2E]/80 backdrop-blur-sm p-5 space-y-3 opacity-60 cursor-not-allowed transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Banknote className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-heading text-white">Raty</p>
                    <p className="text-xs text-muted-foreground">Wniosek online — decyzja 24h</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-white/20 text-muted-foreground text-xs">
                  Dostępne wkrótce
                </Badge>
              </button>

              {/* Subsidy note */}
              <div className="flex items-start gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-sm">
                <Check className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                <span className="text-green-300 text-xs">
                  Nexbe załatwia dotację Mój Prąd 7.0 za Ciebie — <strong>0 zł</strong> za obsługę wniosku
                </span>
              </div>
            </motion.div>
          </div>

          {/* Order number */}
          <div className="max-w-4xl mx-auto mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Nr zamówienia: {order.numer}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
